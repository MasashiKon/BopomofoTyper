import type { Zhuyin, PartOfSpeech, MeanOfChunk } from './enums'

export type Character = {
  char: string
}

export type ZhuyinChar = Omit<Character, 'char'> & {
  char: Zhuyin
  done: boolean
}

export type Kanji = {
  display: String
  zhuyin: ZhuyinChar[]
  done: boolean
}

export type Word = {
  display: string
  kanji: Kanji[]
  partOfSpeech: PartOfSpeech
  done: boolean
}

export type Chunk = {
  display: string
  word: (Word | Kanji)[]
  meanOfChunk: MeanOfChunk
  done: boolean
}

export type Sentence = {
  // sentense: string
  id?: Number
  chunks: (Chunk | Word)[]
  done: boolean
}
