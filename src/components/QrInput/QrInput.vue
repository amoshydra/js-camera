<template>
  <div>
    <CameraFeed
      autoplay
      @ready="(el: HTMLVideoElement) => cameraFeedVideoElement = el"
    />
    <QrReader
      :disabled="disabled"
      :videoElement="cameraFeedVideoElement"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QrReader from './QrReader.vue'
import CameraFeed from './CameraFeed.vue'

interface ComponentData {
  cameraFeedVideoElement: HTMLVideoElement | null
}

export default defineComponent({
  components: {
    QrReader,
    CameraFeed,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data(): ComponentData {
    return {
      cameraFeedVideoElement: null,
    }
  },
})
</script>

<style scoped lang="scss">

</style>
