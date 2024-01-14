<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import type { Kanji, ZhuyinChar, SentenceContainer, Ranker } from '@/type/types'
import {
  AvailableLang,
  LocalStrageName,
  Level,
  Notch,
  GameState,
  ScoreSendingState
} from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import fetchSentences from '@/utils/fetchSentences'
import i18next from 'i18next'
import VisualKeyboard from '@/components/VisualKeyboard.vue'
import RankingContainer from '@/components/RankingContainer.vue'

const gameTime = 120
const supabase = createClient(import.meta.env.VITE_DB_URL_GEN, import.meta.env.VITE_DB_APIKEY)

const isFocused = ref(false)
const isShift = ref(false)
const isRegisterFormOpen = ref(false)
const scoreSendingState = ref(ScoreSendingState.pending)
const gameState = ref(GameState.stop)
const lang = ref(AvailableLang.en)
const timeCount = ref(gameTime)
const frameCount = ref(0)
const streak = ref(0)
const timeLimit = ref(100)
const score = ref(0)
const rank = ref(0)
const level = ref(localStorage.getItem(LocalStrageName.level) || Level.easy)
const username = ref('')

let keys: Element[]

const rankers: Ranker[] = reactive([])
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
  interval = window.setInterval(() => {
    if (frameCount.value === 0) {
      timeCount.value--
    }
    frameCount.value = (frameCount.value + 1) % 250
    timeLimit.value = timeLimit.value - 0.01
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
  rank.value = 0
  isRegisterFormOpen.value = false
  scoreSendingState.value = ScoreSendingState.pending
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

const toggleGame = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
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

onMounted(async () => {
  keys = [...document.getElementsByClassName('keyboard-key')]

  const { data: allRankers, error } = await supabase
    .from('rankers')
    .select()
    .order('score', { ascending: false }) //.limit(100)
  if (!error) {
    allRankers.forEach((ranker) => {
      rankers.push({ name: ranker.name, score: ranker.score, date: new Date(ranker.date) })
    })
  }
})

const findTargetKey = (arr: Element[], passedKey: string) => {
  return arr.find((key: Element) => {
    return (
      key.firstChild?.textContent === passedKey.toUpperCase() ||
      (passedKey === '?' && key.lastChild?.textContent === '？') ||
      (passedKey === '!' && key.lastChild?.textContent === '！') ||
      (passedKey === '<' && key.lastChild?.textContent === '，、') ||
      (passedKey === '>' && key.lastChild?.textContent === '。')
    )
  })
}

const detectKeydown = (e: KeyboardEvent | null, clickedKey?: string) => {
  if (gameState.value === GameState.playing) {
    if (!kanjiArr.value || !kanjiArr.value.length) return
    const key = e?.key || clickedKey
    if (!key) return
    if (key === 'Shift') {
      isShift.value = true
    } else {
      const targetKey = findTargetKey(keys, key)
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

    if (key === getCorrespondingKeys(answer.char, lang.value)) {
      answer.done = true
      if (answer2) answer2.done = true

      evaluateStatus()
    } else if (answer2 && key === getCorrespondingKeys(answer2.char, lang.value)) {
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
  } else if (gameState.value === GameState.stop) {
    if (!e) return
    if (e.key === 'ArrowUp') {
      switch (level.value) {
        case Level.easy:
          level.value = Level.hard
          localStorage.setItem(LocalStrageName.level, Level.hard)
          break
        case Level.hard:
          level.value = Level.easy
          localStorage.setItem(LocalStrageName.level, Level.easy)
          break
      }
    } else if (e.key === 'ArrowDown') {
      switch (level.value) {
        case Level.easy:
          level.value = Level.hard
          localStorage.setItem(LocalStrageName.level, Level.hard)
          break
        case Level.hard:
          level.value = Level.easy
          localStorage.setItem(LocalStrageName.level, Level.easy)
          break
      }
    } else if (e.key === 'Enter') {
      const target = e.target as HTMLDivElement
      const startButton = target.querySelector('#start-button') as HTMLDivElement
      if (!startButton) return
      startButton.click()
    }
  }
}

const detectKeyup = (e: KeyboardEvent | null, clickedKey?: string) => {
  const key = e?.key || clickedKey
  if (!key) return
  if (key === 'Shift') {
    isShift.value = false
  } else {
    const targetKey = findTargetKey(keys, key)
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
  const button = e.target as HTMLDivElement
  if (button.getAttribute('data-value') === Level.easy) {
    level.value = Level.easy
    localStorage.setItem(LocalStrageName.level, Level.easy)
  } else if (button.getAttribute('data-value') === Level.hard) {
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

const toggleShift = () => {
  const shiftKeyDiv = document.querySelector('#shift-key')
  if (!shiftKeyDiv) return
  if (!isShift.value) {
    isShift.value = true
    shiftKeyDiv.classList.add('key-pressed')
  } else {
    isShift.value = false
    shiftKeyDiv.classList.remove('key-pressed')
  }
}

const registerUserScore = async () => {
  scoreSendingState.value = ScoreSendingState.sending

  const { data: newRanker, error } = await supabase
    .from('rankers')
    .insert([{ name: username.value, score: score.value }])
    .select()
  // .order('score', { ascending: false })
  if (!error) {
    const { data: allRankers, error } = await supabase
      .from('rankers')
      .select()
      .order('score', { ascending: false }) //.limit(100)

    if (!error) {
      while (rankers.length > 0) {
        rankers.shift()
      }
      allRankers.forEach((ranker) => {
        rankers.push({ name: ranker.name, score: ranker.score, date: new Date(ranker.date) })
      })
      const rankedIndex = allRankers.findIndex((ranker) => ranker.id === newRanker[0].id)
      if (rankedIndex >= 0) {
        rank.value = rankedIndex + 1
      } else {
        rank.value = 0
      }
      scoreSendingState.value = ScoreSendingState.sent
    } else {
      scoreSendingState.value = ScoreSendingState.error
    }
  } else {
    scoreSendingState.value = ScoreSendingState.error
  }
}
</script>

<template>
  <main>
    <div class="main-content">
      <div class="current-lang">{{ $t('translation') }}: {{ $t('currentLang') }}</div>
      <button v-on:click="changeLanguage('en')" class="lang-button">English</button>
      <button v-on:click="changeLanguage('ja')" class="lang-button">Japanese</button>
      <div
        id="game-container"
        tabindex="0"
        autofocus
        @keydown="detectKeydown"
        @keyup="detectKeyup"
        @focus="
          () => {
            isFocused = true
          }
        "
        @blur.prevent="
          () => {
            isFocused = false
          }
        "
      >
        <div>
          <span>Time: {{ timeCount }}</span
          >&nbsp;
          <span v-for="(time, index) in addedTime" v-bind:key="'time' + index"
            >+{{ time }}&nbsp;</span
          >
        </div>
        <div>Score: {{ score }}</div>
        <div class="interacrive-part">
          <div
            class="main-window"
            :class="{
              'mainwindow-focused': isFocused
            }"
          >
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
              <div v-else>No sentence</div>
            </div>
            <div class="result-container" v-else-if="gameState === GameState.result">
              <div>Your score: {{ score }}</div>
              <div v-if="!isRegisterFormOpen" class="result-button-container">
                <div @click.stop="toggleGame" class="game-button">{{ $t('backtotitle') }}</div>
                <div @click.stop="startGame" class="game-button">{{ $t('playAgain') }}</div>
                <div @click.stop="isRegisterFormOpen = true" class="game-button">
                  {{ $t('registerScore') }}
                </div>
              </div>
              <div v-else>
                <div class="register-form" v-if="scoreSendingState === ScoreSendingState.pending">
                  <label for="username">{{ $t('yourName') }}</label
                  ><br />
                  <input name="username" v-model="username" maxlength="25" /><br />
                  <div class="game-button" @click.stop="registerUserScore">{{ $t('submit') }}</div>
                </div>
                <div
                  class="result-container"
                  v-else-if="scoreSendingState === ScoreSendingState.sending"
                >
                  Sending...
                </div>
                <div
                  class="result-container"
                  v-else-if="scoreSendingState === ScoreSendingState.sent"
                >
                  <div>{{ $t('congrats') }}</div>
                  <div>{{ $t('rank', { count: rank, ordinal: true }) }}</div>
                  <div @click.stop="toggleGame" class="game-button">{{ $t('backtotitle') }}</div>
                </div>
                <div class="register-form" v-else>
                  Sorry, Something went wrong.
                  <div @click.stop="toggleGame" class="game-button">{{ $t('backtotitle') }}</div>
                  <div
                    @click.stop="scoreSendingState = ScoreSendingState.pending"
                    class="game-button"
                  >
                    {{ $t('sendAgain') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="main-container" v-else>
              <div>Bopomofo Typer(beta)</div>
              <div class="level-container">
                <div
                  class="game-button"
                  :class="[level === Level.easy ? 'level-selected' : '']"
                  :data-value="Level.easy"
                  @click.stop="setLevel"
                >
                  {{ $t('easy') }}
                </div>
                <div
                  class="game-button"
                  :class="[level === Level.hard ? 'level-selected' : '']"
                  :data-value="Level.hard"
                  @click.stop="setLevel"
                >
                  {{ $t('hard') }}
                </div>
              </div>
              <div
                @click.prevent="toggleGame"
                id="start-button"
                class="game-button"
                :class="{
                  'startbotton-focused': isFocused
                }"
              >
                {{ $t('start') }}
              </div>
            </div>
          </div>
          <VisualKeyboard
            :isShift="isShift"
            @detectKeydown="(key) => detectKeydown(null, key)"
            @detectKeyup="(key) => detectKeyup(null, key)"
            @toggleShift="toggleShift"
          />
        </div>
      </div>
    </div>
    <RankingContainer :rankers="rankers" />
  </main>
</template>

<style>
/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
  color:
  #3c493f
  #5d6b62
  #7e8d85
  #99a69f
  #b3bfb8
  #d2dbd6
  #f0f7f4
  #c9eddc
  #a2e3c4
}*/

@keyframes startbutton {
  from {
    background-color: #b3bfb8;
  }
  to {
    background-color: #c9eddc;
  }
}

* {
  --text-height: 30px;
  --background: #d2dbd6;
  --button-color: #b3bfb8;
  --button-color-active: #d2dbd6;
  --button-color-selected: #7e8d85;
  --border-color: #3c493f;
}

main {
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

button {
  background-color: var(--button-color);
  border-radius: 3px;
  border: solid 1px var(--border-color);
  margin: 1px;
  outline: none;
}

button:hover {
  background-color: var(--button-color-selected);
  transition: background-color 0.2s;
}

button:active {
  background-color: var(--button-color-active);
  transform: scale(0.95);
  transition:
    background-color 0.05,
    transform 0.05s;
}

.current-lang {
  height: var(--text-height);
  display: flex;
  align-items: center;
}

.lang-button {
  width: 80px;
  height: 20px;
}

.interacrive-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background);
  border-radius: 20px;
}

.main-window {
  width: 100%;
  border: solid 2px var(--border-color);
  border-radius: 20px;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#start-button {
  width: 80px;
  height: var(--text-height);
  background-color: var(--button-color);
}

#start-button:hover {
  animation-name: none;
  background-color: #c9eddc;
  transition:
    background-color 0.5s,
    transform 0.2s;
}

div:focus {
  outline: none;
}

ul {
  list-style: none;
}

.sentence-container {
  display: flex;
  justify-content: space-evenly;
  font-size: 1.5em;
  background-color: var(--background);
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

.game-button {
  width: 120px;
  height: var(--text-height);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--button-color);
  border-radius: 3px;
  border: solid 1px var(--border-color);
  margin: 1px;
  user-select: none;
  transition: transform 0.2s;
}

.game-button:active {
  transform: scale(0.95);
}

.level-selected {
  background-color: var(--button-color-selected);
}

.time-bar {
  position: absolute;
  top: 0;
  width: v-bind('timeLimitStr');
  height: 20px;
  background-color: v-bind('timeBarColor');
}

.mainwindow-focused {
  box-shadow: inset 5px 5px 10px #99a69f;
}

.startbotton-focused {
  animation-name: startbutton;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@media screen and (min-width: 1040px) {
  main {
    display: grid;
    grid-template-columns: 1fr 1040px 1fr 1fr 1fr;
    gap: 5px;
  }
  .main-content {
    grid-column-start: 2;
    justify-self: center;
  }
  .interacrive-part {
    width: 1040px;
  }
  .main-window {
    height: 360px;
  }
  .result-container {
    div {
      margin: 5px 0;
    }
  }
}

@media screen and (min-width: 960px) and (max-width: 1039px) {
  main {
    flex-direction: column;
    align-items: center;
  }
  .interacrive-part {
    width: 960px;
  }
  .main-window {
    height: 360px;
  }
  .sentence-container {
    font-size: 1.2em;
  }
  .result-container {
    div {
      margin: 5px 0;
    }
  }
}

@media screen and (max-width: 959px) {
  main {
    flex-direction: column;
    align-items: center;
  }
  .interacrive-part {
    width: 600px;
  }
  .main-window {
    height: 150px;
  }
  .time-bar {
    height: 15px;
    top: -20px;
  }
  .sentence-container {
    font-size: 1em;
    .chunk-container {
      margin: 0 5px;
      .kanji-container {
        margin: 0 2px;
      }
    }
  }
  .result-container {
    div {
      margin: 5px 0;
    }
  }
}
</style>
