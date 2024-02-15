import axios, { type AxiosResponse } from 'axios'
import i18next from 'i18next'
import { convertZhuyin } from './convertZhuyin'
import generateQuery from './generateQuery'
import type { Sentence, Chunk, Word, Kanji, ZhuyinChar, SentenceContainer } from '../types/types'
import { Level } from '../types/enums'

const generateSentences = (
  res: AxiosResponse,
  sentences: Sentence[],
  innerLevel: number,
  level: Level,
  translationIndex: { index: number }
) => {
  if (!res.data.data) return
  const resSentences: any[] = res.data.data[`sentences_${level}_${innerLevel}Collection`].edges
  const randomizedSentences: any[] = []

  if (level !== Level.practice) {
    while (resSentences.length > 0) {
      const index = Math.floor(Math.random() * resSentences.length)
      const pickedSentence = resSentences.splice(index, 1)
      randomizedSentences.push(...pickedSentence)
    }
  } else {
    while (resSentences.length > 0) {
      randomizedSentences.push(resSentences.shift())
    }
  }

  for (const sentenceNode of randomizedSentences) {
    const sentence = sentenceNode.node
    const sentenceContainer: Sentence = {
      id: Number(sentence.id),
      sentense: sentence.display,
      chunks: [],
      done: false
    }

    for (const chunkLiteral of sentence.chunks) {
      chunkSearch: for (const chunkNode of sentence[`${level}_${innerLevel}_chunksCollection`]
        .edges) {
        const chunk = chunkNode.node.chunks
        if (chunk.display === chunkLiteral) {
          const chunkContainer: Chunk = {
            display: chunk.display,
            word: [],
            meanOfChunk: chunk.meanOfChunk
          }

          for (const chunkWordLiteral of chunk.words) {
            wordSearch: for (const kanjiNode of chunk.chunks_kanjiCollection.edges) {
              const kanji = kanjiNode.node.kanji
              if (kanji.display === chunkWordLiteral) {
                const kanjiContainer: Kanji = {
                  display: kanji.display,
                  done: false,
                  zhuyin: []
                }

                for (const zhuyinLiteral of kanji.zhuyin) {
                  for (const zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
                    const zhuyin = zhuyinNode.node.zhuyin_zhuyin
                    if (zhuyin === zhuyinLiteral) {
                      const zhuyinContainer: ZhuyinChar = {
                        char: convertZhuyin(zhuyin),
                        done: false
                      }
                      kanjiContainer.zhuyin.push(zhuyinContainer)
                      break
                    }
                  }
                }

                if (kanji.zhuyin2) {
                  kanjiContainer.zhuyin2 = []
                  for (const zhuyinLiteral of kanji.zhuyin2) {
                    for (const zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
                      const zhuyin = zhuyinNode.node.zhuyin_zhuyin
                      if (zhuyin === zhuyinLiteral) {
                        const zhuyinContainer: ZhuyinChar = {
                          char: convertZhuyin(zhuyin),
                          done: false
                        }
                        kanjiContainer.zhuyin2.push(zhuyinContainer)
                        break
                      }
                    }
                  }
                }

                chunkContainer.word.push(kanjiContainer)

                break wordSearch
              }
            }
            wordSearch: for (const wordNode of chunk.chunks_wordsCollection.edges) {
              const word = wordNode.node.words
              if (word.display === chunkWordLiteral) {
                const wordContainer: Word = {
                  display: word.display,
                  kanji: [],
                  partOfSpeech: word.partOfSpeech
                }

                for (const kanjiLiteral of word.kanji) {
                  for (const kanjiNode of word.words_kanjiCollection.edges) {
                    const kanji = kanjiNode.node.kanji
                    if (kanji.display === kanjiLiteral) {
                      const kanjiContainer: Kanji = {
                        display: kanji.display,
                        done: false,
                        zhuyin: []
                      }

                      for (const zhuyinLiteral of kanji.zhuyin) {
                        for (const zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
                          const zhuyin = zhuyinNode.node.zhuyin_zhuyin
                          if (zhuyin === zhuyinLiteral) {
                            const zhuyinContainer: ZhuyinChar = {
                              char: convertZhuyin(zhuyin),
                              done: false
                            }
                            kanjiContainer.zhuyin.push(zhuyinContainer)
                            break
                          }
                        }
                      }

                      if (kanji.zhuyin2) {
                        kanjiContainer.zhuyin2 = []
                        for (const zhuyinLiteral of kanji.zhuyin2) {
                          for (const zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
                            const zhuyin = zhuyinNode.node.zhuyin_zhuyin
                            if (zhuyin === zhuyinLiteral) {
                              const zhuyinContainer: ZhuyinChar = {
                                char: convertZhuyin(zhuyin),
                                done: false
                              }
                              kanjiContainer.zhuyin2.push(zhuyinContainer)
                              break
                            }
                          }
                        }
                      }

                      wordContainer.kanji.push(kanjiContainer)

                      break
                    }
                  }
                }

                chunkContainer.word.push(wordContainer)

                break wordSearch
              }
            }
          }

          sentenceContainer.chunks.push(chunkContainer)

          break chunkSearch
        }
      }
      chunkSearch: for (const wordNode of sentence[`${level}_${innerLevel}_wordsCollection`]
        .edges) {
        const word = wordNode.node.words
        if (word.display === chunkLiteral) {
          const wordContainer: Word = {
            display: word.display,
            kanji: [],
            partOfSpeech: word.partOfSpeech
          }

          for (const kanjiLiteral of word.kanji) {
            for (const kanjiNode of word.words_kanjiCollection.edges) {
              const kanji = kanjiNode.node.kanji
              if (kanji.display === kanjiLiteral) {
                const kanjiContainer: Kanji = {
                  display: kanji.display,
                  done: false,
                  zhuyin: []
                }

                for (const zhuyinLiteral of kanji.zhuyin) {
                  for (const zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
                    const zhuyin = zhuyinNode.node.zhuyin_zhuyin
                    if (zhuyin === zhuyinLiteral) {
                      const zhuyinContainer: ZhuyinChar = {
                        char: convertZhuyin(zhuyin),
                        done: false
                      }
                      kanjiContainer.zhuyin.push(zhuyinContainer)
                      break
                    }
                  }
                }

                if (kanji.zhuyin2) {
                  kanjiContainer.zhuyin2 = []
                  for (const zhuyinLiteral of kanji.zhuyin2) {
                    for (const zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
                      const zhuyin = zhuyinNode.node.zhuyin_zhuyin
                      if (zhuyin === zhuyinLiteral) {
                        const zhuyinContainer: ZhuyinChar = {
                          char: convertZhuyin(zhuyin),
                          done: false
                        }
                        kanjiContainer.zhuyin2.push(zhuyinContainer)
                        break
                      }
                    }
                  }
                }

                wordContainer.kanji.push(kanjiContainer)

                break
              }
            }
          }

          sentenceContainer.chunks.push(wordContainer)

          break chunkSearch
        }
      }
    }

    sentences.push(sentenceContainer)

    i18next.addResourceBundle('en', 'translation', {
      [`sentence_${innerLevel}_${sentence.id}`]: sentence.translation_en
    })

    i18next.addResourceBundle('ja', 'translation', {
      [`sentence_${innerLevel}_${sentence.id}`]: sentence.translation_ja
    })

    translationIndex.index++
  }
}

export default async (sentences: SentenceContainer, level: Level) => {
  const translationIndex = { index: 1 }
  if (level !== Level.practice) {
    const res1 = await axios.post(
      process.env.VITE_DB_URL as string,
      {
        query: generateQuery(level, 1)
      },
      {
        headers: {
          apikey: process.env.VITE_DB_APIKEY
        }
      }
    )

    generateSentences(res1, sentences.low, 1, level, translationIndex)

    const res2 = await axios.post(
      process.env.VITE_DB_URL as string,
      {
        query: generateQuery(level, 2)
      },
      {
        headers: {
          apikey: process.env.VITE_DB_APIKEY
        }
      }
    )

    generateSentences(res2, sentences.high, 2, level, translationIndex)
  } else {
    const res = await axios.post(
      process.env.VITE_DB_URL as string,
      {
        query: generateQuery(level, 2)
      },
      {
        headers: {
          apikey: process.env.VITE_DB_APIKEY
        }
      }
    )

    generateSentences(res, sentences.practice[1], 2, level, translationIndex)
  }
}
