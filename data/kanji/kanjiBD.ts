import type { Kanji } from '../../src/type/types'
import { Zhuyin } from '../../src/type/enums'

export const zao3: Kanji = {
  display: '早',
  zhuyin: [
    { char: Zhuyin.z, done: false },
    { char: Zhuyin.ao, done: false },
    { char: Zhuyin.tone3, done: false }
  ],
  done: false
}

export const an1: Kanji = {
  display: '安',
  zhuyin: [{ char: Zhuyin.an, done: false }],
  done: false
}

export const xian1: Kanji = {
  display: '先',
  zhuyin: [
    { char: Zhuyin.x, done: false },
    { char: Zhuyin.i, done: false },
    { char: Zhuyin.an, done: false }
  ],
  done: false
}

export const sheng1: Kanji = {
  display: '生',
  zhuyin: [
    { char: Zhuyin.sh, done: false },
    { char: Zhuyin.eng, done: false }
  ],
  done: false
}

export const ni3: Kanji = {
  display: '你',
  zhuyin: [
    { char: Zhuyin.n, done: false },
    { char: Zhuyin.i, done: false },
    { char: Zhuyin.tone3, done: false }
  ],
  done: false
}

export const dong1: Kanji = {
  display: '懂',
  zhuyin: [
    { char: Zhuyin.d, done: false },
    { char: Zhuyin.u, done: false },
    { char: Zhuyin.eng, done: false }
  ],
  done: false
}

export const ma5: Kanji = {
  display: '嗎',
  zhuyin: [
    { char: Zhuyin.m, done: false },
    { char: Zhuyin.a, done: false },
    { char: Zhuyin.tone5, done: false }
  ],
  done: false
}

export const questionMark: Kanji = {
  display: '？',
  zhuyin: [{ char: Zhuyin.question, done: false }],
  done: false
}

export const exclamationMark: Kanji = {
    display: '！',
    zhuyin: [{ char: Zhuyin.exclamation, done: false }],
    done: false
  }
