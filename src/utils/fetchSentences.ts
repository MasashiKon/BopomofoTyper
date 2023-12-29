import axios from 'axios'
import i18next from 'i18next'
import convertZhuyin from './convertZhuyin'
import type { Sentence, Chunk, Word, Kanji, ZhuyinChar } from '@/type/types'

export default async (sentences: Sentence[]) => {
  const res = await axios.post(
    import.meta.env.VITE_DB_URL,
    {
      query: `{
sentencesCollection(filter: {or: [{id: {eq: 1}}, {id: {eq: 2}}]}) {
  edges {
    node {
      id
      display
      chunks
      done
      sentences_chunksCollection {
        edges {
          node {
            chunks {
              display
              words
              meanOfChunk
              chunks_wordsCollection {
                edges {
                  node {
                    words {
                      display
                      kanji
                      partOfSpeech
                      words_kanjiCollection {
                        edges {
                          node {
                            kanji {
                              display
                              zhuyin
                              done
                              kanji_zhuyinCollection {
                                edges {
                                  node {
                                    zhuyin_zhuyin
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              chunks_kanjiCollection {
                edges {
                  node {
                    kanji {
                      display
                      zhuyin
                      done
                      kanji_zhuyinCollection {
                        edges {
                          node {
                            zhuyin_zhuyin
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      sentences_wordsCollection {
        edges {
          node {
            words {
              display
              kanji
              partOfSpeech
              words_kanjiCollection {
                edges {
                  node {
                    kanji {
                      display
                      zhuyin
                      done
                      kanji_zhuyinCollection {
                        edges {
                          node {
                            zhuyin_zhuyin
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
}`
    },
    {
      headers: {
        apikey: import.meta.env.VITE_DB_APIKEY
      }
    }
  )

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
  }

  i18next.addResourceBundle('en', 'translation', {
    [`sentence_${1}`]: 'Good morning, teacher.',
    sentence_2: 'Do you understand?'
  })

  i18next.addResourceBundle('ja', 'translation', {
    sentence_1: 'おはようございます、先生。',
    sentence_2: '理解しましたか？'
  })
}
