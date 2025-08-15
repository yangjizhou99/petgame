import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import en from './locales/en.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { zh:{translation:zh}, ja:{translation:ja}, en:{translation:en} },
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18n
