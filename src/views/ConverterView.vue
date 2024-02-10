<script setup lang="ts">
import { ref } from 'vue'
import { convertZhuyin } from '@/utils/convertZhuyin'

const wordToConvert = ref('')
const convertedZhuyin = ref('')

const convertToZhuyin = () => {
  const letters = wordToConvert.value

  const alphabetLetters = letters
    .replace(/きゃ|キャ/g, 'kia')
    .replace(/きゅ|キュ/g, 'kü')
    .replace(/きょ|キョ/g, 'kio')
    .replace(/しゃ|シャ/g, 'sha')
    .replace(/しゅ|シュ/g, 'shu')
    .replace(/しょ|ショ/g, 'sho')
    .replace(/ちゃ|チャ/g, 'cha')
    .replace(/ちゅ|チュ/g, 'chu')
    .replace(/ちょ|チョ/g, 'cho')
    .replace(/にゃ|ニャ/g, 'nia')
    .replace(/にゅ|ニュ/g, 'nü')
    .replace(/にょ|ニョ/g, 'nio')
    .replace(/ひゃ|ヒャ/g, 'hia')
    .replace(/ひゅ|ヒュ/g, 'hü')
    .replace(/ひょ|ヒョ/g, 'hio')
    .replace(/みゃ|ミャ/g, 'mia')
    .replace(/みゅ|ミュ/g, 'mü')
    .replace(/みょ|ミョ/g, 'mio')
    .replace(/りゃ|リャ/g, 'ria')
    .replace(/りゅ|リュ/g, 'rü')
    .replace(/りょ|リョ/g, 'rio')
    .replace(/ぎゃ|ギャ/g, 'gia')
    .replace(/ぎゅ|ギュ/g, 'gü')
    .replace(/ぎょ|ギョ/g, 'gio')
    .replace(/じゃ|ジャ/g, 'jia')
    .replace(/じゅ|ジュ/g, 'ju')
    .replace(/じょ|ジョ/g, 'jo')
    .replace(/ぢゃ|ヂャ/g, 'zhia')
    .replace(/ぢゅ|ヂュ/g, 'zhu')
    .replace(/ぢょ|ヂョ/g, 'zho')
    .replace(/びゃ|ビャ/g, 'bia')
    .replace(/びゅ|ビュ/g, 'bü')
    .replace(/びょ|ビョ/g, 'bio')
    .replace(/ぴゃ|ピャ/g, 'pia')
    .replace(/ぴゅ|ピュ/g, 'pü')
    .replace(/ぴょ|ピョ/g, 'pio')
    .replace(/てぃ|ティ/g, 'ti')
    .replace(/でぃ|ディ/g, 'di')
    .replace(/あ|ア/g, 'a')
    .replace(/い|イ/g, 'i')
    .replace(/う|ウ/g, 'u')
    .replace(/え|エ/g, 'ê')
    .replace(/お|オ/g, 'o')
    .replace(/か|カ/g, 'ka')
    .replace(/き|キ/g, 'ki')
    .replace(/く|ク/g, 'ku')
    .replace(/け|ケ/g, 'kê')
    .replace(/こ|コ/g, 'ko')
    .replace(/さ|サ/g, 'sa')
    .replace(/し|シ/g, 'si')
    .replace(/す|ス/g, 'su')
    .replace(/せ|セ/g, 'sê')
    .replace(/そ|ソ/g, 'so')
    .replace(/た|タ/g, 'ta')
    .replace(/ち|チ/g, 'qi')
    .replace(/つ|ツ/g, 'zu')
    .replace(/て|テ/g, 'tê')
    .replace(/と|ト/g, 'to')
    .replace(/な|ナ/g, 'na')
    .replace(/に|二/g, 'ni')
    .replace(/ぬ|ヌ/g, 'nu')
    .replace(/ね|ネ/g, 'nê')
    .replace(/の|ノ/g, 'no')
    .replace(/は|ハ/g, 'ha')
    .replace(/ひ|ヒ/g, 'hi')
    .replace(/ふ|フ/g, 'hu')
    .replace(/へ|へ/g, 'hê')
    .replace(/ほ|ホ/g, 'ho')
    .replace(/ま|マ/g, 'ma')
    .replace(/み|ミ/g, 'mi')
    .replace(/む|ム/g, 'mu')
    .replace(/め|メ/g, 'mê')
    .replace(/も|モ/g, 'mo')
    .replace(/や|ヤ/g, 'ia')
    .replace(/ゐ|ヰ/g, 'i')
    .replace(/ゆ|ユ/g, 'ü')
    .replace(/ゑ|ヱ/g, 'ie')
    .replace(/よ|ヨ/g, 'io')
    .replace(/わ|ワ/g, 'ua')
    .replace(/を|ヲ/g, 'uo')
    .replace(/ん|ン/g, 'n')
    .replace(/が|ガ/g, 'ga')
    .replace(/ぎ|ギ/g, 'gi')
    .replace(/ぐ|グ/g, 'gu')
    .replace(/げ|ゲ/g, 'gê')
    .replace(/ご|ゴ/g, 'go')
    .replace(/ざ|ザ/g, 'za')
    .replace(/じ|ジ/g, 'ji')
    .replace(/ず|ズ/g, 'zu')
    .replace(/ぜ|ゼ/g, 'zê')
    .replace(/ぞ|ゾ/g, 'zo')
    .replace(/だ|ダ/g, 'da')
    .replace(/ぢ|ヂ/g, 'zi')
    .replace(/づ|ヅ/g, 'zu')
    .replace(/で|デ/g, 'dê')
    .replace(/ど|ド/g, 'do')
    .replace(/ば|バ/g, 'ba')
    .replace(/び|ビ/g, 'bi')
    .replace(/ぶ|ブ/g, 'bu')
    .replace(/べ|ベ/g, 'bê')
    .replace(/ぼ|ボ/g, 'bo')
    .replace(/ぱ|パ/g, 'pa')
    .replace(/ぴ|ピ/g, 'pi')
    .replace(/ぷ|プ/g, 'pu')
    .replace(/ぺ|ペ/g, 'pê')
    .replace(/ぽ|ポ/g, 'po')
    .replace(/っ|ッ/g, '')
    .replace(/ゃ|ャ/g, 'ia')
    .replace(/ゅ|ュ/g, 'ü')
    .replace(/ょ|ョ/g, 'io')
    .replace(/ぁ|ァ/g, 'a')
    .replace(/ぃ|ィ/g, 'i')
    .replace(/ぅ|ゥ/g, 'u')
    .replace(/ぇ|ェ/g, 'ê')
    .replace(/ぉ|ォ/g, 'o')
    .split('')

  const convertedArr = []

  while (alphabetLetters.length > 0) {
    if (`${alphabetLetters[0]}${alphabetLetters[1]}${alphabetLetters[2]}`.match(/ang|eng/)) {
      convertedArr.push(convertZhuyin(alphabetLetters.splice(0, 3).join('')))
    } else if (
      `${alphabetLetters[0]}${alphabetLetters[1]}`.match(/zh|ch|sh|ai|ei|ao|ou|an|en|er/)
    ) {
      convertedArr.push(convertZhuyin(alphabetLetters.splice(0, 2).join('')))
    } else if (`${alphabetLetters[0]}`.match(/b|p|m|f|d|t|n|l|g|k|h|j|q|x|r|z|c|s|a|o|e|ê|i|u|ü/)) {
      convertedArr.push(convertZhuyin(alphabetLetters.splice(0, 1).join('')))
    } else {
      convertedArr.push(alphabetLetters.splice(0, 1))
    }
  }
  convertedZhuyin.value = convertedArr.join('')
  wordToConvert.value = ''
}
</script>

<template>
  <main>
    <div class="converter-container">
      <input type="text" v-model="wordToConvert" />
      <div class="game-button" @click="convertToZhuyin">Convert</div>
      <input type="text" v-model="convertedZhuyin" />
    </div>
  </main>
</template>

<style>
main {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--header-height) - var(--border-width));
}
.converter-container {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
@media screen and (min-width: 1040px) {
}

@media screen and (min-width: 960px) and (max-width: 1039px) {
}

@media screen and (max-width: 959px) {
}
</style>
