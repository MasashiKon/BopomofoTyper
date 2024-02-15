import type { Chunk, Word, Kanji } from '../types/types'

export const isChuck = (text: any): text is Chunk => {
    return (text as Chunk).meanOfChunk !== undefined
  }

export const isWord = (text: any): text is Word => {  
  return (text as Word).partOfSpeech !== undefined
}

export const isKanji = (text: any): text is Kanji => {
    return (text as Kanji).zhuyin !== undefined
  }
