<template>
  <div
    :class="$style.wrapper"
  >
    <div :class="$style.icon">😟</div>
    <div :class="$style.friendlyMessage">I cannot access to the camera.</div>

    <div :class="$style.errorMessage">
      {{ error.message }}
    </div>
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

<style module>
.wrapper {
  background-color: rgba(255, 2, 2, 0.1);
  padding-top: 3em;
  padding-bottom: 3em;
  box-sizing: border-box;
  text-align: center;
}

.icon {
  font-size: 5em;
  margin-bottom: 0.5em;
}

.friendlyMessage {
  margin-bottom: 0.5em;
  font-weight: bold;
}

.errorMessage {
  font-family: monospace;
}
</style>
