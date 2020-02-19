<template>
  <div class="content">
    <a
      class="content-anchor content-text"
      v-if="isUrl"
      :href="data.data"
      target="_blank"
      rel="noopener"
    >{{ data.data }}</a>
    <div
      class="content-text"
      v-else
    >
      {{ data.data }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { QRCode } from 'jsqr'

interface ComponentData {
  data: QRCode | null;
}

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<QRCode>,
      required: true,
    },
  },
  computed: {
    isUrl() {
      try {
        new URL(this.data.data)
        return true;
      } catch (error) {
        return false;
      }
    },
  }
});
</script>

<style lang="scss">
.content {
  padding: 1em;
}
.content-text {
  box-shadow: 4px 4px 32px 0 rgba(0,0,0,0.25);
  padding: 1em;
  margin-bottom: 2em;
}
.content-anchor {
  display: inline-block;
  font-size: 1.25em;
  word-break: break-word;
  line-height: 1.25;
  text-decoration: none;
}
</style>
