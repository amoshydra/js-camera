<template>
  <div :class="$style.wrapper">
    <button
      @click="showConfiguratorUi = !showConfiguratorUi"
      :class="$style.button"
    >⚙</button>

    <CameraStreamConfiguratorMenu
      ref="configurator"
      :class="$style.configurator"
      v-if="showConfiguratorUi"

      :value="value"
      @input="updateConfig"
      @close="showConfiguratorUi = false"
    />

  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CameraStreamConfiguratorMenu from './CameraStreamConfiguratorMenu.vue';
import { configStore } from './CameraStreamConfigurator.lib'
import { VideoStreamConstrain } from './ConfigurationStorage';

export default Vue.extend({
  components: {
    CameraStreamConfiguratorMenu,
  },

  props: {
    value: {
      type: Object as PropType<VideoStreamConstrain>,
      default: undefined,
    }
  },

  data() {
    return {
      showConfiguratorUi: false,
    }
  },

  created() {
    this.emitConfig();
  },

  mounted() {
    window.addEventListener('click', this.handleBackgroundClick)
  },

  beforeDestroy() {
    window.removeEventListener('click', this.handleBackgroundClick)
  },

  methods: {
    updateConfig(config: VideoStreamConstrain) {
      configStore.store(config);
      this.emitConfig();
    },

    emitConfig() {
      this.$emit('input', configStore.load());
    },

    handleBackgroundClick(event: Event): void {
      if (!this.showConfiguratorUi) return;

      if (event.composedPath().find(x => x === this.$el)) {
        return;
      }

      this.showConfiguratorUi = false;
    }
  },
});
</script>

<style module>

.wrapper {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
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
  width: calc(100vw - 0px - 0.8em);

  box-sizing: border-box;
}
</style>
