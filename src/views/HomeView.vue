<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { useTranslation } from 'i18next-vue'
import i18next from 'i18next'
import type {
  Kanji,
  ZhuyinChar,
  SentenceContainer,
  Ranker,
  TypingStatistics,
  CharStatistics
} from '@/type/types'
import {
  AvailableLang,
  LocalStrageName,
  Level,
  Notch,
  GameState,
  ScoreSendingState,
  Zhuyin,
  SocialMedia
} from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import fetchSentences from '@/utils/fetchSentences'
import practiceModeZhuyinList from '@/utils/zhuyinList'
import { reverseZhuyin } from '@/utils/convertZhuyin'
import VisualKeyboard from '@/components/VisualKeyboard.vue'
import RankingContainer from '@/components/RankingContainer.vue'
import MenuScene from '@/components/MenuScene.vue'

const gameTime = 120
const baseVolume = 1
const streakThreshold = 5
const supabase = createClient(import.meta.env.VITE_DB_URL_GEN, import.meta.env.VITE_DB_APIKEY)
const i18n = useTranslation()
let hitKeySound: HTMLAudioElement | null
let popSound: HTMLAudioElement | null

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
const volume = ref(localStorage.getItem(LocalStrageName.volume) || '50')
const isVolumeOn = ref(
  localStorage.getItem(LocalStrageName.isVolumeOn) === 'true' ? true : false || false
)
const verticalZhuyin = ref(
  localStorage.getItem(LocalStrageName.verticalZhuyin) === 'true' ? true : false || false
)
const hideZhuyin = ref(
  localStorage.getItem(LocalStrageName.hideZhuyin) === 'true' ? true : false || false
)

let keys: Element[]

const typingStatistics: TypingStatistics = reactive({
  b: { total: 0, success: 0 },
  p: { total: 0, success: 0 },
  m: { total: 0, success: 0 },
  f: { total: 0, success: 0 },
  d: { total: 0, success: 0 },
  t: { total: 0, success: 0 },
  n: { total: 0, success: 0 },
  l: { total: 0, success: 0 },
  g: { total: 0, success: 0 },
  k: { total: 0, success: 0 },
  h: { total: 0, success: 0 },
  j: { total: 0, success: 0 },
  q: { total: 0, success: 0 },
  x: { total: 0, success: 0 },
  zh: { total: 0, success: 0 },
  ch: { total: 0, success: 0 },
  sh: { total: 0, success: 0 },
  r: { total: 0, success: 0 },
  z: { total: 0, success: 0 },
  c: { total: 0, success: 0 },
  s: { total: 0, success: 0 },
  a: { total: 0, success: 0 },
  o: { total: 0, success: 0 },
  e: { total: 0, success: 0 },
  e2: { total: 0, success: 0 },
  ai: { total: 0, success: 0 },
  ei: { total: 0, success: 0 },
  ao: { total: 0, success: 0 },
  ou: { total: 0, success: 0 },
  an: { total: 0, success: 0 },
  en: { total: 0, success: 0 },
  ang: { total: 0, success: 0 },
  eng: { total: 0, success: 0 },
  er: { total: 0, success: 0 },
  i: { total: 0, success: 0 },
  u: { total: 0, success: 0 },
  u2: { total: 0, success: 0 },
  tone1: { total: 0, success: 0 },
  tone2: { total: 0, success: 0 },
  tone3: { total: 0, success: 0 },
  tone4: { total: 0, success: 0 },
  tone5: { total: 0, success: 0 }
})
const rankers: Ranker[] = reactive([])
const addedTime: number[] = reactive([])

const sentences: SentenceContainer = reactive({
  practice: [[], []],
  high: [],
  low: []
})

const timeLimitStr = computed(() => {
  return timeLimit.value + '%'
})

