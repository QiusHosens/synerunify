import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言文件
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import zhTranslation from './locales/zh/translation.json';

i18n
  .use(LanguageDetector) // 自动检测浏览器语言
  .use(initReactI18next) // 绑定 React
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      zh: { translation: zhTranslation },
    },
    fallbackLng: 'en', // 默认语言
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
  });

export default i18n;