<template>
  <div
    class="error"
  >
    <div style="font-size: 5em; margin-bottom: 0.5em;">😟</div>
    I cannot access to the camera.
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    error: {
      type: Error,
      default: undefined,
    },
  },
});
</script>

<style scoped>
.error {
  border: 1em solid maroon;
  padding-top: 3em;
  padding-bottom: 3em;
  box-sizing: border-box;
}
</style>
