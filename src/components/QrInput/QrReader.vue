<template>
  <canvas
    v-show="false"
    class="canvas"
    ref="canvas"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import jsQr, { QRCode } from 'jsqr'

interface ComponentData {
  data: QRCode | null;
}

const wait = async (duration: number) => new Promise(r => setTimeout(r, duration));

export default Vue.extend({
  props: {
    videoElement: {
      type: HTMLVideoElement,
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
    };
  },

  computed: {
    canScan(): boolean {
      return !this.disabled && !!this.videoElement;
    }
  },

  watch: {
    data({ data: newData }) {
      this.$emit('change', newData);
    },

    videoElement(videoElement: HTMLVideoElement | null): void {
      if (!videoElement) return;

      this.setupCanvas(videoElement);
    },
  },

  methods: {
    coordinateScanning(ctx: CanvasRenderingContext2D, videoElement: HTMLVideoElement) {
      if (!this.canScan) return;

      ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
      const imageData = ctx.getImageData(0, 0, videoElement.videoWidth, videoElement.videoHeight);

      return new Promise<void>((resolve) => {
        setImmediate(() => {
          const code = jsQr(imageData.data, videoElement.videoWidth, videoElement.videoHeight);
          if (code && code.data) {
            this.data = code;
          }
          resolve();
        });
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    },

    async setupCanvas(videoElement: HTMLVideoElement) {
      const canvasEl = (this.$refs.canvas as HTMLCanvasElement);
      const ctx = canvasEl.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.canvas.width = videoElement.videoWidth;
      ctx.canvas.height = videoElement.videoHeight;
      ctx.clearRect(0, 0, videoElement.videoWidth, videoElement.videoHeight);

      this.doScan(ctx, videoElement);
    },

    async doScan(ctx: CanvasRenderingContext2D, videoElement: HTMLVideoElement) {
      const start = performance.now();
      await this.coordinateScanning(ctx, videoElement);
      const diff = performance.now() - start;

      const scanInterval = this.scanInterval;
      if (diff < scanInterval) {
        await wait(scanInterval - diff);
      }

      this.doScan(ctx, videoElement);
    }
  },
});
</script>

<style scoped lang="scss">
.canvas {
  width: 100%;
}
</style>
