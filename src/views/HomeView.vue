<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { Kanji, Chunk, Sentence, ZhuyinChar } from '@/type/types'
import { Zhuyin, MeanOfChunk, AvailableLang } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'

const isPressed = ref(false)
const isStart = ref(false)
const lang = ref(AvailableLang.en)
const timeCount = ref(0)
const zao: Kanji = reactive({
  display: '早',
  zhuyin: [
    { char: Zhuyin.z, done: false },
    { char: Zhuyin.ao, done: false },
    { char: Zhuyin.tone3, done: false }
  ],
  done: false
})

const an: Kanji = reactive({
  display: '安',
  zhuyin: [{ char: Zhuyin.an, done: false }],
  done: false
})

const zaoAn: Chunk = reactive({
  display: '早安',
  word: [zao, an],
  meanOfChunk: MeanOfChunk.greeting,
  done: false
})

let currentSentence: Sentence | null = reactive({
  chunks: [zaoAn],
  done: false
})

const kanjiArr = computed((): Kanji[] => {
  const kanjiArr: Kanji[] = []
  if (!currentSentence) return kanjiArr
  for (let chunk of currentSentence.chunks) {
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
      currentSentence = null
    }
  }
}
</script>

<template>
  <main>
    <div tabindex="0" @keydown="detectKeydown" :class="{ pressed: isPressed }">
      <span>a</span><span>{{ timeCount }}</span>

      <div>
        <ul v-if="currentSentence">
          <li v-for="(chunk, cIndex) in currentSentence.chunks" :key="'chunk' + cIndex">
            <ul v-if="isChuck(chunk)">
              <li v-for="(word, wIndex) in chunk.word" :key="'word' + cIndex + wIndex">
                <ul v-if="isWord(word)">
                  <li
                    v-for="(kanji, kIndex) in word.kanji"
                    :key="'kanji' + cIndex + wIndex + kIndex"
                  >
                    <span :class="{ pressed: kanji.done }">{{ kanji.display }}</span>
                    <ul>
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
                <ul v-else>
                  <span :class="{ pressed: word.done }">{{ word.display }}</span>
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
            <ul v-else>
              <li v-for="(kanji, kIndex) in chunk.kanji" :key="'kanji' + cIndex + kIndex">
                <span :class="{ pressed: kanji.done }">{{ kanji.display }}</span>
                <ul>
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

div {
  /* width: 50vw;
  height: 50vh; */
  background-color: aqua;
  margin: 0px;
  padding: 0px;
  border: black 2px solid;
}

div:focus {
  outline: none;
}

.pressed {
  color: red;
}
</style>
