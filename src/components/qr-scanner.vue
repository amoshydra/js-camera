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
      @change="data = $event"
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
import QrReader from './QrReader.vue'
import CameraFeed from './CameraFeed.vue'

interface ComponentData {
  data: string | null;
  cameraFeedVideoElement: HTMLVideoElement | null;
}

export default Vue.extend({
  components: {
    ContentRenderer,
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
      data: null,
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
