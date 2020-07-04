<template>
  <video
    v-if="!hasError && hasGetUserMedia"
    ref="video"
    autoplay
    @loadeddata="loadeddata"
  />

  <div
    class="error"
    v-else
  >
    <div style="font-size: 5em; margin-bottom: 0.5em;">😟</div>
    I cannot access to the camera.
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: 640,
    },
    height: {
      type: Number,
      default: 480,
    },
    facingMode: {
      type: String,
      default: 'environment',
    },
  },

  data() {
    return {
      hasError: false,
    };
  },

  async mounted() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: this.width },
          height: { ideal: this.height }
        },
      });
      const videoEl = (this.$refs.video as HTMLVideoElement);
      videoEl.srcObject = stream;
    } catch (error) {
      this.hasError = true;
    }
  },

  methods: {
    loadeddata() {
      const videoEl = (this.$refs.video as HTMLVideoElement);
      this.$emit('ready', videoEl);
    }
  },

  computed: {
    hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
  }
});
</script>

<style scoped>
.error {
  border: 1em solid maroon;
  padding-top: 3em;
  padding-bottom: 3em;
  box-sizing: border-box;
}
</style>
