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
          practice: 'Practice',
          debug: 'debug',
          easy: 'Easy',
          hard: 'Hard',
          backtotitle: 'Back to title',
          playAgain: 'Play again',
          yourName: 'Your name',
          submit: 'Submit',
          sendAgain: 'Send again',
          registerScore: 'Register score',
          start: 'Start',
          highScore: 'High Score',
          name: 'Name',
          score: 'Score',
          congrats: 'Congrats!',
          rank_ordinal_one: "You've ranked in at {{count}}st place!",
          rank_ordinal_two: "You've ranked in at {{count}}nd place!",
          rank_ordinal_few: "You've ranked in at {{count}}rd place!",
          rank_ordinal_other: "You've ranked in at {{count}}st place!",
          verticalZhuyin: 'Vertical Zhuyin',
          hideZhuyin: 'Hide Zhuyin',
          socialMessage_one: "You've got a {{count}} point!",
          socialMessage_other: "You've got {{count}} points!",
          english: 'English',
          japanese: 'Japanese',
          title: 'Bopomofo Typer(beta)',
          tag: 'BopomofoTyper',
          zhuyinDescriptionTitle: 'What is Bopomofo?',
          zhuyinDescriptionText:
            'Bopomofo, also known as Zhuyin Fuhao, is a unique script used predominantly in Taiwan. It serves as a phonetic script, aiding in the learning of traditional Chinese characters, alongside pinyin. Bopomofo plays a crucial role in language education and daily writing in Taiwan.'
        }
      },
      ja: {
        translation: {
          currentLang: '日本語（変換モードを直接入力にして下さい）',
          translation: '翻訳',
          practice: 'れんしゅう',
          debug: 'でばっぐ',
          easy: 'かんたん',
          hard: 'むずかしい',
          backtotitle: 'タイトルに戻る',
          playAgain: 'もう一回遊ぶ',
          yourName: '名前を入力',
          submit: '送信',
          sendAgain: 'もう一度送信',
          registerScore: 'スコアを登録',
          start: 'スタート',
          highScore: 'ハイスコア',
          name: '名前',
          score: 'スコア',
          congrats: 'やったね！',
          rank: '{{count}}位にランクインしました！',
          verticalZhuyin: '注音縦モード',
          hideZhuyin: '注音を隠す',
          socialMessage: 'あなたの得点は{{count}}点でした！',
          english: '英語',
          japanese: '日本語',
          title: 'ボポモフォたいぱあ（ベータ版）',
          tag: 'ボポモフォたいぱあ',
          zhuyinDescriptionTitle: 'ボポモフォとは？',
          zhuyinDescriptionText:
            'ボポモフォ（Bopomofo）は、台湾で主に使用されている文字の一つで、注音符号とも呼ばれています。これは、漢字や注音符号など、伝統的な漢字の学習に役立つために開発された、特有の文字体系です。ボポモフォは、主に台湾で広く普及しており、言語教育や日常の文章の書き方において非常に重要な役割を果たしています。'
        }
      }
    }
  })

export default function (app: App) {
  app.use(I18NextVue, { i18next })
  return app
}
