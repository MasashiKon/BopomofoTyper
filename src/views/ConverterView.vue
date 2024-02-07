<script setup lang="ts">
import { ref } from 'vue'

const wordToConvert = ref('')
const convertedZhuyin = ref('')

const convertToZhuyin = () => {
  convertedZhuyin.value = wordToConvert.value
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
