<template>
  <div class="debug-status">
    <div>Video: {{ videoElement ? '✓' : '✗' }}</div>
    <div>Ready: {{ isVideoReady }}</div>
    <div>Playing: {{ isVideoPlaying }}</div>
    <div>Dim: {{ videoWidth }}x{{ videoHeight }}</div>
    <div>Scanning: {{ isScanning }}</div>
    <div>Data: {{ data || 'none' }}</div>
    <div>Scans: {{ scanCount }}</div>
    <div v-if="lastError">Error: {{ lastError }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    videoElement: {
      type: Object as () => HTMLVideoElement,
      default: null,
    },
    isVideoReady: {
      type: Boolean,
      default: false,
    },
    isVideoPlaying: {
      type: Boolean,
      default: false,
    },
    isScanning: {
      type: Boolean,
      default: false,
    },
    videoWidth: {
      type: Number,
      default: 0,
    },
    videoHeight: {
      type: Number,
      default: 0,
    },
    data: {
      type: String,
      default: null,
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    lastError: {
      type: String,
      default: null,
    },
  },
})
</script>

<style scoped>
.debug-status {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: lime;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
}
</style>
