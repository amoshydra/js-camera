<template>
  <div :class="$style.wrapper">
    <button
      @click="showConfiguratorUi = !showConfiguratorUi"
      :class="$style.button"
    >⚙</button>

    <CameraStreamConfiguratorMenu
      :class="$style.configurator"
      v-if="showConfiguratorUi"

      :value="value"
      @input="videoStreamConstraints => $emit('input', videoStreamConstraints)"
      @close="showConfiguratorUi = false"

    />

  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CameraStreamConfiguratorMenu from './CameraStreamConfiguratorMenu.vue';

export default Vue.extend({
  components: {
    CameraStreamConfiguratorMenu,
  },

  props: {
    value: {
      type: Object as PropType<MediaStreamConstraints['video']>,
      required: true,
    }
  },

  data() {
    return {
      showConfiguratorUi: false,
    }
  },
});
</script>

<style module>

.wrapper {
  position: absolute;
  right: 0;
  top: 0;
}

.button {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0);
  border: none;

  margin: 0.4em;
}

.configurator {
  position: absolute;

  right: 0;
  top: 0;

  margin: 0.4em;
  width: calc(100vw - 120px - 0.8em);
}
</style>
