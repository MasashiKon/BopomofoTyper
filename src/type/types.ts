import type { Zhuyin } from "./enums"

export type Character = {
  char: string
  pressed: boolean
}

export type ZhuyinChar = Omit<Character, 'char'> & {
  char: Zhuyin
}

export type Kanji = {
  kanji: Character
  zhuyin: ZhuyinChar[]
}
