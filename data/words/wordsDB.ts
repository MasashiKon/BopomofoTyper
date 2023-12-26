import type { Word } from '../../src/type/types'
import { PartOfSpeech } from '../../src/type/enums'

import { xian1, sheng1, ni3, dong1, ma5, questionMark } from '../kanji/kanjiBD'

export const teacher: Word = {
  display: '先生',
  kanji: [xian1, sheng1],
  partOfSpeech: PartOfSpeech.noun,
  done: false
}

export const you: Word = {
  display: '你',
  kanji: [ni3],
  partOfSpeech: PartOfSpeech.noun,
  done: false
}

export const understand: Word = {
  display: '懂',
  kanji: [dong1],
  partOfSpeech: PartOfSpeech.verb,
  done: false
}

export const questionParticle: Word = {
  display: '嗎',
  kanji: [ma5],
  partOfSpeech: PartOfSpeech.particle,
  done: false
}

export const questionSymbol: Word = {
  display: '?',
  kanji: [questionMark],
  partOfSpeech: PartOfSpeech.symbol,
  done: false
}
