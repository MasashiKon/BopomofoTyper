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
          hard: 'Hard',
          backtotitle: 'Back to title',
          playAgain: 'Play again',
          yourName: 'Your name',
          submit:'Submit',
          sendAgain: 'Send again',
          registerScore: 'Register score',
          start: 'Start',
          highScore: 'High Score',
          name: 'Name',
          score: 'Score',
          congrats: 'Congrats!',
          rank_ordinal_one:"You've ranked in at {{count}}st place!", 
          rank_ordinal_two:"You've ranked in at {{count}}nd place!", 
          rank_ordinal_few:"You've ranked in at {{count}}rd place!", 
          rank_ordinal_other:"You've ranked in at {{count}}st place!", 
          verticalZhuyin: "Vertical Zhuyin",
          hideZhuyin: "Hide Zhuyin",
          socialMessage_one: "You've got a {{count}} point!",
          socialMessage_other: "You've got {{count}} points!"
        }
      },
      ja: {
        translation: {
          currentLang: '日本語（変換モードを直接入力にして下さい）',
          translation: '翻訳',
          easy: 'かんたん',
          hard: 'むずかしい',
          backtotitle: 'タイトルに戻る',
          playAgain: 'もう一回遊ぶ',
          yourName: '名前を入力',
          submit:'送信',
          sendAgain: 'もう一度送信',
          registerScore: 'スコアを登録',
          start: 'スタート',
          highScore: 'ハイスコア',
          name: '名前',
          score: 'スコア',
          congrats: 'やったね！',
          rank: '{{count}}位にランクインしました！',
          verticalZhuyin: "注音縦モード",
          hideZhuyin: "注音を隠す",
          socialMessage: "あなたの得点は{{count}}点でした！"
        }
      }
    }
  })

export default function (app: App) {
  app.use(I18NextVue, { i18next })
  return app
}
