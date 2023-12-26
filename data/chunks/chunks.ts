import type { Chunk } from '../../src/type/types'
import { MeanOfChunk } from '../../src/type/enums'

import { zao3, an1 } from '../kanji/kanjiBD'

export const morning: Chunk = {
  display: '早安',
  word: [zao3, an1],
  meanOfChunk: MeanOfChunk.greeting,
  done: false
}
