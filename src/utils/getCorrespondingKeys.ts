import { Zhuyin, AvailableLang } from "@/type/enums"

export default (zhuyin: Zhuyin, lang: AvailableLang) => {
  switch (lang) {
    case AvailableLang.en:
      switch (zhuyin) {
        case Zhuyin.b:
          return '1'
        case Zhuyin.p:
          return 'q'
        case Zhuyin.m:
          return 'a'
        case Zhuyin.f:
          return 'z'
        case Zhuyin.d:
          return '2'
        case Zhuyin.t:
          return 'w'
        case Zhuyin.n:
          return 's'
        case Zhuyin.l:
          return 'x'
        case Zhuyin.tone3:
          return '3'
        case Zhuyin.g:
          return 'e'
        case Zhuyin.k:
          return 'd'
        case Zhuyin.h:
          return 'c'
        case Zhuyin.tone4:
          return '4'
        case Zhuyin.j:
          return 'r'
        case Zhuyin.q:
          return 'f'
        case Zhuyin.x:
          return 'v'
        case Zhuyin.zh:
          return '5'
        case Zhuyin.ch:
          return 't'
        case Zhuyin.sh:
          return 'g'
        case Zhuyin.r:
          return 'b'
        case Zhuyin.tone2:
          return '6'
        case Zhuyin.z:
          return 'y'
        case Zhuyin.c:
          return 'h'
        case Zhuyin.s:
          return 'n'
        case Zhuyin.tone5:
          return '7'
        case Zhuyin.i:
          return 'u'
        case Zhuyin.u:
          return 'j'
        case Zhuyin.u2:
          return 'm'
        case Zhuyin.a:
          return '8'
        case Zhuyin.o:
          return 'i'
        case Zhuyin.e:
          return 'k'
        case Zhuyin.e2:
          return ','
        case Zhuyin.ai:
          return '9'
        case Zhuyin.ei:
          return 'o'
        case Zhuyin.ao:
          return 'l'
        case Zhuyin.ou:
          return '.'
        case Zhuyin.an:
          return '0'
        case Zhuyin.en:
          return 'p'
        case Zhuyin.ang:
          return ';'
        case Zhuyin.eng:
          return '/'
        case Zhuyin.er:
          return '-'
        default:
          return null
      }
    case AvailableLang.jp:
      switch (zhuyin) {
        case Zhuyin.b:
          return '1'
        case Zhuyin.p:
          return 'q'
        case Zhuyin.m:
          return 'a'
        case Zhuyin.f:
          return 'z'
        case Zhuyin.d:
          return '2'
        case Zhuyin.t:
          return 'w'
        case Zhuyin.n:
          return 's'
        case Zhuyin.l:
          return 'x'
        case Zhuyin.tone3:
          return '3'
        case Zhuyin.g:
          return 'e'
        case Zhuyin.k:
          return 'd'
        case Zhuyin.h:
          return 'c'
        case Zhuyin.tone4:
          return '4'
        case Zhuyin.j:
          return 'r'
        case Zhuyin.q:
          return 'f'
        case Zhuyin.x:
          return 'v'
        case Zhuyin.zh:
          return '5'
        case Zhuyin.ch:
          return 't'
        case Zhuyin.sh:
          return 'g'
        case Zhuyin.r:
          return 'b'
        case Zhuyin.tone2:
          return '6'
        case Zhuyin.z:
          return 'y'
        case Zhuyin.c:
          return 'h'
        case Zhuyin.s:
          return 'n'
        case Zhuyin.tone5:
          return '7'
        case Zhuyin.i:
          return 'u'
        case Zhuyin.u:
          return 'j'
        case Zhuyin.u2:
          return 'm'
        case Zhuyin.a:
          return '8'
        case Zhuyin.o:
          return 'i'
        case Zhuyin.e:
          return 'k'
        case Zhuyin.e2:
          return ','
        case Zhuyin.ai:
          return '9'
        case Zhuyin.ei:
          return 'o'
        case Zhuyin.ao:
          return 'l'
        case Zhuyin.ou:
          return '.'
        case Zhuyin.an:
          return '0'
        case Zhuyin.en:
          return 'p'
        case Zhuyin.ang:
          return ';'
        case Zhuyin.eng:
          return '/'
        case Zhuyin.er:
          return '-'
        default:
          return null
      }
    default:
      return null
  }
}
