<template>
  <div id="app">
    <QrScanner
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import QrScanner from '@/pages/Scanner.vue'

export default Vue.extend({
  name: 'App',
  components: {
    QrScanner,
  },

  data() {
    return {
      disabled: false
    };
  },

  mounted() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.disabled = true;
      } else if (document.visibilityState === 'visible') {
        this.disabled = false;
      }
    });
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 1em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
