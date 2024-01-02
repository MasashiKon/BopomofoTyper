<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Kanji, Sentence, ZhuyinChar } from '@/type/types'
import { AvailableLang, LocalStrageName, Level } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import fetchSentences from '@/utils/fetchSentences'
import i18next from 'i18next'
import VisualKeyboard from '@/components/VisualKeyboard.vue'

const isPressed = ref(false)
const isShift = ref(false)
const isStart = ref(false)
const lang = ref(AvailableLang.en)
const timeCount = ref(0)
const frameCount = ref(0)
const timeLimit = ref(100)
const currentSentenceId = ref(1)
const level = ref(localStorage.getItem(LocalStrageName.level) || Level.easy)

let keys: Element[]

const sentences: Sentence[] = reactive([])

const timeLimitStr = computed(() => {
  return timeLimit.value + '%'
})

const timeBarColor = computed(() => {
  if (timeLimit.value > 20) {
    return 'green'
  } else if (timeLimit.value > 5) {
    return 'yellow'
  } else {
    return 'red'
  }
})

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

const toggleIsStart = async () => {
  if (isStart.value) {
    if (!interval) return
    clearInterval(interval)
    interval = null
    timeLimit.value = 100
    timeCount.value = 0
    frameCount.value = 0
    currentSentenceId.value = 1
    while (sentences.length > 0) {
      sentences.shift()
    }
  } else {
    await fetchSentences(sentences, level.value as Level)

    timeCount.value = 0
    interval = setInterval(() => {
      frameCount.value = (frameCount.value + 1) % 250
      if (frameCount.value === 0) {
        timeCount.value++
      }
      timeLimit.value = timeLimit.value - 0.02
      if (timeLimit.value < 0) {
        sentences.shift()
        currentSentenceId.value++
        timeLimit.value = 100
        if (!sentences.length) {
          isStart.value = false
          currentSentenceId.value = 1
          if (!interval) return
          clearInterval(interval)
        }
      }
    })
  }
  isStart.value = !isStart.value
}

onMounted(() => {
  keys = [...document.getElementsByClassName('keyboard-key')]
})

const findTargetKey = (arr: Element[], e: KeyboardEvent) => {
  return arr.find((key: Element) => {
    return (
      key.firstChild?.textContent === e.key.toUpperCase() ||
      (e.key === '?' && key.lastChild?.textContent === '？') ||
      (e.key === '!' && key.lastChild?.textContent === '！')
    )
  })
}

const detectKeydown = (e: KeyboardEvent) => {
  if (!kanjiArr.value || !kanjiArr.value.length) return
  if (e.key === 'Shift') {
    isShift.value = true
  } else {
    const targetKey = findTargetKey(keys, e)
    if (targetKey) {
      targetKey.classList.add('key-pressed')
    }
  }  
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
      timeLimit.value = 100
      currentSentenceId.value++
      if (!sentences.length) {
        isStart.value = false
        currentSentenceId.value = 1
        if (!interval) return
        clearInterval(interval)
      }
    }
  }
}

const detectKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Shift') {
    isShift.value = false
  } else {
    const targetKey = findTargetKey(keys, e)
    if (targetKey) {
      targetKey.classList.remove('key-pressed')
    }
  }
}

const changeLanguage = (lang: string) => {
  i18next.changeLanguage(lang)
  localStorage.setItem(LocalStrageName.userLang, lang)
}

const setLevel = (e: MouseEvent) => {
  if (!e.target) return
  const button = e.target as HTMLButtonElement
  if (button.value === Level.easy) {
    level.value = Level.easy
    localStorage.setItem(LocalStrageName.level, Level.easy)
  } else if (button.value === Level.hard) {
    level.value = Level.hard
    localStorage.setItem(LocalStrageName.level, Level.hard)
  }
}
</script>

<template>
  <main>
    <div style="height: 30px">{{ $t('translation') }}: {{ $t('currentLang') }}</div>
    <button v-on:click="changeLanguage('en')">English</button>
    <button v-on:click="changeLanguage('ja')">Japanese</button>
    <div tabindex="0" @keydown="detectKeydown" @keyup="detectKeyup" :class="{ pressed: isPressed }">
      <span>Time: {{ timeCount }}</span>
      <div class="main-window">
        <div class="main-container" v-if="isStart">
          <div class="time-bar"></div>
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
        <div class="main-container" v-else>
          <div>Bopomofo Typer</div>
          <div class="level-container">
            <button
              class="level-button"
              :class="[level === Level.easy ? 'level-selected' : '']"
              :value="Level.easy"
              @click.stop="setLevel"
            >
              {{ $t('easy') }}
            </button>
            <button
              class="level-button"
              :class="[level === Level.hard ? 'level-selected' : '']"
              :value="Level.hard"
              @click.stop="setLevel"
            >
              {{ $t('hard') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <VisualKeyboard :isShift="isShift" />
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
  --text-height: 30px;
  padding: 0;
  margin: 0;
  .main-window {
    width: 640px;
    height: 360px;
    background-color: aqua;
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .main-container {
    position: relative;
    width: 100%;
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

  .level-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .level-button {
    height: var(--text-height);
  }

  .level-selected {
    background-color: blue;
  }

  .time-bar {
    position: absolute;
    top: 0;
    width: v-bind('timeLimitStr');
    height: 20px;
    background-color: v-bind('timeBarColor');
  }
}
</style>
