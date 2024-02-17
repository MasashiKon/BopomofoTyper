import { Zhuyin } from '../types/enums'

export const convertZhuyin = (keyword: string): Zhuyin => {
  switch (keyword) {
    case 'b':
      return Zhuyin.b
    case 'p':
      return Zhuyin.p
    case 'm':
      return Zhuyin.m
    case 'f':
      return Zhuyin.f
    case 'd':
      return Zhuyin.d
    case 't':
      return Zhuyin.t
    case 'n':
      return Zhuyin.n
    case 'l':
      return Zhuyin.l
    case 'g':
      return Zhuyin.g
    case 'k':
      return Zhuyin.k
    case 'h':
      return Zhuyin.h
    case 'j':
      return Zhuyin.j
    case 'q':
      return Zhuyin.q
    case 'x':
      return Zhuyin.x
    case 'zh':
      return Zhuyin.zh
    case 'ch':
      return Zhuyin.ch
    case 'sh':
      return Zhuyin.sh
    case 'r':
      return Zhuyin.r
    case 'z':
      return Zhuyin.z
    case 'c':
      return Zhuyin.c
    case 's':
      return Zhuyin.s
    case 'a':
      return Zhuyin.a
    case 'o':
      return Zhuyin.o
    case 'e':
      return Zhuyin.e
    case 'e2':
      return Zhuyin.e2
    case 'ê':
      return Zhuyin.e2
    case 'ai':
      return Zhuyin.ai
    case 'ei':
      return Zhuyin.ei
    case 'ao':
      return Zhuyin.ao
    case 'ou':
      return Zhuyin.ou
    case 'an':
      return Zhuyin.an
    case 'en':
      return Zhuyin.en
    case 'ang':
      return Zhuyin.ang
    case 'eng':
      return Zhuyin.eng
    case 'er':
      return Zhuyin.er
    case 'i':
      return Zhuyin.i
    case 'u':
      return Zhuyin.u
    case 'u2':
      return Zhuyin.u2
    case 'ü':
      return Zhuyin.u2
    case 'tone1':
      return Zhuyin.tone1
    case 'tone2':
      return Zhuyin.tone2
    case 'tone3':
      return Zhuyin.tone3
    case 'tone4':
      return Zhuyin.tone4
    case 'tone5':
      return Zhuyin.tone5
    case 'exclamation':
      return Zhuyin.exclamation
    case 'question':
      return Zhuyin.question
    case 'juhao':
      return Zhuyin.juhao
    case 'douhao':
      return Zhuyin.douhao
    case 'dunhao':
      return Zhuyin.dunhao
    default:
      return Zhuyin.error
  }
}

export const reverseZhuyin = (keyword: Zhuyin | string): string | null => {
  switch (keyword) {
    case Zhuyin.b:
      return 'b'
    case Zhuyin.p:
      return 'p'
    case Zhuyin.m:
      return 'm'
    case Zhuyin.f:
      return 'f'
    case Zhuyin.d:
      return 'd'
    case Zhuyin.t:
      return 't'
    case Zhuyin.n:
      return 'n'
    case Zhuyin.l:
      return 'l'
    case Zhuyin.g:
      return 'g'
    case Zhuyin.k:
      return 'k'
    case Zhuyin.h:
      return 'h'
    case Zhuyin.j:
      return 'j'
    case Zhuyin.q:
      return 'q'
    case Zhuyin.x:
      return 'x'
    case Zhuyin.zh:
      return 'zh'
    case Zhuyin.ch:
      return 'ch'
    case Zhuyin.sh:
      return 'sh'
    case Zhuyin.r:
      return 'r'
    case Zhuyin.z:
      return 'z'
    case Zhuyin.c:
      return 'c'
    case Zhuyin.s:
      return 's'
    case Zhuyin.a:
      return 'a'
    case Zhuyin.o:
      return 'o'
    case Zhuyin.e:
      return 'e'
    case Zhuyin.e2:
      return 'e2'
    case Zhuyin.ai:
      return 'ai'
    case Zhuyin.ei:
      return 'ei'
    case Zhuyin.ao:
      return 'ao'
    case Zhuyin.ou:
      return 'ou'
    case Zhuyin.an:
      return 'an'
    case Zhuyin.en:
      return 'en'
    case Zhuyin.ang:
      return 'ang'
    case Zhuyin.eng:
      return 'eng'
    case Zhuyin.er:
      return 'er'
    case Zhuyin.i:
      return 'i'
    case Zhuyin.u:
      return 'u'
    case Zhuyin.u2:
      return 'u2'
    case Zhuyin.tone1:
      return 'tone1'
    case Zhuyin.tone2:
      return 'tone2'
    case Zhuyin.tone3:
      return 'tone3'
    case Zhuyin.tone4:
      return 'tone4'
    case Zhuyin.tone5:
      return 'tone5'
    default:
      return null
  }
}