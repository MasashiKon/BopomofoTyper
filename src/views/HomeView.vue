<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { Kanji, Character } from '@/type/types'
import { Zhuyin, AvailableLang } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'

const isPressed = ref(false)
const isStart = ref(false)
const lang = ref(AvailableLang.en)
const timeCount = ref(0)
const character: Kanji = reactive({
  kanji: { char: '早', pressed: false },
  zhuyin: [
    { char: Zhuyin.z, pressed: false },
    { char: Zhuyin.ao, pressed: false },
    { char: Zhuyin.tone3, pressed: false }
  ]
})

const currentAnswer = computed(() => {
  return character.zhuyin.find((zhuyin: Character) => !zhuyin.pressed)
})
let interval: number | null
const detectA = () => {
  isPressed.value = !isPressed.value
}
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
  if (!currentAnswer.value) return
  if (e.key === getCorrespondingKeys(currentAnswer.value.char, lang.value)) {
    currentAnswer.value.pressed = true
    if (!currentAnswer.value) {
      character.kanji.pressed = true
    }
  }
}
</script>

<template>
  <main>
    <div tabindex="0" @keydown="detectKeydown" :class="{ pressed: isPressed }">
      <span>a</span><span>{{ timeCount }}</span>
      <div>
        <span :class="{ pressed: character.kanji.pressed }">{{ character.kanji.char }}</span>
        <ul>
          <li
            v-for="zhuyin in character.zhuyin"
            :key="zhuyin.char"
            :class="{ pressed: zhuyin.pressed }"
          >
            {{ zhuyin.char }}
          </li>
        </ul>
      </div>
      Ooooo{{ currentAnswer?.char }}
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
