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
          currentLang: 'English',
          translation: 'Translation',
          easy: 'Easy',
          hard: 'Hard'
        }
      },
      ja: {
        translation: {
          currentLang: '日本語（変換モードを直接入力にして下さい）',
          translation: '翻訳',
          easy: 'かんたん',
          hard: 'むずかしい'
        }
      }
    }
  })

export default function (app: App) {
  app.use(I18NextVue, { i18next })
  return app
}
