<template>
  <div>
    <CameraFeed
      class="video"
      autoplay
      @ready="setupCanvas"
    />
    <canvas
      v-show="false"
      class="canvas"
      ref="canvas"
    />
    <ContentRenderer
      v-if="data"
      :data="data"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ContentRenderer from './ContentRenderer.vue'
import CameraFeed from './camera-feed.vue'
import jsQr, { QRCode } from 'jsqr'

interface ComponentData {
  data: QRCode | null;
  disabled: boolean;
}

export default Vue.extend({
  components: {
    ContentRenderer,
    CameraFeed,
  },

  props: {
    scanInterval: {
      type: Number,
      default: 500,
    },
  },

  data(): ComponentData {
    return {
      data: null,
      disabled: false,
    };
  },

  watch: {
    data(newData) {
      this.$emit('change', newData);
    },
  },

  methods: {
    coordinateScanning(ctx: CanvasRenderingContext2D, videoElement: HTMLVideoElement) {
      ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
      const imageData = ctx.getImageData(0, 0, videoElement.videoWidth, videoElement.videoHeight);

      return new Promise((resolve) => {
        setTimeout(() => {
          const code = jsQr(imageData.data, videoElement.videoWidth, videoElement.videoHeight);
          if (code && code.data) {
            this.data = code;
          }
          resolve();
        })
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

      const wait = async (duration: number) => new Promise(r => setTimeout(r, duration));

      while(!this.disabled) {
        console.log(performance.now());
        const start = performance.now();
        await this.coordinateScanning(ctx, videoElement);
        const diff = performance.now() - start;

        if (diff < this.scanInterval) {
          await wait(diff);
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
.video {
  width: 100%;
}

.canvas {
  width: 100%;
}
</style>