const currentNotch = computed(() => {
  if (streak.value > streakThreshold && (sentences.high.length || sentences.practice[1].length)) {
    return Notch.high
  } else if (sentences.low.length) {
    return Notch.low
  } else if (sentences.high.length) {
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
  if (level.value === Level.practice && currentNotch.value === Notch.low) return null
  if (!sentences.low.length && !sentences.high.length && !sentences.practice[1].length) return null
  // // @ts-ignore
  // if (responsiveVoice.isPlaying()) {
  //   // @ts-ignore
  //   responsiveVoice.cancel()
  // }
  if (level.value === Level.practice && currentNotch.value === Notch.high) {
    if (isVolumeOn.value) {
      // @ts-ignore
      responsiveVoice.speak(sentences.practice[1][0].sentense)
    }
    return sentences.practice[1][0]
  } else if (currentNotch.value === Notch.low) {
    if (isVolumeOn.value) {
      // @ts-ignore
      responsiveVoice.speak(sentences.low[0].sentense)
    }
    return sentences.low[0]
  } else if (currentNotch.value === Notch.high) {
    if (isVolumeOn.value) {
      // @ts-ignore
      responsiveVoice.speak(sentences.high[0].sentense)
    }
    return sentences.high[0]
  } else {
    return null
  }
})

const currentPracticeZhuyin = computed(() => {
  if (level.value !== Level.practice) return null
  if (currentNotch.value === Notch.low) {
    if (sentences.practice[0].length < 0) return null
    if (isVolumeOn.value && sentences.practice[0][0]) {
      // @ts-ignore
      responsiveVoice.speak(sentences.practice[0][0].char)
    }
    return sentences.practice[0][0]
  } else {
    return null
  }
})

const kanjiArr = computed((): Kanji[] => {
  const kanjiArr: Kanji[] = []
  if (level.value === Level.practice && currentNotch.value === Notch.low) return kanjiArr
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
  if (level.value === Level.practice) {
    // @ts-ignore
    responsiveVoice.setDefaultVoice('Chinese Female')
    while (sentences.practice[0].length > 0) {
      sentences.practice[0].shift()
    }
    while (sentences.practice[1].length > 0) {
      sentences.practice[1].shift()
    }
    initiateStatus()
    const zhuyinList = [...practiceModeZhuyinList]
    while (zhuyinList.length > 0) {
      const index = Math.floor(Math.random() * zhuyinList.length)
      const pickedZhuyin = zhuyinList.splice(index, 1)
      sentences.practice[0].push(...pickedZhuyin)
    }

    await fetchSentences(sentences, level.value as Level)
  } else {
    // @ts-ignore
    responsiveVoice.setDefaultVoice('Chinese Taiwan Male')
    gameState.value = GameState.loading
    while (sentences.low.length > 0) {
      sentences.low.shift()
    }
    while (sentences.high.length > 0) {
      sentences.high.shift()
    }
    await fetchSentences(sentences, level.value as Level)
    if (interval) {
      clearInterval(interval)
    }
    initiateStatus()
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
}

const initiateStatus = () => {
  gameState.value = GameState.playing
  timeLimit.value = 100
  timeCount.value = gameTime
  frameCount.value = 0
  score.value = 0
  rank.value = 0
  streak.value = 0
  isRegisterFormOpen.value = false
  scoreSendingState.value = ScoreSendingState.pending
  for (const [key] of Object.entries(typingStatistics)) {
    typingStatistics[key].total = 0
    typingStatistics[key].success = 0
  }
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

const toggleGame = (e: Event, newGameState: GameState) => {
  e.preventDefault()
  e.stopPropagation()
  if (newGameState === GameState.stop) {
    gameState.value = GameState.stop
  } else if (newGameState === GameState.playing) {
    gameState.value = GameState.playing
    startGame()
  } else if (newGameState === GameState.result) {
    gameState.value = GameState.result
  }
}

const setVolume = () => {
  if (!hitKeySound || !popSound) return
  hitKeySound.volume = (baseVolume * Number(volume.value)) / 100
  popSound.volume = (baseVolume * Number(volume.value)) / 100
  localStorage.setItem(LocalStrageName.volume, volume.value)
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

  hitKeySound = new Audio('/sounds/hit-key.mp3')
  popSound = new Audio('/sounds/pop.mp3')
  setVolume()

  // @ts-ignore
  responsiveVoice.setDefaultVoice('Chinese Female')
})

const findTargetKey = (arr: Element[], passedKey: string) => {
  return arr.find((key: Element) => {
    return (
      key.firstChild?.textContent === passedKey.toUpperCase() ||
      (passedKey === '?' && key.lastChild?.textContent === '？') ||
      (passedKey === '!' && key.lastChild?.textContent === '！') ||
      (passedKey === '<' && key.lastChild?.textContent === '，、') ||
      (passedKey === '>' && key.lastChild?.textContent === '。') ||
      (passedKey === ' ' && key.firstChild?.textContent === 'Space') ||
      (passedKey === 'Shift' && key.firstChild?.textContent === 'Shift')
    )
  })
}

const isTone234 = (str: Zhuyin) => {
  if (
    str === Zhuyin.tone2 ||
    str === Zhuyin.tone3 ||
    str === Zhuyin.tone4 ||
    str === Zhuyin.tone5
  ) {
    return true
  } else {
    return false
  }
}

watch(volume, () => {
  setVolume()
})

const detectKeydown = (e: KeyboardEvent | null, clickedKey?: string) => {
  if (gameState.value === GameState.playing) {
    const key = e?.key || clickedKey
    if (!key) return
    if (key === 'Shift') {
      isShift.value = true
    }

    const targetKey = findTargetKey(keys, key)
    if (targetKey) {
      targetKey.classList.add('key-pressed')
    }

    const playSound = (sound: HTMLAudioElement | null) => {
      if (!sound || !isVolumeOn.value) return
      sound.currentTime = 0
      sound.play()
    }

    if (level.value === Level.practice && currentNotch.value === Notch.low) {
      if (currentPracticeZhuyin.value) {
        const answer: Zhuyin = currentPracticeZhuyin.value.char
        if (key === getCorrespondingKeys(answer, lang.value)) {
          sentences.practice[0].shift()
          if (sentences.practice[0].length === 0) {
            streak.value = streakThreshold + 1
          }
        }
      }
    } else if (level.value === Level.practice && currentNotch.value === Notch.high) {
      if (!kanjiArr.value || !kanjiArr.value.length) return

      const answer: ZhuyinChar | undefined = kanjiArr.value[0].zhuyin.find((zhuyin) => !zhuyin.done)
      if (!answer) return
      const evaluateStatus = () => {
        if (kanjiArr.value[0].zhuyin.every((zhuyin) => zhuyin.done)) {
          kanjiArr.value[0].done = true
          kanjiArr.value.shift()
        }
        if (!kanjiArr.value.length) {
          sentences.practice[1].shift()
          if (!sentences.practice[1].length) {
            gameState.value = GameState.stop
          }
        }
      }

      if (key === getCorrespondingKeys(answer.char, lang.value)) {
        answer.done = true
        evaluateStatus()
      }
    } else {
      if (!kanjiArr.value || !kanjiArr.value.length) return

      let typedZhuyin: CharStatistics | undefined

      const answer: ZhuyinChar | undefined = kanjiArr.value[0].zhuyin.find((zhuyin) => !zhuyin.done)
      let answer2: ZhuyinChar | undefined
      if (kanjiArr.value[0].zhuyin2 && kanjiArr.value[0].zhuyin.length > 0) {
        answer2 = kanjiArr.value[0].zhuyin2.find((zhuyin) => !zhuyin.done)
      }
      if (!answer) return

      const zhuyinAlphabet = reverseZhuyin(answer.char)
      if (zhuyinAlphabet) {
        typedZhuyin = typingStatistics[zhuyinAlphabet]
        if (typedZhuyin) {
          typedZhuyin.total++
        }
      }

      const evaluateStatus = () => {
        score.value += 1
        if (kanjiArr.value[0].zhuyin.every((zhuyin) => zhuyin.done)) {
          kanjiArr.value[0].done = true
          kanjiArr.value.shift()
          timeLimit.value += 5
          score.value += 5
          playSound(popSound)
        } else {
          playSound(hitKeySound)
        }
        if (!kanjiArr.value.length) {
          if (currentNotch.value === Notch.low) {
            score.value += 10
            sentences.low.shift()
          } else if (currentNotch.value === Notch.high) {
            score.value += 100
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
        if (typedZhuyin) {
          typedZhuyin.success++
        }
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
        const zhuyinAlphabet = reverseZhuyin(answer2.char)
        if (zhuyinAlphabet) {
          typedZhuyin = typingStatistics[zhuyinAlphabet]
          if (typedZhuyin) {
            typedZhuyin.total++
            typedZhuyin.success++
          }
        }
      } else {
        playSound(hitKeySound)
      }
    }
  } else if (gameState.value === GameState.stop) {
    if (!e) return
    if (e.key === 'ArrowUp') {
      switch (level.value) {
        case Level.practice:
          level.value = Level.hard
          localStorage.setItem(LocalStrageName.level, Level.hard)
          break
        case Level.easy:
          level.value = Level.practice
          localStorage.setItem(LocalStrageName.level, Level.practice)
          break
        case Level.hard:
          level.value = Level.easy
          localStorage.setItem(LocalStrageName.level, Level.easy)
          break
      }
    } else if (e.key === 'ArrowDown') {
      switch (level.value) {
        case Level.practice:
          level.value = Level.easy
          localStorage.setItem(LocalStrageName.level, Level.easy)
          break
        case Level.easy:
          level.value = Level.hard
          localStorage.setItem(LocalStrageName.level, Level.hard)
          break
        case Level.hard:
          level.value = Level.practice
          localStorage.setItem(LocalStrageName.level, Level.practice)
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
  }
  const targetKey = findTargetKey(keys, key)
  if (targetKey) {
    targetKey.classList.remove('key-pressed')
  }
}

const changeLanguage = (lang: string) => {
  i18next.changeLanguage(lang)
  localStorage.setItem(LocalStrageName.userLang, lang)
}

const setLevel = (e: MouseEvent) => {
  if (!e.target) return
  const button = e.target as HTMLDivElement
  if (button.getAttribute('data-value') === Level.practice) {
    level.value = Level.practice
    localStorage.setItem(LocalStrageName.level, Level.practice)
  } else if (button.getAttribute('data-value') === Level.easy) {
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

const toggleVolume = () => {
  isVolumeOn.value = !isVolumeOn.value
  localStorage.setItem(LocalStrageName.isVolumeOn, String(isVolumeOn.value))
}

const toggleVerticalZhuyin = () => {
  verticalZhuyin.value = !verticalZhuyin.value
  localStorage.setItem(LocalStrageName.verticalZhuyin, String(verticalZhuyin.value))
}

const toggleHideZhuyin = () => {
  hideZhuyin.value = !hideZhuyin.value
  localStorage.setItem(LocalStrageName.hideZhuyin, String(hideZhuyin.value))
}

const shareToSocial = (socialMedia: SocialMedia) => {
  switch (socialMedia) {
    case SocialMedia.twitter:
      window.open(
        `https://twitter.com/compose/tweet?url=https://www.bopomofo-typer.com/&text=${i18n.t(
          'socialMessage',
          { count: score.value }
        )}%0A%0A%20%23${i18n.t('tag')}%0A`
      )
      break
    case SocialMedia.facebook:
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.bopomofo-typer.com%2F&amp;src=sdkpreparse`
      )
      break
    case SocialMedia.mastodon:
      window.open(
        `https://mastodonshare.com/?text=${i18n.t('socialMessage', {
          count: score.value
        })}&url=https%3A%2F%2Fwww.bopomofo-typer.com`
      )
  }
}
</script>

<template>
  <main>
    <section class="main-section">
      <h1>{{ $t('title') }}</h1>
      <div class="main-content">
        <div class="current-lang">{{ $t('translation') }}: {{ $t('currentLang') }}</div>
        <button v-on:click="changeLanguage('en')" class="lang-button">{{ $t('english') }}</button>
        <button v-on:click="changeLanguage('ja')" class="lang-button">{{ $t('japanese') }}</button>
        <div
          id="game-container"
          tabindex="0"
          autofocus
          @keydown.prevent="detectKeydown"
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
          <div class="status-part">
            <div>
              <div>
                <span>Time: {{ timeCount }}</span
                >&nbsp;
                <span v-for="(time, index) in addedTime" v-bind:key="'time' + index"
                  >+{{ time }}&nbsp;</span
                >
              </div>
              <div>Score: {{ score }}</div>
            </div>
            <div>
              <div @click="toggleVolume">
                <font-awesome-icon
                  icon="fa-solid fa-volume-high"
                  v-if="isVolumeOn && Number(volume) >= 50"
                />
                <font-awesome-icon
                  icon="fa-solid fa-volume-low"
                  v-else-if="isVolumeOn && Number(volume) > 0"
                />
                <font-awesome-icon icon="fa-solid fa-volume-xmark" v-else /><br />
              </div>
              <input
                type="range"
                name="volume"
                id=""
                min="0"
                max="100"
                v-model="volume"
                :disabled="!isVolumeOn"
              />
            </div>
          </div>
          <div class="interacrive-part">
            <div
              class="main-window"
              :class="{
                'mainwindow-focused': isFocused
              }"
            >
              <div class="compete-mode" v-if="level === Level.practice">
                <div class="main-container" v-if="gameState === GameState.playing">
                  <div class="practice-container" v-if="currentNotch === Notch.low">
                    <div class="practice-zhuyin">
                      {{ currentPracticeZhuyin.char }}
                    </div>
                    <div class="practice-pronunciation">
                      {{ currentPracticeZhuyin.pronunciation }}
                    </div>
                  </div>

                  <ul
                    class="practice-container sentence-container"
                    v-if="currentNotch === Notch.high"
                  >
                    <li v-for="(chunk, cIndex) in currentSentence.chunks" :key="'chunk' + cIndex">
                      <ul class="chunk-container">
                        <li v-for="(word, wIndex) in chunk.word" :key="'word' + cIndex + wIndex">
                          <ul class="practice-kanji-container">
                            <li>
                              <div :class="{ pressed: word.done }">{{ word.display }}</div>
                              <ul class="practice-zyuin-container">
                                <li
                                  v-for="(zhuyin, zIndex) in word.zhuyin"
                                  :key="'zhuin' + cIndex + wIndex + zIndex"
                                  :class="{ pressed: zhuyin.done }"
                                >
                                  <div v-if="!hideZhuyin || zhuyin.done">
                                    <span v-if="zhuyin.char === Zhuyin.tone1">‾</span>
                                    <span v-else>
                                      {{ zhuyin.char }}
                                    </span>
                                  </div>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div class="main-container" v-else-if="gameState === GameState.stop">
                  <MenuScene
                    :level="
                      // line break for eslint
                      level as Level
                    "
                    :is-focused="isFocused"
                    @setLevel="(e) => setLevel(e)"
                    @toggleGame="(e, gameState) => toggleGame(e, gameState)"
                  />
                </div>
              </div>
              <div class="compete-mode" v-else>
                <div class="toggles-container">
                  <div
                    class="game-button"
                    :class="{ 'button-on': verticalZhuyin }"
                    @click="toggleVerticalZhuyin"
                  >
                    {{ $t('verticalZhuyin') }}
                  </div>
                  <div
                    class="game-button"
                    :class="{ 'button-on': hideZhuyin }"
                    @click="toggleHideZhuyin"
                  >
                    {{ $t('hideZhuyin') }}
                  </div>
                </div>
                <div class="main-container" v-if="gameState === GameState.playing">
                  <div class="time-bar"></div>
                  <div class="translation-and-sentence">
                    <div class="translation">
                      {{
                        currentSentence ? $t(`sentence_${currentNotch}_${currentSentence.id}`) : ''
                      }}
                    </div>
                    <ul v-if="currentSentence" class="sentence-container">
                      <li v-for="(chunk, cIndex) in currentSentence.chunks" :key="'chunk' + cIndex">
                        <ul v-if="isChuck(chunk)" class="chunk-container">
                          <li v-for="(word, wIndex) in chunk.word" :key="'word' + cIndex + wIndex">
                            <ul
                              v-if="isWord(word)"
                              class="kanji-container"
                              :class="{ 'vertical-kanji-container': verticalZhuyin }"
                            >
                              <li
                                v-for="(kanji, kIndex) in word.kanji"
                                :key="'kanji' + cIndex + wIndex + kIndex"
                                :class="{ 'char-container': verticalZhuyin }"
                              >
                                <div :class="{ pressed: kanji.done }">{{ kanji.display }}</div>
                                <ul
                                  class="zyuin-container"
                                  :class="{ 'vertical-zyuin-container': verticalZhuyin }"
                                >
                                  <li
                                    v-for="(zhuyin, zIndex) in kanji.zhuyin"
                                    :key="'zhuin' + cIndex + wIndex + kIndex + zIndex"
                                    :class="{ pressed: zhuyin.done }"
                                  >
                                    <div v-if="!hideZhuyin || zhuyin.done">
                                      <span
                                        v-if="
                                          verticalZhuyin &&
                                          (zhuyin.char === Zhuyin.tone1 ||
                                            zhuyin.char === Zhuyin.exclamation ||
                                            zhuyin.char === Zhuyin.question ||
                                            zhuyin.char === Zhuyin.juhao ||
                                            zhuyin.char === Zhuyin.douhao ||
                                            zhuyin.char === Zhuyin.dunhao)
                                        "
                                      ></span>
                                      <span v-else-if="zhuyin.char === Zhuyin.tone1">‾</span>
                                      <span
                                        v-else
                                        :class="{
                                          'vertical-tones234':
                                            verticalZhuyin && isTone234(zhuyin.char),
                                          'vertical-tones5':
                                            verticalZhuyin && zhuyin.char === Zhuyin.tone5,
                                          'zhuyin-i': zhuyin.char === Zhuyin.i
                                        }"
                                      >
                                        {{ zhuyin.char }}
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                            <ul
                              v-else
                              class="kanji-container"
                              :class="{ 'vertical-kanji-container': verticalZhuyin }"
                            >
                              <li :class="{ 'char-container': verticalZhuyin }">
                                <div :class="{ pressed: word.done }">{{ word.display }}</div>
                                <ul
                                  class="zyuin-container"
                                  :class="{ 'vertical-zyuin-container': verticalZhuyin }"
                                >
                                  <li
                                    v-for="(zhuyin, zIndex) in word.zhuyin"
                                    :key="'zhuin' + cIndex + wIndex + zIndex"
                                    :class="{ pressed: zhuyin.done }"
                                  >
                                    <div v-if="!hideZhuyin || zhuyin.done">
                                      <span
                                        v-if="
                                          verticalZhuyin &&
                                          (zhuyin.char === Zhuyin.tone1 ||
                                            zhuyin.char === Zhuyin.exclamation ||
                                            zhuyin.char === Zhuyin.question ||
                                            zhuyin.char === Zhuyin.juhao ||
                                            zhuyin.char === Zhuyin.douhao ||
                                            zhuyin.char === Zhuyin.dunhao)
                                        "
                                      ></span>
                                      <span v-else-if="zhuyin.char === Zhuyin.tone1">‾</span>
                                      <span
                                        v-else
                                        :class="{
                                          'vertical-tones234':
                                            verticalZhuyin && isTone234(zhuyin.char),
                                          'vertical-tones5':
                                            verticalZhuyin && zhuyin.char === Zhuyin.tone5,
                                          'zhuyin-i': zhuyin.char === Zhuyin.i
                                        }"
                                      >
                                        {{ zhuyin.char }}
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                        <ul v-else class="chunk-container">
                          <ul
                            class="kanji-container"
                            :class="{ 'vertical-kanji-container': verticalZhuyin }"
                          >
                            <li
                              v-for="(kanji, kIndex) in chunk.kanji"
                              :key="'kanji' + cIndex + kIndex"
                              :class="{ 'char-container': verticalZhuyin }"
                            >
                              <div :class="{ pressed: kanji.done }">{{ kanji.display }}</div>
                              <ul
                                class="zyuin-container"
                                :class="{ 'vertical-zyuin-container': verticalZhuyin }"
                              >
                                <li
                                  v-for="(zhuyin, zIndex) in kanji.zhuyin"
                                  :key="'zhuin' + cIndex + kIndex + zIndex"
                                  :class="{ pressed: zhuyin.done }"
                                >
                                  <div v-if="!hideZhuyin || zhuyin.done" class="">
                                    <span
                                      v-if="
                                        verticalZhuyin &&
                                        (zhuyin.char === Zhuyin.tone1 ||
                                          zhuyin.char === Zhuyin.exclamation ||
                                          zhuyin.char === Zhuyin.question ||
                                          zhuyin.char === Zhuyin.juhao ||
                                          zhuyin.char === Zhuyin.douhao ||
                                          zhuyin.char === Zhuyin.dunhao)
                                      "
                                    ></span>
                                    <span v-else-if="zhuyin.char === Zhuyin.tone1">‾</span>
                                    <span
                                      v-else
                                      :class="{
                                        'vertical-tones234':
                                          verticalZhuyin && isTone234(zhuyin.char),
                                        'vertical-tones5':
                                          verticalZhuyin && zhuyin.char === Zhuyin.tone5,
                                        'zhuyin-i': zhuyin.char === Zhuyin.i
                                      }"
                                    >
                                      {{ zhuyin.char }}
                                    </span>
                                  </div>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </ul>
                      </li>
                    </ul>
                    <div v-else-if="gameState === GameState.playing && !currentSentence">
                      No sentence
                    </div>
                  </div>
                </div>
                <div v-else-if="gameState === GameState.loading">Loading...</div>
                <div class="result-container" v-else-if="gameState === GameState.result">
                  <div>Your score: {{ score }}</div>
                  <div v-if="!isRegisterFormOpen" class="result-interface-container">
                    <div class="result-button-container">
                      <div @click.stop="(e) => toggleGame(e, GameState.stop)" class="game-button">
                        {{ $t('backtotitle') }}
                      </div>
                      <div
                        @click.stop="(e) => toggleGame(e, GameState.playing)"
                        class="game-button"
                      >
                        {{ $t('playAgain') }}
                      </div>
                      <div @click.stop="isRegisterFormOpen = true" class="game-button">
                        {{ $t('registerScore') }}
                      </div>
                    </div>
                    <div class="social-button-container">
                      <font-awesome-icon
                        icon="fa-brands fa-x-twitter"
                        class="social-button"
                        @click="() => shareToSocial(SocialMedia.twitter)"
                      />
                      <font-awesome-icon
                        icon="fa-brands fa-facebook"
                        class="social-button"
                        @click="() => shareToSocial(SocialMedia.facebook)"
                      />
                      <font-awesome-icon
                        icon="fa-brands fa-mastodon"
                        class="social-button"
                        @click="() => shareToSocial(SocialMedia.mastodon)"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <div
                      class="register-form"
                      v-if="scoreSendingState === ScoreSendingState.pending"
                    >
                      <label for="username">{{ $t('yourName') }}</label
                      ><br />
                      <input name="username" v-model="username" maxlength="25" /><br />
                      <div class="game-button" @click.stop="registerUserScore">
                        {{ $t('submit') }}
                      </div>
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
                      <div @click.stop="(e) => toggleGame(e, GameState.stop)" class="game-button">
                        {{ $t('backtotitle') }}
                      </div>
                    </div>
                    <div class="register-form" v-else>
                      Sorry, Something went wrong.
                      <div @click.stop="(e) => toggleGame(e, GameState.stop)" class="game-button">
                        {{ $t('backtotitle') }}
                      </div>
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
                  <MenuScene
                    :level="
                      // line break for eslint
                      level as Level
                    "
                    :is-focused="isFocused"
                    @setLevel="(e) => setLevel(e)"
                    @toggleGame="(e, gameState) => toggleGame(e, gameState)"
                  />
                </div>
              </div>
            </div>
            <VisualKeyboard
              :isShift="isShift"
              :game-state="gameState"
              :typing-statistics="typingStatistics"
              @detectKeydown="(key) => detectKeydown(null, key)"
              @detectKeyup="(key) => detectKeyup(null, key)"
              @toggleShift="toggleShift"
            />
          </div>
        </div>
      </div>
      <RankingContainer :rankers="rankers" />
    </section>
    <section class="description-section">
      <h2>{{ $t('zhuyinDescriptionTitle') }}</h2>
      <article>{{ $t('zhuyinDescriptionText') }}</article>
    </section>
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
  --active-color: #c9eddc;
  --key-size: 40px;
  --row-gap: 15px;
  --row-base-margin: -20px;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
}

.main-section {
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  h1 {
    margin: 10px 0;
  }
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

.social-button-container {
  display: flex;
}

.social-button {
  border: solid 2px var(--border-color);
  border-radius: 5px;
  margin: 0 2px;
}

.social-button:hover {
  cursor: pointer;
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

.status-part {
  display: flex;
  justify-content: space-between;
}

.interacrive-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background);
  border-radius: 20px;
}

.main-window {
  border: solid 2px var(--border-color);
  border-radius: 20px;
  width: 100%;
}

.compete-mode {
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

.result-interface-container {
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
  background-color: var(--active-color);
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

.translation-and-sentence {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50px;
}

.sentence-container {
  display: flex;
  justify-content: space-evenly;
  font-size: 1.5em;
  background-color: var(--background);
}

.chunk-container {
  display: flex;
  justify-content: center;
  margin: 0 10px;
}

.kanji-container {
  display: flex;
  text-align: center;
}

.practice-kanji-container {
  display: flex;
  text-align: center;
  font-size: 2em;
}

.practice-zyuin-container {
  font-size: 0.5em;
  display: flex;
  justify-content: center;
}

.char-container {
  display: flex;
  margin: 10px;
}

.vertical-kanji-container {
  margin: 0 5px;
}

.zyuin-container {
  display: flex;
  justify-content: center;
}

.vertical-zyuin-container {
  position: relative;
  width: 1em;
  flex-direction: column;
  justify-content: left;
}

.toggles-container {
  display: flex;
  position: absolute;
  top: 10px;
  left: 10px;
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
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.game-button:hover {
  background-color: var(--button-color-selected);
  cursor: pointer;
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

.compete-mode {
  position: relative;
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

.button-on {
  background-color: var(--active-color);
}

.vertical-tones234 {
  position: relative;
  left: 0.7em;
  top: -1.5em;
}

.vertical-tones5 {
  position: absolute;
  top: -0.2em;
  left: 0.25em;
}

.description-section {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  width: 50%;
}

.zhuyin-i {
  display: inline-block;
  transform: rotate(90deg);
}

.practice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.practice-zhuyin {
  font-size: 2em;
}

@media screen and (min-width: 1040px) {
  .main-section {
    display: grid;
    grid-template-rows: 50px 1fr;
    grid-template-columns: 1fr 1040px 1fr 1fr 1fr;
    gap: 5px;
  }
  h1 {
    grid-column-start: 2;
    text-align: center;
  }
  .main-content {
    grid-row-start: 2;
    grid-column-start: 2;
    justify-self: center;
  }
  .interacrive-part {
    width: 1040px;
  }
  .compete-mode {
    height: 360px;
  }
  .result-container {
    div {
      margin: 5px 0;
    }
  }
}

@media screen and (min-width: 960px) and (max-width: 1039px) {
  .main-section {
    flex-direction: column;
    align-items: center;
  }
  .interacrive-part {
    width: 960px;
  }
  .compete-mode {
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
  .main-section {
    flex-direction: column;
    align-items: center;
  }
  .interacrive-part {
    width: 600px;
  }
  .toggles-container {
    width: 580px;
    justify-content: space-between;
  }
  .compete-mode {
    height: 150px;
    padding: 10px 0;
  }
  .time-bar {
    height: 15px;
    top: 0px;
  }
  .translation-and-sentence {
    top: 15px;
  }
  .translation {
    margin-top: 10px;
    font-size: 0.8em;
  }
  .sentence-container {
    font-size: 0.9em;
  }
  .chunk-container {
    margin: 0 5px;
  }
  .kanji-container {
    margin: 0 2px;
  }
  .result-container {
    div {
      margin: 5px 0;
    }
  }
  .result-button-container {
    flex-direction: row;
  }
}
</style>
