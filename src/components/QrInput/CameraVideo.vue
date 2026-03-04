<template>
  <video
    class="video"

    ref="video"
    autoplay
    playsinline
    @loadeddata="loadeddata"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    stream: {
      type: Object as () => MediaStream,
      default: null,
    }
  },

  watch: {
    stream(stream: MediaStream | null) {
      this.updateStream(stream)
    },
  },

  mounted() {
    this.updateStream(this.stream as MediaStream | null)
  },

  methods: {
    loadeddata() {
      const videoEl = (this.$refs.video as HTMLVideoElement)
      this.$emit('ready', videoEl)
    },

    updateStream(stream: MediaStream | null) {
      const videoEl = (this.$refs.video as HTMLVideoElement)
      videoEl.srcObject = stream
    },
  },
})
</script>

<style scoped>
.video {
  width: 100%;
}
</style>
