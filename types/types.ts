import type { Zhuyin, ZhuyinPronunciation, PartOfSpeech, MeanOfChunk } from './enums'

export type Character = {
  char: string
}

export type ZhuyinChar = Omit<Character, 'char'> & {
  char: Zhuyin
  done: boolean
}

export type PracticeModeZhuyin = {
  char: Zhuyin
  pronunciation: ZhuyinPronunciation
}

export type Kanji = {
  display: String
  zhuyin: ZhuyinChar[]
  zhuyin2?: ZhuyinChar[]
  done: boolean
}

export type Word = {
  display: string
  kanji: Kanji[]
  partOfSpeech: PartOfSpeech
}

export type Chunk = {
  display: string
  word: (Word | Kanji)[]
  meanOfChunk: MeanOfChunk
}

export type Sentence = {
  sentense: string
  id?: Number
  chunks: (Chunk | Word)[]
  done: boolean
}

export type SentenceContainer = {
  practice: any[]
  high: Sentence[]
  low: Sentence[]
}

export type Ranker = {
  name: string
  score: number
  date: Date
}

export type CharStatistics = {
  total: number
  success: number
}

export type TypingStatistics = {
  b: CharStatistics
  p: CharStatistics
  m: CharStatistics
  f: CharStatistics
  d: CharStatistics
  t: CharStatistics
  n: CharStatistics
  l: CharStatistics
  g: CharStatistics
  k: CharStatistics
  h: CharStatistics
  j: CharStatistics
  q: CharStatistics
  x: CharStatistics
  zh: CharStatistics
  ch: CharStatistics
  sh: CharStatistics
  r: CharStatistics
  z: CharStatistics
  c: CharStatistics
  s: CharStatistics
  a: CharStatistics
  o: CharStatistics
  e: CharStatistics
  e2: CharStatistics
  ai: CharStatistics
  ei: CharStatistics
  ao: CharStatistics
  ou: CharStatistics
  an: CharStatistics
  en: CharStatistics
  ang: CharStatistics
  eng: CharStatistics
  er: CharStatistics
  i: CharStatistics
  u: CharStatistics
  u2: CharStatistics
  tone1: CharStatistics
  tone2: CharStatistics
  tone3: CharStatistics
  tone4: CharStatistics
  tone5: CharStatistics
  [key: string]: CharStatistics
}
