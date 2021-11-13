<template>
  <div>
    <CameraFeed
      autoplay
      @ready="el => this.cameraFeedVideoElement = el"
    />
    <QrReader
      :disabled="disabled"
      :videoElement="cameraFeedVideoElement"
      @change="data => $emit('change', data)"
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

</style>
