<template>
  <div id="app">
    <video
      class="video"
      ref="video" autoplay
    ></video>
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
import ContentRenderer from './components/ContentRenderer.vue'
import jsQr, { QRCode } from 'jsqr'

interface ComponentData {
  data: QRCode | null;
}

export default Vue.extend({
  name: 'App',
  components: {
    ContentRenderer,
  },
  data(): ComponentData {
    return {
      data: null
    };
  },
  async mounted() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
    });

    const videoEl = (this.$refs.video as HTMLVideoElement);
    const canvasEl = (this.$refs.canvas as HTMLCanvasElement);

    videoEl.srcObject = stream;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
      return;
    }

    setInterval(() => {
      ctx.canvas.width = videoEl.videoWidth;
      ctx.canvas.height = videoEl.videoHeight;
      ctx.clearRect(0, 0, videoEl.videoWidth, videoEl.videoHeight);
      ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
      const imageData = ctx.getImageData(0, 0, videoEl.videoWidth, videoEl.videoHeight);

      setTimeout(() => {
        const code = jsQr(imageData.data, videoEl.videoWidth, videoEl.videoHeight);
        if (code && code.data) {
          this.data = code;
        }
      })
    }, 500);
  },

  computed: {
    hasGetUserMedia() {
      alert(navigator.getUserMedia)
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.video {
  width: 100%;
}

.canvas {
  width: 100%;
}
</style>
