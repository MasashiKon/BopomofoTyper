<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Kanji, Sentence, ZhuyinChar } from '@/type/types'
import { AvailableLang, LocalStrageName } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import fetchSentences from '@/utils/fetchSentences'
import i18next from 'i18next'

const isPressed = ref(false)
const isShift = ref(false)
const isStart = ref(false)
const lang = ref(AvailableLang.en)
const timeCount = ref(0)
const currentSentenceId = ref(1)
let keys: Element[]

const sentences: Sentence[] = reactive([])

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
  } else {
    await fetchSentences(sentences)

    interval = setInterval(() => {
      timeCount.value = timeCount.value + 1
    }, 1000)
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
</script>

<template>
  <main>
    <div style="height: 30px;">{{ $t('translation') }}: {{ $t('currentLang') }}</div>
    <button v-on:click="changeLanguage('en')">English</button>
    <button v-on:click="changeLanguage('ja')">Japanese</button>
    <div tabindex="0" @keydown="detectKeydown" @keyup="detectKeyup" :class="{ pressed: isPressed }">
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
    <div class="keyboard-container">
      <div class="keyboard">
        <div class="keyboard-row">
          <div class="keyboard-key">
            <div>1</div>
            <div v-if="!isShift">ㄅ</div>
            <div v-else>！</div>
          </div>
          <div class="keyboard-key">
            <div>2</div>
            <div v-if="!isShift">ㄉ</div>
          </div>
          <div class="keyboard-key">
            <div>3</div>
            <div v-if="!isShift">ˇ</div>
          </div>
          <div class="keyboard-key">
            <div>4</div>
            <div v-if="!isShift">ˋ</div>
          </div>
          <div class="keyboard-key">
            <div>5</div>
            <div v-if="!isShift">ㄓ</div>
          </div>
          <div class="keyboard-key">
            <div>6</div>
            <div v-if="!isShift">ˊ</div>
          </div>
          <div class="keyboard-key">
            <div>7</div>
            <div v-if="!isShift">˙</div>
          </div>
          <div class="keyboard-key">
            <div>8</div>
            <div v-if="!isShift">ㄚ</div>
          </div>
          <div class="keyboard-key">
            <div>9</div>
            <div v-if="!isShift">ㄞ</div>
          </div>
          <div class="keyboard-key">
            <div>0</div>
            <div v-if="!isShift">ㄢ</div>
          </div>
          <div class="keyboard-key">
            <div>-</div>
            <div v-if="!isShift">ㄦ</div>
          </div>
        </div>
        <div class="keyboard-row">
          <div class="keyboard-key">
            <div>Q</div>
            <div v-if="!isShift">ㄆ</div>
          </div>
          <div class="keyboard-key">
            <div>W</div>
            <div v-if="!isShift">ㄊ</div>
          </div>
          <div class="keyboard-key">
            <div>E</div>
            <div v-if="!isShift">ㄍ</div>
          </div>
          <div class="keyboard-key">
            <div>R</div>
            <div v-if="!isShift">ㄐ</div>
          </div>
          <div class="keyboard-key">
            <div>T</div>
            <div v-if="!isShift">ㄔ</div>
          </div>
          <div class="keyboard-key">
            <div>Y</div>
            <div v-if="!isShift">ㄗ</div>
          </div>
          <div class="keyboard-key">
            <div>U</div>
            <div v-if="!isShift">ㄧ</div>
          </div>
          <div class="keyboard-key">
            <div>I</div>
            <div v-if="!isShift">ㄛ</div>
          </div>
          <div class="keyboard-key">
            <div>O</div>
            <div v-if="!isShift">ㄟ</div>
          </div>
          <div class="keyboard-key">
            <div>P</div>
            <div v-if="!isShift">ㄣ</div>
          </div>
        </div>
        <div class="keyboard-row">
          <div class="keyboard-key">
            <div>A</div>
            <div v-if="!isShift">ㄇ</div>
          </div>
          <div class="keyboard-key">
            <div>S</div>
            <div v-if="!isShift">ㄋ</div>
          </div>
          <div class="keyboard-key">
            <div>D</div>
            <div v-if="!isShift">ㄎ</div>
          </div>
          <div class="keyboard-key">
            <div>F</div>
            <div v-if="!isShift">ㄑ</div>
          </div>
          <div class="keyboard-key">
            <div>G</div>
            <div v-if="!isShift">ㄕ</div>
          </div>
          <div class="keyboard-key">
            <div>H</div>
            <div v-if="!isShift">ㄘ</div>
          </div>
          <div class="keyboard-key">
            <div>J</div>
            <div v-if="!isShift">ㄨ</div>
          </div>
          <div class="keyboard-key">
            <div>K</div>
            <div v-if="!isShift">ㄜ</div>
          </div>
          <div class="keyboard-key">
            <div>L</div>
            <div v-if="!isShift">ㄠ</div>
          </div>
          <div class="keyboard-key">
            <div>;</div>
            <div v-if="!isShift">ㄤ</div>
          </div>
        </div>
        <div class="keyboard-row">
          <div class="keyboard-key">
            <div>Z</div>
            <div v-if="!isShift">ㄈ</div>
          </div>
          <div class="keyboard-key">
            <div>X</div>
            <div v-if="!isShift">ㄌ</div>
          </div>
          <div class="keyboard-key">
            <div>C</div>
            <div v-if="!isShift">ㄏ</div>
          </div>
          <div class="keyboard-key">
            <div>V</div>
            <div v-if="!isShift">ㄒ</div>
          </div>
          <div class="keyboard-key">
            <div>B</div>
            <div v-if="!isShift">ㄖ</div>
          </div>
          <div class="keyboard-key">
            <div>N</div>
            <div v-if="!isShift">ㄙ</div>
          </div>
          <div class="keyboard-key">
            <div>M</div>
            <div v-if="!isShift">ㄩ</div>
          </div>
          <div class="keyboard-key">
            <div>,</div>
            <div v-if="!isShift">ㄝ</div>
          </div>
          <div class="keyboard-key">
            <div>.</div>
            <div v-if="!isShift">ㄡ</div>
          </div>
          <div class="keyboard-key">
            <div>/</div>
            <div v-if="!isShift">ㄥ</div>
            <div v-else>？</div>
          </div>
        </div>
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

.keyboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: chartreuse;
  width: 640px;
  height: 200px;
}

.keyboard {
  --key-size: 40px;
  --row-gap: 15px;
  --row-base-margin: -15px;
  .keyboard-row {
    display: flex;
    padding: 2px 0;
    .keyboard-key {
      width: var(--key-size);
      height: var(--key-size);
      background-color: whitesmoke;
      border: 1px solid black;
      text-align: center;
      margin: 0 2px;
    }
    .key-pressed {
      background-color: rgba(245, 245, 245, 0.283);
    }
  }

  .keyboard-row:nth-child(1) {
    margin-left: calc(var(--row-base-margin) + var(--row-gap));
  }

  .keyboard-row:nth-child(2) {
    margin-left: calc(var(--row-base-margin) + (var(--row-gap) * 2));
  }

  .keyboard-row:nth-child(3) {
    margin-left: calc(var(--row-base-margin) + (var(--row-gap) * 3));
  }

  .keyboard-row:nth-child(4) {
    margin-left: calc(var(--row-base-margin) + (var(--row-gap) * 4));
  }
}
</style>
