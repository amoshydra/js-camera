<template>
  <div :class="$style.wrapper">

    <button
      @click="$emit('close')"
      :class="$style.button"
    >❌</button>

    <form>
      <label>
        <h5>Video source</h5>
        <select
          :class="$style.input"
          @input="handleInput('videoSource', $event)"
        >
          <option
            v-for="device in [{ label: 'Choose a device', deviceId: null }, ...devices]"
            :key="device.deviceId"
            :value="device.deviceId"
            :selected="selectedDeviceId === device.deviceId"
            :disabled="!device.deviceId"
          >
            {{ device.label }}
          </option>
        </select>
      </label>

      <h5>Facing</h5>
      <label>
        <input
          type="radio"
          name="orientation"
          :checked="selectedFacingMode === 'user'"
          value="user"
          @input="handleInput('orientation', $event)"
        >Front
      </label>
      <label>
        <input
          type="radio"
          name="orientation"
          :checked="selectedFacingMode === 'environment'"
          value="environment"
          @input="handleInput('orientation', $event)"
        >Back
      </label>
    </form>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VideoStreamConstrain, ConfigurationStorage } from './ConfigurationStorage';

type InputName = 'videoSource' | 'orientation';

const extractOrGetFirst = <T extends unknown>(itemOrArrayOfItems: T | T[]): T => Array.isArray(itemOrArrayOfItems) ? itemOrArrayOfItems[0] : itemOrArrayOfItems;
const extractConfig = <T extends MediaTrackConstraints>(constrain: undefined | T | boolean, key: keyof T): string | null => {
  if (typeof constrain !== 'object') return null;

  const firstDeviceId = extractOrGetFirst(constrain[key]);

  if (!firstDeviceId) return null;

  if (typeof firstDeviceId === 'string') return firstDeviceId;

  return extractOrGetFirst((firstDeviceId as ConstrainDOMStringParameters).exact ?? (firstDeviceId as ConstrainDOMStringParameters).ideal ?? null);
}

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<VideoStreamConstrain>,
      required: true,
    }
  },

  data() {
    return {
      devices: [] as MediaDeviceInfo[]
    }
  },

  async mounted() {
    this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'videoinput');
  },

  computed: {
    selectedDeviceId(): string | null {
      return extractConfig(this.value, 'deviceId');
    },

    selectedFacingMode(): string | null {
      return extractConfig(this.value, 'facingMode');
    },
  },

  methods: {
    handleInput(inputName: InputName, event: Event ) {
      if (inputName === 'videoSource') {
        const selectEl = event.target as HTMLSelectElement
        this.updateValue({
          deviceId: selectEl.value
        });
      } else if (inputName === 'orientation') {
        const radioEl = event.target as HTMLInputElement
        this.updateValue({
          facingMode: radioEl.value
        });
      }
    },

    updateValue(payload: MediaTrackConstraints) {
      const originalvalue = (typeof this.value === 'object') ? this.value : ConfigurationStorage.defaultConfig;

      this.$emit('input', {
        ...originalvalue,
        ...payload,
      });
    }
  }
});
</script>

<style module>
.wrapper {
  background-color: rgba(255,255,255,0.95);
  box-shadow: 8px 8px 32px rgba(0,0,0,0.2);
  border-radius: 0.25rem;
  padding: 1em;
  padding-top: 2em;
  padding-bottom: 2em;
}

.button {
  position: absolute;
  top: 0;
  right: 0;

  padding: 0.5rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0);
  border: none;
}

.input {
  max-width: 100%;
  padding: 0.6rem 0.2rem;
}
</style>
