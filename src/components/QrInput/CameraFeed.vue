<template>
  <CameraStreamReceiver
    v-slot="{ stream, error }"
  >
    <CameraFeedErrorPresenter
      v-if="mediaDevicesSupportError || error"
      :error="mediaDevicesSupportError || error"
    />

    <CameraVideo
      v-else
      :stream="stream"
      @ready="videoEl => $emit('ready', videoEl)"
    />
  </CameraStreamReceiver>
</template>

<script lang="ts">
import Vue from 'vue';

import CameraVideo from './CameraVideo.vue';
import CameraFeedErrorPresenter from './CameraFeedErrorPresenter.vue';
import CameraStreamReceiver from './CameraStreamReceiver.vue';

export default Vue.extend({
  components: {
    CameraVideo,
    CameraStreamReceiver,
    CameraFeedErrorPresenter,
  },

  computed: {
    hasGetUserMedia(): boolean {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    mediaDevicesSupportError(): Error | null {
      return this.hasGetUserMedia ? null : new Error('mediaDevices is not supported');
    },
  }
});
</script>
