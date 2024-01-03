import { Level } from '@/type/enums'

export default (level: Level, innerLevel: number): string => {
  return `{
        sentences_${level}_${innerLevel}Collection {
          edges {
            node {
              id
              display
              chunks
              done
              translation_en
              translation_ja
              ${level}_${innerLevel}_wordsCollection {
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
              ${level}_${innerLevel}_chunksCollection {
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
              ${level}_${innerLevel}_wordsCollection {
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
}
