<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Kanji, ZhuyinChar, SentenceContainer } from '@/type/types'
import { AvailableLang, LocalStrageName, Level, Notch, GameState } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import fetchSentences from '@/utils/fetchSentences'
import i18next from 'i18next'
import VisualKeyboard from '@/components/VisualKeyboard.vue'

const gameTime = 120

const isPressed = ref(false)
const isShift = ref(false)
const gameState = ref(GameState.stop)
const lang = ref(AvailableLang.en)
const timeCount = ref(gameTime)
const frameCount = ref(0)
const streak = ref(0)
const timeLimit = ref(100)
const score = ref(0)
const level = ref(localStorage.getItem(LocalStrageName.level) || Level.easy)

let keys: Element[]

const addedTime: number[] = reactive([])

const sentences: SentenceContainer = reactive({
  high: [],
  low: []
})

const timeLimitStr = computed(() => {
  return timeLimit.value + '%'
})

const currentNotch = computed(() => {
  if (streak.value > 5 && sentences.high.length) {
    return Notch.high
  } else {
    return Notch.low
  }
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
  if (!sentences.low.length && !sentences.high.length) return null
  if (currentNotch.value === Notch.low && sentences.low.length) {
    return sentences.low[0]
  } else if (currentNotch.value === Notch.high && sentences.high.length) {
    return sentences.high[0]
  } else {
    return sentences.low[0]
  }
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

const startGame = async () => {
  await fetchSentences(sentences, level.value as Level)

  gameState.value = GameState.playing
  timeLimit.value = 100
  timeCount.value = gameTime
  frameCount.value = 0
  score.value = 0
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => {
    if (frameCount.value === 0) {
      timeCount.value--
    }
    frameCount.value = (frameCount.value + 1) % 250
    timeLimit.value = timeLimit.value - 0.02
    if (timeCount.value <= 0) {
      moveToResult()
    } else if (timeLimit.value < 0) {
      if (currentNotch.value === Notch.low) {
        sentences.low.shift()
      } else if (currentNotch.value === Notch.high) {
        sentences.high.shift()
      }
      streak.value = 0
      timeLimit.value = 100
      if (!sentences.low.length && !sentences.high.length) {
        moveToResult()
      }
    }
  })
}

const initiateStatus = () => {
  gameState.value = GameState.stop
  timeLimit.value = 100
  timeCount.value = gameTime
  frameCount.value = 0
  score.value = 0
  if (!interval) return
  clearInterval(interval)
  interval = null
}

const moveToResult = () => {
  gameState.value = GameState.result
  if (!interval) return
  clearInterval(interval)
  interval = null
}

const toggleGame = async () => {
  if (gameState.value === GameState.stop) {
    startGame()
  } else {
    initiateStatus()
    while (sentences.low.length > 0) {
      sentences.low.shift()
    }
    while (sentences.high.length > 0) {
      sentences.high.shift()
    }
  }
}

onMounted(() => {
  keys = [...document.getElementsByClassName('keyboard-key')]
})

const findTargetKey = (arr: Element[], e: KeyboardEvent) => {
  return arr.find((key: Element) => {
    return (
      key.firstChild?.textContent === e.key.toUpperCase() ||
      (e.key === '?' && key.lastChild?.textContent === '？') ||
      (e.key === '!' && key.lastChild?.textContent === '！') ||
      (e.key === '<' && key.lastChild?.textContent === '，、') ||
      (e.key === '>' && key.lastChild?.textContent === '。')
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
  let answer2: ZhuyinChar | undefined
  if (kanjiArr.value[0].zhuyin2 && kanjiArr.value[0].zhuyin.length > 0) {
    answer2 = kanjiArr.value[0].zhuyin2.find((zhuyin) => !zhuyin.done)
  }
  if (!answer) return

  const evaluateStatus = () => {
    score.value += 1
    if (kanjiArr.value[0].zhuyin.every((zhuyin) => zhuyin.done)) {
      kanjiArr.value[0].done = true
      kanjiArr.value.shift()
      timeLimit.value += 5
      score.value += 5
    }
    if (!kanjiArr.value.length) {
      if (currentNotch.value === Notch.low) {
        score.value += 10
        sentences.low.shift()
      } else if (currentNotch.value === Notch.high) {
        score.value += 25
        sentences.high.shift()
      }
      streak.value++
      timeLimit.value = 100
      score.value += streak.value * 5
      if (streak.value % 3 === 0) {
        const streakBonus = 10
        timeCount.value += streakBonus
        displayAddedTime(streakBonus)
      }
      if (!sentences.low.length && !sentences.high.length) {
        moveToResult()
      }
    }
  }

  if (e.key === getCorrespondingKeys(answer.char, lang.value)) {
    answer.done = true
    if (answer2) answer2.done = true

    evaluateStatus()
  } else if (answer2 && e.key === getCorrespondingKeys(answer2.char, lang.value)) {
    answer2.done = true
    while (kanjiArr.value[0].zhuyin.length > 0) {
      kanjiArr.value[0].zhuyin.shift()
    }
    if (kanjiArr.value[0].zhuyin2) {
      for (const kanjiContainer of kanjiArr.value[0].zhuyin2) {
        kanjiArr.value[0].zhuyin.push(kanjiContainer)
      }
      while (kanjiArr.value[0].zhuyin2.length > 0) {
        kanjiArr.value[0].zhuyin2.shift()
      }
    }

    evaluateStatus()
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

const displayAddedTime = (time: number) => {
  addedTime.push(time)
  setTimeout(() => {
    addedTime.shift()
  }, 600)
}
</script>

<template>
  <main>
    <div style="height: 30px">{{ $t('translation') }}: {{ $t('currentLang') }}</div>
    <button v-on:click="changeLanguage('en')">English</button>
    <button v-on:click="changeLanguage('ja')">Japanese</button>
    <div tabindex="0" @keydown="detectKeydown" @keyup="detectKeyup" :class="{ pressed: isPressed }">
      <div>
        <span>Time: {{ timeCount }}</span
        >&nbsp;
        <span v-for="(time, index) in addedTime" v-bind:key="'time' + index"
          >+{{ time }}&nbsp;</span
        >
      </div>
      <div>Score: {{ score }}</div>
      <div class="main-window">
        <div class="main-container" v-if="gameState === GameState.playing">
          <div class="time-bar"></div>
          <div>
            {{ currentSentence ? $t(`sentence_${currentNotch}_${currentSentence.id}`) : '' }}
          </div>
          <ul v-if="currentSentence" class="sentence-container">
            <li v-for="(chunk, cIndex) in currentSentence.chunks" :key="'chunk' + cIndex">
              <ul v-if="isChuck(chunk)" class="chunk-container">
                <li v-for="(word, wIndex) in chunk.word" :key="'word' + cIndex + wIndex">
                  <ul v-if="isWord(word)" class="kanji-container">
                    <li
                      v-for="(kanji, kIndex) in word.kanji"
                      :key="'kanji' + cIndex + wIndex + kIndex"
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
                    <li>
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
                    </li>
                  </ul>
                </li>
              </ul>
              <ul v-else class="chunk-container">
                <ul class="kanji-container">
                  <li v-for="(kanji, kIndex) in chunk.kanji" :key="'kanji' + cIndex + kIndex">
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
              </ul>
            </li>
          </ul>
          <div v-else>Loading</div>
        </div>
        <div v-else-if="gameState === GameState.result">
          <div>Your score: {{ score }}</div>
          <button @click.stop="toggleGame">Leave</button
          ><button @click.stop="startGame">Play again</button>
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
          <button @click="toggleGame">Start</button>
        </div>
      </div>
    </div>
    <VisualKeyboard :isShift="isShift" />
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
        display: flex;
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
