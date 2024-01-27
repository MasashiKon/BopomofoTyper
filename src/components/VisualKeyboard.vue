<script setup lang="ts">
import { watch, reactive } from 'vue'
import type { TypingStatistics } from '@/type/types'
import { Zhuyin, GameState } from '@/type/enums'
import { convertZhuyin } from '@/utils/convertZhuyin'

type KeyRatio = {
  key: string
  ratio: number
}

const prop = defineProps<{
  isShift: boolean
  gameState: GameState
  typingStatistics: TypingStatistics
}>()

const worstKeysMistaken: {
  first: KeyRatio | undefined
  second: KeyRatio | undefined
  third: KeyRatio | undefined
} = reactive({ first: undefined, second: undefined, third: undefined })

watch(
  () => prop.gameState,
  (newValue) => {
    if (newValue === GameState.result) {
      const typingStatistics = prop.typingStatistics
      for (const [keyAlpha, value] of Object.entries(typingStatistics)) {
        if (!value.total || !value.success) continue
        const key = convertZhuyin(keyAlpha)
        const ratio = value.success / value.total
        if (ratio > 0.7) continue
        if (worstKeysMistaken.first && ratio < worstKeysMistaken.first.ratio) {
          worstKeysMistaken.third = worstKeysMistaken.second
          worstKeysMistaken.second = worstKeysMistaken.first
          worstKeysMistaken.first = { key, ratio }
        } else if (worstKeysMistaken.second && ratio < worstKeysMistaken.second.ratio) {
          worstKeysMistaken.third = worstKeysMistaken.second
          worstKeysMistaken.second = { key, ratio }
        } else if (worstKeysMistaken.third && ratio < worstKeysMistaken.third.ratio) {
          worstKeysMistaken.third = { key, ratio }
        } else if (!worstKeysMistaken.first) {
          worstKeysMistaken.first = { key, ratio }
        } else if (!worstKeysMistaken.second) {
          worstKeysMistaken.second = { key, ratio }
        } else if (!worstKeysMistaken.third) {
          worstKeysMistaken.third = { key, ratio }
        }
      }
    } else {
      worstKeysMistaken.first = undefined
      worstKeysMistaken.second = undefined
      worstKeysMistaken.third = undefined
    }
  }
)

const detectWorstKeys = (zhuyin: Zhuyin) => {
  if (prop.gameState !== GameState.result) return
  if (worstKeysMistaken.first?.key === zhuyin) {
    return 'worst-first'
  } else if (worstKeysMistaken.second?.key === zhuyin) {
    return 'worst-second'
  } else if (worstKeysMistaken.third?.key === zhuyin) {
    return 'worst-third'
  }
}
</script>

