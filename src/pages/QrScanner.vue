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
import { defineComponent } from 'vue'
import QrInput from '@/components/QrInput/QrInput.vue'
import ContentRenderer from '@/components/ContentRenderer.vue'

interface ComponentData {
  data: string | null
}

export default defineComponent({
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
    }
  },
})
</script>
