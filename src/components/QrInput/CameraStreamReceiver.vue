<template>
  <div>
    <CameraStreamConfigurator
      v-model="videoStreamConstraints"
      @input="getCamera"
    />
    <slot v-bind="slotData"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { CameraStreamReceiverSlotData } from './CameraStreamReceiver.lib';
import CameraStreamConfigurator from './CameraStreamConfigurator.vue';

interface ComponentData {
  error: Error | null;
  stream: MediaStream | null;

  videoStreamConstraints: MediaStreamConstraints['video'];
}

export default Vue.extend({
  components: {
    CameraStreamConfigurator,
  },

  data(): ComponentData {
    return {
      error: null,
      stream: null,

      videoStreamConstraints: {
        facingMode: 'environment',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
    };
  },

  mounted() {
    this.getCamera(this.videoStreamConstraints);
  },

  methods: {
    async getCamera(videoStreamConstraints: MediaStreamConstraints['video']): Promise<void> {
      this.error = null;

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: videoStreamConstraints,
        });
      } catch (error) {
        this.error = error;
        this.stream = null;
      }
    },
  },

  computed: {
    slotData(): CameraStreamReceiverSlotData {
      if (this.error !== null) {
        return {
          error: this.error,
          stream: null,
        }
      }

      return {
        error: null,
        stream: this.stream,
      }
    },
  }
});
</script>