<template>
  <div class="keyboard-container">
    <div class="keyboard">
      <div class="keyboard-row">
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.b)"
          @mousedown.stop="!isShift ? $emit('detectKeydown', '1') : $emit('detectKeydown', '!')"
          @mouseup="!isShift ? $emit('detectKeyup', '1') : $emit('detectKeyup', '!')"
        >
          <div>1</div>
          <div v-if="!isShift">ㄅ</div>
          <div v-else>！</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.d)"
          @mousedown.stop="$emit('detectKeydown', '2')"
          @mouseup="$emit('detectKeyup', '2')"
        >
          <div>2</div>
          <div v-if="!isShift">ㄉ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.tone3)"
          @mousedown.stop="$emit('detectKeydown', '3')"
          @mouseup="$emit('detectKeyup', '3')"
        >
          <div>3</div>
          <div v-if="!isShift">ˇ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.tone4)"
          @mousedown.stop="$emit('detectKeydown', '4')"
          @mouseup="$emit('detectKeyup', '4')"
        >
          <div>4</div>
          <div v-if="!isShift">ˋ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.zh)"
          @mousedown.stop="$emit('detectKeydown', '5')"
          @mouseup="$emit('detectKeyup', '5')"
        >
          <div>5</div>
          <div v-if="!isShift">ㄓ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.tone2)"
          @mousedown.stop="$emit('detectKeydown', '6')"
          @mouseup="$emit('detectKeyup', '6')"
        >
          <div>6</div>
          <div v-if="!isShift">ˊ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.tone5)"
          @mousedown.stop="$emit('detectKeydown', '7')"
          @mouseup="$emit('detectKeyup', '7')"
        >
          <div>7</div>
          <div v-if="!isShift">˙</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.a)"
          @mousedown.stop="$emit('detectKeydown', '8')"
          @mouseup="$emit('detectKeyup', '8')"
        >
          <div>8</div>
          <div v-if="!isShift">ㄚ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.ai)"
          @mousedown.stop="$emit('detectKeydown', '9')"
          @mouseup="$emit('detectKeyup', '9')"
        >
          <div>9</div>
          <div v-if="!isShift">ㄞ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.an)"
          @mousedown.stop="$emit('detectKeydown', '0')"
          @mouseup="$emit('detectKeyup', '0')"
        >
          <div>0</div>
          <div v-if="!isShift">ㄢ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.er)"
          @mousedown.stop="$emit('detectKeydown', '-')"
          @mouseup="$emit('detectKeyup', '-')"
        >
          <div>-</div>
          <div v-if="!isShift">ㄦ</div>
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.p)"
          @mousedown.stop="$emit('detectKeydown', 'q')"
          @mouseup="$emit('detectKeyup', 'q')"
        >
          <div>Q</div>
          <div v-if="!isShift">ㄆ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.t)"
          @mousedown.stop="$emit('detectKeydown', 'w')"
          @mouseup="$emit('detectKeyup', 'w')"
        >
          <div>W</div>
          <div v-if="!isShift">ㄊ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.g)"
          @mousedown.stop="$emit('detectKeydown', 'e')"
          @mouseup="$emit('detectKeyup', 'e')"
        >
          <div>E</div>
          <div v-if="!isShift">ㄍ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.j)"
          @mousedown.stop="$emit('detectKeydown', 'r')"
          @mouseup="$emit('detectKeyup', 'r')"
        >
          <div>R</div>
          <div v-if="!isShift">ㄐ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.ch)"
          @mousedown.stop="$emit('detectKeydown', 't')"
          @mouseup="$emit('detectKeyup', 't')"
        >
          <div>T</div>
          <div v-if="!isShift">ㄔ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.z)"
          @mousedown.stop="$emit('detectKeydown', 'y')"
          @mouseup="$emit('detectKeyup', 'y')"
        >
          <div>Y</div>
          <div v-if="!isShift">ㄗ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.i)"
          @mousedown.stop="$emit('detectKeydown', 'u')"
          @mouseup="$emit('detectKeyup', 'u')"
        >
          <div>U</div>
          <div class="zhuyin-i" v-if="!isShift">ㄧ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.o)"
          @mousedown.stop="$emit('detectKeydown', 'i')"
          @mouseup="$emit('detectKeyup', 'i')"
        >
          <div>I</div>
          <div v-if="!isShift">ㄛ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.ei)"
          @mousedown.stop="$emit('detectKeydown', 'o')"
          @mouseup="$emit('detectKeyup', 'o')"
        >
          <div>O</div>
          <div v-if="!isShift">ㄟ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.en)"
          @mousedown.stop="$emit('detectKeydown', 'p')"
          @mouseup="$emit('detectKeyup', 'p')"
        >
          <div>P</div>
          <div v-if="!isShift">ㄣ</div>
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.m)"
          @mousedown.stop="$emit('detectKeydown', 'a')"
          @mouseup="$emit('detectKeyup', 'a')"
        >
          <div>A</div>
          <div v-if="!isShift">ㄇ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.n)"
          @mousedown.stop="$emit('detectKeydown', 's')"
          @mouseup="$emit('detectKeyup', 's')"
        >
          <div>S</div>
          <div v-if="!isShift">ㄋ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.k)"
          @mousedown.stop="$emit('detectKeydown', 'd')"
          @mouseup="$emit('detectKeyup', 'd')"
        >
          <div>D</div>
          <div v-if="!isShift">ㄎ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.q)"
          @mousedown.stop="$emit('detectKeydown', 'f')"
          @mouseup="$emit('detectKeyup', 'f')"
        >
          <div>F</div>
          <div v-if="!isShift">ㄑ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.sh)"
          @mousedown.stop="$emit('detectKeydown', 'g')"
          @mouseup="$emit('detectKeyup', 'g')"
        >
          <div>G</div>
          <div v-if="!isShift">ㄕ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.c)"
          @mousedown.stop="$emit('detectKeydown', 'h')"
          @mouseup="$emit('detectKeyup', 'h')"
        >
          <div>H</div>
          <div v-if="!isShift">ㄘ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.u)"
          @mousedown.stop="$emit('detectKeydown', 'j')"
          @mouseup="$emit('detectKeyup', 'j')"
        >
          <div>J</div>
          <div v-if="!isShift">ㄨ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.e)"
          @mousedown.stop="$emit('detectKeydown', 'k')"
          @mouseup="$emit('detectKeyup', 'k')"
        >
          <div>K</div>
          <div v-if="!isShift">ㄜ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.ao)"
          @mousedown.stop="$emit('detectKeydown', 'l')"
          @mouseup="$emit('detectKeyup', 'l')"
        >
          <div>L</div>
          <div v-if="!isShift">ㄠ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.ang)"
          @mousedown.stop="$emit('detectKeydown', ';')"
          @mouseup="$emit('detectKeyup', ';')"
        >
          <div>;</div>
          <div v-if="!isShift">ㄤ</div>
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.tone1)"
          @mousedown.stop="$emit('detectKeydown', ' ')"
          @mouseup="$emit('detectKeyup', ' ')"
        >
          <div>Space</div>
          <div>‾</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.f)"
          @mousedown.stop="$emit('detectKeydown', 'z')"
          @mouseup="$emit('detectKeyup', 'z')"
        >
          <div>Z</div>
          <div v-if="!isShift">ㄈ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.l)"
          @mousedown.stop="$emit('detectKeydown', 'x')"
          @mouseup="$emit('detectKeyup', 'x')"
        >
          <div>X</div>
          <div v-if="!isShift">ㄌ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.h)"
          @mousedown.stop="$emit('detectKeydown', 'c')"
          @mouseup="$emit('detectKeyup', 'c')"
        >
          <div>C</div>
          <div v-if="!isShift">ㄏ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.x)"
          @mousedown.stop="$emit('detectKeydown', 'v')"
          @mouseup="$emit('detectKeyup', 'v')"
        >
          <div>V</div>
          <div v-if="!isShift">ㄒ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.r)"
          @mousedown.stop="$emit('detectKeydown', 'b')"
          @mouseup="$emit('detectKeyup', 'b')"
        >
          <div>B</div>
          <div v-if="!isShift">ㄖ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.s)"
          @mousedown.stop="$emit('detectKeydown', 'n')"
          @mouseup="$emit('detectKeyup', 'n')"
        >
          <div>N</div>
          <div v-if="!isShift">ㄙ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.u2)"
          @mousedown.stop="$emit('detectKeydown', 'm')"
          @mouseup="$emit('detectKeyup', 'm')"
        >
          <div>M</div>
          <div v-if="!isShift">ㄩ</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.e2)"
          @mousedown.stop="!isShift ? $emit('detectKeydown', ',') : $emit('detectKeydown', '<')"
          @mouseup="!isShift ? $emit('detectKeyup', ',') : $emit('detectKeyup', '<')"
        >
          <div>,</div>
          <div v-if="!isShift">ㄝ</div>
          <div v-else>，、</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.ou)"
          @mousedown.stop="!isShift ? $emit('detectKeydown', '.') : $emit('detectKeydown', '>')"
          @mouseup="!isShift ? $emit('detectKeyup', '.') : $emit('detectKeyup', '>')"
        >
          <div>.</div>
          <div v-if="!isShift">ㄡ</div>
          <div v-else>。</div>
        </div>
        <div
          class="keyboard-key"
          :class="detectWorstKeys(Zhuyin.eng)"
          @mousedown.stop="!isShift ? $emit('detectKeydown', '/') : $emit('detectKeydown', '?')"
          @mouseup="!isShift ? $emit('detectKeyup', '/') : $emit('detectKeyup', '?')"
        >
          <div>/</div>
          <div v-if="!isShift">ㄥ</div>
          <div v-else>？</div>
        </div>
        <div class="keyboard-key" id="shift-key" @click.stop="$emit('toggleShift')">
          <div>Shift</div>
          <div v-if="!isShift">On</div>
          <div v-else>Off</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.keyboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 640px;
  height: 200px;
}

.keyboard-row {
  display: flex;
  padding: 2px 0;
}

.keyboard-key {
  width: var(--key-size);
  height: var(--key-size);
  background-color: #f0f7f4;
  border: 2px solid #3c493f;
  border-radius: 5px;
  text-align: center;
  margin: 0 2px;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

.key-pressed {
  background-color: #c9eddc;
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
  margin-left: calc(var(--row-base-margin) + (var(--row-gap)));
}

.worst-first {
  background-color: #ff3c00;
}

.worst-second {
  background-color: #ffa200;
}

.worst-third {
  background-color: #ffe100;
}
</style>
