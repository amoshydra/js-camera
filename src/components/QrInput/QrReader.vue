<template>
  <canvas
    v-show="false"
    class="canvas"
    ref="canvas"
  />
  <QrReaderDebug
    v-if="showDebug"
    :videoElement="videoElement"
    :isVideoReady="isVideoReady"
    :isVideoPlaying="isVideoPlaying"
    :isScanning="isScanning"
    :videoWidth="videoWidth"
    :videoHeight="videoHeight"
    :data="data?.data ?? null"
    :scanCount="scanCount"
    :lastError="lastError"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import jsQr, { QRCode } from 'jsqr'
import QrReaderDebug from './QrReaderDebug.vue'

interface ComponentData {
  data: QRCode | null
  isVideoReady: boolean
  isVideoPlaying: boolean
  isScanning: boolean
  debug: boolean
  lastError: string | null
  scanCount: number
}

export default defineComponent({
  components: {
    QrReaderDebug,
  },

  props: {
    debug: {
      type: Boolean,
      default: false,
    },
    videoElement: {
      type: Object as () => HTMLVideoElement,
      default: null,
    },
    scanInterval: {
      type: Number,
      default: 500,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data(): ComponentData {
    return {
      data: null,
      isVideoReady: false,
      isVideoPlaying: false,
      isScanning: false,
      debug: false,
      lastError: null,
      scanCount: 0,
    }
  },

  computed: {
    showDebug(): boolean {
      if (this.debug) return true
      return new URLSearchParams(window.location.search).get('debug') === 'true'
    },
    canScan(): boolean {
      return !this.disabled && !!this.videoElement && this.isVideoReady && this.isVideoPlaying
    },
    videoWidth(): number {
      return this.videoElement?.videoWidth ?? 0
    },
    videoHeight(): number {
      return this.videoElement?.videoHeight ?? 0
    }
  },

  watch: {
    data(newData: QRCode | null) {
      this.$emit('change', newData?.data ?? null)
    },

    videoElement(videoElement: HTMLVideoElement | null): void {
      if (!videoElement) {
        this.isVideoReady = false
        this.isVideoPlaying = false
        return
      }

      const initVideo = () => {
        this.isVideoReady = true
        if (videoElement.readyState >= 2) {
          this.setupCanvas(videoElement)
        }
      }

      if (videoElement.readyState >= 2) {
        initVideo()
      } else {
        videoElement.addEventListener('loadedmetadata', initVideo, { once: true })
      }

      videoElement.addEventListener('playing', () => {
        this.isVideoPlaying = true
        this.setupCanvas(videoElement)
      }, { once: true })
    },
  },

  methods: {
    coordinateScanning(ctx: CanvasRenderingContext2D, videoElement: HTMLVideoElement) {
      if (!this.canScan) return

      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        return
      }

      this.scanCount++

      ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight)
      const imageData = ctx.getImageData(0, 0, videoElement.videoWidth, videoElement.videoHeight)

      try {
        const code = jsQr(imageData.data, videoElement.videoWidth, videoElement.videoHeight)
        if (code && code.data) {
          this.data = code
          this.lastError = null
        } else {
          this.lastError = 'No QR found'
        }
      } catch (e) {
        this.lastError = String(e)
      }
    },

    async setupCanvas(videoElement: HTMLVideoElement) {
      const canvasEl = (this.$refs.canvas as HTMLCanvasElement)
      const ctx = canvasEl.getContext('2d')
      if (!ctx) {
        return
      }

      ctx.canvas.width = videoElement.videoWidth
      ctx.canvas.height = videoElement.videoHeight
      ctx.clearRect(0, 0, videoElement.videoWidth, videoElement.videoHeight)

      this.doScan(ctx, videoElement)
    },

    doScan(ctx: CanvasRenderingContext2D, videoElement: HTMLVideoElement) {
      if (this.disabled) {
        this.isScanning = false
        return
      }

      this.isScanning = true
      this.coordinateScanning(ctx, videoElement)

      const scanInterval = this.scanInterval
      setTimeout(() => {
        if (!this.disabled) {
          this.doScan(ctx, videoElement)
        }
      }, scanInterval)
    }
  },
})
</script>

<style scoped>
.canvas {
  width: 100%;
}
</style>
