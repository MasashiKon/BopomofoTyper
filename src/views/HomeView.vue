<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import type { Kanji, Sentence, ZhuyinChar, Chunk, Word } from '@/type/types'
import { AvailableLang, LocalStrageName } from '@/type/enums'
import getCorrespondingKeys from '@/utils/getCorrespondingKeys'
import { isChuck, isWord } from '@/utils/verifyTypes'
import convertZhuyin from '@/utils/convertZhuyin'
import i18next from 'i18next'

const isPressed = ref(false)
const isStart = ref(false)
const lang = ref(AvailableLang.en)
const timeCount = ref(0)
const currentSentenceId = ref(1)

const sentences: Sentence[] = reactive([])

const currentSentence = computed(() => {
  if (!sentences.length) return null
  return sentences[0]
})

const kanjiArr = computed((): Kanji[] => {
  const kanjiArr: Kanji[] = []
  if (!currentSentence.value) return kanjiArr
  for (let chunk of currentSentence.value.chunks) {
    if (isWord(chunk)) {
      for (let kanji of chunk.kanji) {
        kanjiArr.push(kanji)
      }
    } else {
      for (let wordOrKanji of chunk.word) {
        if (isWord(wordOrKanji)) {
          for (let kanji of wordOrKanji.kanji) {
            kanjiArr.push(kanji)
          }
        } else {
          kanjiArr.push(wordOrKanji)
        }
      }
    }
  }
  return kanjiArr
})

let interval: number | null

