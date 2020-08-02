<template>
  <div :class="$style.wrapper">

    <button
      @click="$emit('close')"
      :class="$style.button"
    >❌</button>


  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<MediaStreamConstraints['video']>,
      required: true,
    }
  },

  data() {
    return {
    }
  },
});
</script>

<style module>
.wrapper {
  background-color: white;
  box-shadow: 8px 8px 32px rgba(0,0,0,0.2);
  border-radius: 0.25rem;
  padding: 3em;
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
</style>
