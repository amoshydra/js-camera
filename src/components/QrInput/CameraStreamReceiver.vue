<template>
  <div>
    <CameraStreamConfigurator
      v-model="videoStreamConstraints"
    />
    <slot v-bind="slotData"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CameraStreamConfigurator from './CameraStreamConfigurator.vue'
import { CameraStreamReceiverSlotData } from './CameraStreamReceiver.lib'
import { VideoStreamConstrain } from './ConfigurationStorage'

interface ComponentData {
  error: Error | null
  stream: MediaStream | null

  videoStreamConstraints: VideoStreamConstrain
}

export default defineComponent({
  components: {
    CameraStreamConfigurator,
  },

  data(): ComponentData {
    return {
      error: null,
      stream: null,

      videoStreamConstraints: undefined,
    }
  },

  mounted() {
    this.getCamera(this.videoStreamConstraints)
  },

  watch: {
    videoStreamConstraints: {
      handler(newConstraints: VideoStreamConstrain) {
        this.getCamera(newConstraints)
      },
      deep: true,
    },
  },

  methods: {
    async getCamera(videoStreamConstraints: MediaStreamConstraints['video']): Promise<void> {
      this.error = null

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: videoStreamConstraints,
        })
      } catch (error) {
        this.error = error instanceof Error ? error : null
        this.stream = null
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
})
</script>
