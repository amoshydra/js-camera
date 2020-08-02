<template>
  <video
    class="video"

    ref="video"
    autoplay
    @loadeddata="loadeddata"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    stream: {
      type: MediaStream,
      default: null,
    }
  },

  watch: {
    stream(stream: MediaStream | null) {
      this.updateStream(stream);
    },
  },

  mounted() {
    this.updateStream(this.stream);
  },

  methods: {
    loadeddata() {
      const videoEl = (this.$refs.video as HTMLVideoElement);
      this.$emit('ready', videoEl);
    },

    updateStream(stream: MediaStream | null) {
      const videoEl = (this.$refs.video as HTMLVideoElement);
      videoEl.srcObject = stream;
    },
  },
});
</script>

<style scoped>
.video {
  width: 100%;
}
</style>
