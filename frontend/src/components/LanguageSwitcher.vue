<template>
  <div class="language-switcher">
    <button @click="setLocale('en')" :class="{ 'active': currentLocale === 'en' }">English</button>
    <button @click="setLocale('zh')" :class="{ 'active': currentLocale === 'zh' }">中文</button>
    <button @click="setLocale('de')" :class="{ 'active': currentLocale === 'de' }">Deutsch</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const setLocale = (newLocale) => {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}

button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
