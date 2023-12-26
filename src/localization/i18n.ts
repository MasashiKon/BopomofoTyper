import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import type { App } from 'vue'

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          // here we will place our translations...
          welcome: 'English',
          sentence_1: 'Good morning, teacher.',
          sentence_2: 'Do you understand?'
        }
      },
      ja: {
        translation: {
          welcome: 'Japanese',
          sentence_1: 'おはようございます、先生。',
          sentence_2: '理解しましたか？'
        }
      }
    }
  })

export default function (app: App) {
  app.use(I18NextVue, { i18next })
  return app
}
