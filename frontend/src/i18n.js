import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';
import de from './locales/de.json';

const i18n = createI18n({
  legacy: false, // use composition API
  locale: localStorage.getItem('locale') || 'zh', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    de,
  },
});

export default i18n;
