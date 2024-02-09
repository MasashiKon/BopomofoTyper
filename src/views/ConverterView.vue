<script setup lang="ts">
import { ref } from 'vue'
import { convertZhuyin } from '@/utils/convertZhuyin'

const wordToConvert = ref('')
const convertedZhuyin = ref('')

const convertToZhuyin = () => {
  const letters = wordToConvert.value.split('')
  const convertedArr = []
  while (letters.length > 0) {
    if (`${letters[0]}${letters[1]}${letters[2]}`.match(/ang|eng/)) {
      convertedArr.push(convertZhuyin(letters.splice(0, 3).join('')))
    } else if (`${letters[0]}${letters[1]}`.match(/zh|ch|sh|ai|ei|ao|ou|an|en|er/)) {
      convertedArr.push(convertZhuyin(letters.splice(0, 2).join('')))
    } else if (`${letters[0]}`.match(/b|p|m|f|d|t|n|l|g|k|h|j|q|x|r|z|c|s|a|o|e|ê|i|u|ü/)) {
      convertedArr.push(convertZhuyin(letters.splice(0, 1).join('')))
    } else {
      convertedArr.push(letters.splice(0, 1))
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
