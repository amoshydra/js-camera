<template>
  <video
    v-if="!error"
    ref="video"
    autoplay
    @loadeddata="loadeddata"
  />

  <CameraFeedErrorPresenter
    :error="error"
    v-else
  />
</template>

<script lang="ts">
import Vue from 'vue';
import CameraFeedErrorPresenter from './CameraFeedErrorPresenter.vue';

export default Vue.extend({
  components: {
    CameraFeedErrorPresenter,
  },

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
      error: null as Error | null,
    };
  },

  async mounted() {
    await this.getCamera();
  },

  methods: {
    async getCamera(): Promise<void> {
      this.error = null;

      if (!this.hasGetUserMedia) {
        this.error = new Error('mediaDevices is not supported');
        return;
      }

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
        this.error = error;
      }
    },

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
