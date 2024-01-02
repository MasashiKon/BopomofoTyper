import { Level } from '@/type/enums'

const easy_1 = `{
  sentences_easy_1Collection {
    edges {
      node {
        id
        display
        chunks
        done
        translation_en
        translation_ja
        easy_1_wordsCollection {
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

export default (level: Level): string => {    
  switch (level) {
    case Level.easy:
      return `{
        sentences_easy_2Collection {
          edges {
            node {
              id
              display
              chunks
              done
              translation_en
              translation_ja
              easy_2_wordsCollection {
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
              easy_2_chunksCollection {
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
              easy_2_wordsCollection {
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
    case Level.hard:
      return `{
        sentencesCollection(filter: {or: [{id: {eq: 1}}, {id: {eq: 2}}]}) {
          edges {
            node {
              id
              display
              chunks
              done
              translation_en
              translation_ja
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
    default:
      return ''
  }
}
