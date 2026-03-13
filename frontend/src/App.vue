<template>
  <div class="app-container">
    <LanguageSwitcher class="language-switcher-container" />
    <router-view />
  </div>
</template>

<script setup>
import LanguageSwitcher from './components/LanguageSwitcher.vue'
</script>

<style>
/* Global styles remain the same */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'JetBrains Mono', 'Space Grotesk', 'Noto Sans SC', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  background-color: #ffffff;
}

.app-container {
  position: relative;
}

.language-switcher-container {
  position: fixed;
  top: 15px;
  right: 150px;
  z-index: 9999;
}

/* Scrollbar styles remain the same */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #000000;
}

::-webkit-scrollbar-thumb:hover {
  background: #333333;
}

button {
  font-family: inherit;
}
</style>
