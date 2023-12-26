import type { Sentence } from '../../src/type/types'

import { teacher, you, understand, questionParticle, questionSymbol } from '../words/wordsDB'
import { morning } from '../chunks/chunks'

export const sentence1: Sentence = {
  chunks: [morning, teacher],
  done: false
}

export const sentence2: Sentence = {
  chunks: [you, understand, questionParticle, questionSymbol],
  done: false
}