const toggleIsStart = async () => {
  if (isStart.value) {
    if (!interval) return
    clearInterval(interval)
    interval = null
  } else {
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

    for (let sentenceNode of res.data.data.sentencesCollection.edges) {
      const sentence = sentenceNode.node
      const sentenceContainer: Sentence = {
        id: Number(sentence.id),
        chunks: [],
        done: false
      }

      for (let chunkLiteral of sentence.chunks) {
        chunkSearch: for (let chunkNode of sentence.sentences_chunksCollection.edges) {
          const chunk = chunkNode.node.chunks
          if (chunk.display === chunkLiteral) {
            const chunkContainer: Chunk = {
              display: chunk.display,
              word: [],
              meanOfChunk: chunk.meanOfChunk
            }

            for (let chunkWordLiteral of chunk.words) {
              wordSearch: for (let kanjiNode of chunk.chunks_kanjiCollection.edges) {
                const kanji = kanjiNode.node.kanji
                if (kanji.display === chunkWordLiteral) {
                  const kanjiContainer: Kanji = {
                    display: kanji.display,
                    done: false,
                    zhuyin: []
                  }

                  for (let zhuyinLiteral of kanji.zhuyin) {
                    for (let zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
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
              wordSearch: for (let wordNode of chunk.chunks_wordsCollection.edges) {
                const word = wordNode.node.word
                if (word.display === chunkWordLiteral) {
                  const wordContainer: Word = {
                    display: word.display,
                    kanji: [],
                    partOfSpeech: word.partOfSpeech
                  }

                  for (let kanjiLiteral of word.kanji) {
                    for (let kanjiNode of word.words_kanjiCollection.edges) {
                      const kanji = kanjiNode.node.kanji
                      if (kanji.display === kanjiLiteral) {
                        const kanjiContainer: Kanji = {
                          display: kanji.display,
                          done: false,
                          zhuyin: []
                        }

                        for (let zhuyinLiteral of kanji.zhuyin) {
                          for (let zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
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
          // for (let wordNode of chunkNode.node.chunks.chunks_wordsCollection.edges) {
          //   console.log(3)

          //   if (wordNode.node.words.display === chunkLiteral) {
          //     console.log(chunkLiteral)
          //     break chunkSearch
          //   }
          // }
        }
        chunkSearch: for (let wordNode of sentence.sentences_wordsCollection.edges) {
          const word = wordNode.node.words
          if (word.display === chunkLiteral) {
            const wordContainer: Word = {
              display: word.display,
              kanji: [],
              partOfSpeech: word.partOfSpeech
            }

            for (let kanjiLiteral of word.kanji) {
              for (let kanjiNode of word.words_kanjiCollection.edges) {
                const kanji = kanjiNode.node.kanji
                if (kanji.display === kanjiLiteral) {
                  const kanjiContainer: Kanji = {
                    display: kanji.display,
                    done: false,
                    zhuyin: []
                  }

                  for (let zhuyinLiteral of kanji.zhuyin) {
                    for (let zhuyinNode of kanji.kanji_zhuyinCollection.edges) {
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

    interval = setInterval(() => {
      timeCount.value = timeCount.value + 1
    }, 1000)
  }
  isStart.value = !isStart.value
}

const detectKeydown = (e: KeyboardEvent) => {
  if (!kanjiArr.value || !kanjiArr.value.length) return
  const answer: ZhuyinChar | undefined = kanjiArr.value[0].zhuyin.find((zhuyin) => !zhuyin.done)
  if (!answer) return
  if (e.key === getCorrespondingKeys(answer.char, lang.value)) {
    answer.done = true
    if (kanjiArr.value[0].zhuyin.every((zhuyin) => zhuyin.done)) {
      kanjiArr.value[0].done = true
      kanjiArr.value.shift()
    }
    if (!kanjiArr.value.length) {
      sentences.shift()
      currentSentenceId.value++
      if (!sentences.length) {
        isStart.value = false
      }
    }
  }
}

const changeLanguage = (lang: string) => {
  i18next.changeLanguage(lang)
  localStorage.setItem(LocalStrageName.userLang, lang)
}
</script>

<template>
  <main>
    <div>Translation: {{ $t('welcome') }}</div>
    <button v-on:click="changeLanguage('en')">English</button>
    <button v-on:click="changeLanguage('ja')">Japanese</button>
    <div tabindex="0" @keydown="detectKeydown" :class="{ pressed: isPressed }">
      <span>Time: {{ timeCount }}</span>
      <div class="main-window">
        <div class="main-container" v-if="isStart">
          <div>{{ sentences.length > 0 ? $t('sentence_' + currentSentenceId) : '' }}</div>
          <ul v-if="currentSentence" class="sentence-container">
            <li v-for="(chunk, cIndex) in currentSentence.chunks" :key="'chunk' + cIndex">
              <ul v-if="isChuck(chunk)" class="chunk-container">
                <li v-for="(word, wIndex) in chunk.word" :key="'word' + cIndex + wIndex">
                  <ul v-if="isWord(word)">
                    <li
                      v-for="(kanji, kIndex) in word.kanji"
                      :key="'kanji' + cIndex + wIndex + kIndex"
                      class="kanji-container"
                    >
                      <div :class="{ pressed: kanji.done }">{{ kanji.display }}</div>
                      <ul class="zyuin-container">
                        <li
                          v-for="(zhuyin, zIndex) in kanji.zhuyin"
                          :key="'zhuin' + cIndex + wIndex + kIndex + zIndex"
                          :class="{ pressed: zhuyin.done }"
                        >
                          {{ zhuyin.char }}
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul v-else class="kanji-container">
                    <div :class="{ pressed: word.done }">{{ word.display }}</div>
                    <ul class="zyuin-container">
                      <li
                        v-for="(zhuyin, zIndex) in word.zhuyin"
                        :key="'zhuin' + cIndex + wIndex + zIndex"
                        :class="{ pressed: zhuyin.done }"
                      >
                        {{ zhuyin.char }}
                      </li>
                    </ul>
                  </ul>
                </li>
              </ul>
              <ul v-else class="chunk-container">
                <li
                  v-for="(kanji, kIndex) in chunk.kanji"
                  :key="'kanji' + cIndex + kIndex"
                  class="kanji-container"
                >
                  <div :class="{ pressed: kanji.done }">{{ kanji.display }}</div>
                  <ul class="zyuin-container">
                    <li
                      v-for="(zhuyin, zIndex) in kanji.zhuyin"
                      :key="'zhuin' + cIndex + kIndex + zIndex"
                      :class="{ pressed: zhuyin.done }"
                    >
                      {{ zhuyin.char }}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <div v-else>Loading</div>
        </div>
        <div class="main-container" v-else>Bopomofo Typer</div>
      </div>
    </div>
    <button @click="toggleIsStart">{{ isStart ? 'Stop' : 'Start' }}</button>
  </main>
</template>

<style>
/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/

main {
  padding: 0;
  margin: 0;
}

.main-window {
  width: 960px;
  height: 540px;
  background-color: aqua;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-container {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

div:focus {
  outline: none;
}

li {
  list-style: none;
}

.sentence-container {
  display: flex;
  justify-content: space-evenly;
  .chunk-container {
    display: flex;
    justify-content: center;
    margin: 0 10px;
    .kanji-container {
      text-align: center;
      margin: 0 5px;
      .zyuin-container {
        display: flex;
        justify-content: center;
      }
    }
  }
}

.pressed {
  color: red;
}
</style>
