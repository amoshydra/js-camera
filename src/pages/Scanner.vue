<template>
  <div>
    <QrInput
      :disabled="disabled"
      @change="data = $event"
    />
    <ContentRenderer
      v-if="data"
      :data="data"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import QrInput from '@/components/QrInput/Wrapper.vue';
import ContentRenderer from '@/components/ContentRenderer.vue'

interface ComponentData {
  data: string | null;
}

export default Vue.extend({
  components: {
    QrInput,
    ContentRenderer,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data(): ComponentData {
    return {
      data: null,
    };
  },
});
</script>
