import axios, { type AxiosResponse } from 'axios'
import i18next from 'i18next'
import convertZhuyin from './convertZhuyin'
import generateQuery from './generateQuery'
import type { Sentence, Chunk, Word, Kanji, ZhuyinChar } from '@/type/types'
import { Level } from '@/type/enums'

const generateSentences = (res: AxiosResponse, sentences: Sentence[]) => {
  for (const [index, sentenceNode] of res.data.data.sentences_easy_1Collection.edges.entries()) {
    const sentence = sentenceNode.node
    const sentenceContainer: Sentence = {
      id: Number(sentence.id),
      chunks: [],
      done: false
    }

    for (const chunkLiteral of sentence.chunks) {
      chunkSearch: for (const chunkNode of sentence.sentences_chunksCollection.edges) {
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

                chunkContainer.word.push(kanjiContainer)

                break wordSearch
              }
            }
            wordSearch: for (const wordNode of chunk.chunks_wordsCollection.edges) {
              const word = wordNode.node.word
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
      chunkSearch: for (const wordNode of sentence.easy_1_wordsCollection.edges) {
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
      [`sentence_${index + 1}`]: sentence.translation_en
    })

    i18next.addResourceBundle('ja', 'translation', {
      [`sentence_${index + 1}`]: sentence.translation_ja
    })
  }
}

export default async (sentences: Sentence[], level: Level) => {
  const res = await axios.post(
    import.meta.env.VITE_DB_URL,
    {
      query: generateQuery(level)
    },
    {
      headers: {
        apikey: import.meta.env.VITE_DB_APIKEY
      }
    }
  )

  if (level === Level.easy) {
    for (const [index, sentenceNode] of res.data.data.sentences_easy_2Collection.edges.entries()) {
      const sentence = sentenceNode.node
      const sentenceContainer: Sentence = {
        id: Number(sentence.id),
        chunks: [],
        done: false
      }

      for (const chunkLiteral of sentence.chunks) {
        chunkSearch: for (const chunkNode of sentence.easy_2_chunksCollection.edges) {
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
        chunkSearch: for (const wordNode of sentence.easy_2_wordsCollection.edges) {
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
        [`sentence_${index + 1}`]: sentence.translation_en
      })

      i18next.addResourceBundle('ja', 'translation', {
        [`sentence_${index + 1}`]: sentence.translation_ja
      })
    }
  } else if (level === Level.hard) {
    for (const [index, sentenceNode] of res.data.data.sentencesCollection.edges.entries()) {
      const sentence = sentenceNode.node
      const sentenceContainer: Sentence = {
        id: Number(sentence.id),
        chunks: [],
        done: false
      }

      for (const chunkLiteral of sentence.chunks) {
        chunkSearch: for (const chunkNode of sentence.sentences_chunksCollection.edges) {
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

                  chunkContainer.word.push(kanjiContainer)

                  break wordSearch
                }
              }
              wordSearch: for (const wordNode of chunk.chunks_wordsCollection.edges) {
                const word = wordNode.node.word
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
        chunkSearch: for (const wordNode of sentence.sentences_wordsCollection.edges) {
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
        [`sentence_${index + 1}`]: sentence.translation_en
      })

      i18next.addResourceBundle('ja', 'translation', {
        [`sentence_${index + 1}`]: sentence.translation_ja
      })
    }
  }
}
