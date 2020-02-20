<template>
  <video
    v-if="hasGetUserMedia"
    ref="video"
    autoplay
    @loadeddata="loadeddata"
  />

  <div v-else>
    This browser doesn't allow access to the camera
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
  async mounted() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: this.facingMode,
        width: { ideal: this.width },
        height: { ideal: this.height }
      },
    });

    const videoEl = (this.$refs.video as HTMLVideoElement);
    videoEl.srcObject = stream;
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
