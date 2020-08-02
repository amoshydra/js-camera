<template>
  <div>
    <CameraFeed
      class="video"
      autoplay
      @ready="cameraFeedVideoElement = $event"
    />
    <QrReader
      :disabled="disabled"
      :videoElement="cameraFeedVideoElement"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import QrReader from './QrReader.vue'
import CameraFeed from './CameraFeed.vue'

interface ComponentData {
  cameraFeedVideoElement: HTMLVideoElement | null;
}

export default Vue.extend({
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
    };
  },
});
</script>

<style scoped lang="scss">
.video {
  width: 100%;
}
</style>
