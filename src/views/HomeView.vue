<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { sentence1, sentence2 } from '../../data/sentences/sentencesDB'
import type { Kanji, Sentence, ZhuyinChar } from '@/type/types'
import { AvailableLang, LocalStrageName } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import i18next from 'i18next'

const isPressed = ref(false)
const isStart = ref(false)
const lang = ref(AvailableLang.en)
const timeCount = ref(0)
const currentSentenceId = ref(1)

const sentences: Sentence[] = reactive([sentence1, sentence2])

const currentSentence = computed(() => {
  if (!sentences.length) return null
  return sentences[0]
})

const kanjiArr = computed((): Kanji[] => {
  const kanjiArr: Kanji[] = []
  if (!currentSentence.value) return kanjiArr
  for (let chunk of currentSentence.value.chunks) {
    if (isWord(chunk)) {
      for (let kanji of chunk.kanji) {
        kanjiArr.push(kanji)
      }
    } else {
      for (let wordOrKanji of chunk.word) {
        if (isWord(wordOrKanji)) {
          for (let kanji of wordOrKanji.kanji) {
            kanjiArr.push(kanji)
          }
        } else {
          kanjiArr.push(wordOrKanji)
        }
      }
    }
  }
  return kanjiArr
})

let interval: number | null

const toggleIsStart = () => {
  if (isStart.value) {
    if (!interval) return
    clearInterval(interval)
    interval = null
  } else {
    interval = setInterval(() => {
      timeCount.value = timeCount.value + 1
    }, 1000)
  }
  isStart.value = !isStart.value
}

const detectKeydown = (e: KeyboardEvent) => {
  if (!kanjiArr.value || !kanjiArr.value.length) return
  const answer: ZhuyinChar | undefined = kanjiArr.value[0].zhuyin.find((zhuyin) => !zhuyin.done)
  if (!answer) return
  if (e.key === getCorrespondingKeys(answer.char, lang.value)) {
    answer.done = true
    if (kanjiArr.value[0].zhuyin.every((zhuyin) => zhuyin.done)) {
      kanjiArr.value[0].done = true
      kanjiArr.value.shift()
    }
    if (!kanjiArr.value.length) {
      sentences.shift()
      currentSentenceId.value++
      if (!sentences.length) {
        isStart.value = false
      }
    }
  }
}

const changeLanguage = (lang: string) => {
  i18next.changeLanguage(lang)
  localStorage.setItem(LocalStrageName.userLang, lang)
}
</script>

<template>
  <main>
    <div>Translation: {{ $t('welcome') }}</div>
    <button v-on:click="changeLanguage('en')">English</button>
    <button v-on:click="changeLanguage('ja')">Japanese</button>
    <div tabindex="0" @keydown="detectKeydown" :class="{ pressed: isPressed }">
      <span>Time: {{ timeCount }}</span>
      <div class="main-window">
        <div class="main-container" v-if="isStart">
          <div>{{ sentences.length > 0 ? $t('sentence_' + currentSentenceId) : '' }}</div>
          <ul v-if="currentSentence" class="sentence-container">
            <li v-for="(chunk, cIndex) in currentSentence.chunks" :key="'chunk' + cIndex">
              <ul v-if="isChuck(chunk)" class="chunk-container">
                <li v-for="(word, wIndex) in chunk.word" :key="'word' + cIndex + wIndex">
                  <ul v-if="isWord(word)">
                    <li
                      v-for="(kanji, kIndex) in word.kanji"
                      :key="'kanji' + cIndex + wIndex + kIndex"
                      class="kanji-container"
                    >
                      <div :class="{ pressed: kanji.done }">{{ kanji.display }}</div>
                      <ul class="zyuin-container">
                        <li
                          v-for="(zhuyin, zIndex) in kanji.zhuyin"
                          :key="'zhuin' + cIndex + wIndex + kIndex + zIndex"
                          :class="{ pressed: zhuyin.done }"
                        >
                          {{ zhuyin.char }}
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul v-else class="kanji-container">
                    <div :class="{ pressed: word.done }">{{ word.display }}</div>
                    <ul class="zyuin-container">
                      <li
                        v-for="(zhuyin, zIndex) in word.zhuyin"
                        :key="'zhuin' + cIndex + wIndex + zIndex"
                        :class="{ pressed: zhuyin.done }"
                      >
                        {{ zhuyin.char }}
                      </li>
                    </ul>
                  </ul>
                </li>
              </ul>
              <ul v-else class="chunk-container">
                <li
                  v-for="(kanji, kIndex) in chunk.kanji"
                  :key="'kanji' + cIndex + kIndex"
                  class="kanji-container"
                >
                  <div :class="{ pressed: kanji.done }">{{ kanji.display }}</div>
                  <ul class="zyuin-container">
                    <li
                      v-for="(zhuyin, zIndex) in kanji.zhuyin"
                      :key="'zhuin' + cIndex + kIndex + zIndex"
                      :class="{ pressed: zhuyin.done }"
                    >
                      {{ zhuyin.char }}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <div v-else>Loading</div>
        </div>
        <div class="main-container" v-else>Bopomofo Typer</div>
      </div>
    </div>
    <button @click="toggleIsStart">{{ isStart ? 'Stop' : 'Start' }}</button>
  </main>
</template>

<style>
/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/

main {
  padding: 0;
  margin: 0;
}

.main-window {
  width: 960px;
  height: 540px;
  background-color: aqua;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-container {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

div:focus {
  outline: none;
}

li {
  list-style: none;
}

.sentence-container {
  display: flex;
  justify-content: space-evenly;
  .chunk-container {
    display: flex;
    justify-content: center;
    margin: 0 10px;
    .kanji-container {
      text-align: center;
      margin: 0 5px;
      .zyuin-container {
        display: flex;
        justify-content: center;
      }
    }
  }
}

.pressed {
  color: red;
}
</style>
