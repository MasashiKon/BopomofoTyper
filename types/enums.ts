export enum Zhuyin {
  b = 'ㄅ',
  p = 'ㄆ',
  m = 'ㄇ',
  f = 'ㄈ',
  d = 'ㄉ',
  t = 'ㄊ',
  n = 'ㄋ',
  l = 'ㄌ',
  g = 'ㄍ',
  k = 'ㄎ',
  h = 'ㄏ',
  j = 'ㄐ',
  q = 'ㄑ',
  x = 'ㄒ',
  zh = 'ㄓ',
  ch = 'ㄔ',
  sh = 'ㄕ',
  r = 'ㄖ',
  z = 'ㄗ',
  c = 'ㄘ',
  s = 'ㄙ',
  a = 'ㄚ',
  o = 'ㄛ',
  e = 'ㄜ',
  e2 = 'ㄝ',
  ai = 'ㄞ',
  ei = 'ㄟ',
  ao = 'ㄠ',
  ou = 'ㄡ',
  an = 'ㄢ',
  en = 'ㄣ',
  ang = 'ㄤ',
  eng = 'ㄥ',
  er = 'ㄦ',
  i = 'ㄧ',
  u = 'ㄨ',
  u2 = 'ㄩ',
  tone1 = '‾',
  tone2 = 'ˊ',
  tone3 = 'ˇ',
  tone4 = 'ˋ',
  tone5 = '˙',
  exclamation = '!',
  question = '?',
  juhao = '，',
  douhao = '。',
  dunhao = '、',
  error = 'error'
}

export enum ZhuyinPronunciation {
  b = 'b',
  p = 'p',
  m = 'm',
  f = 'f',
  d = 'd',
  t = 't',
  n = 'n',
  l = 'l',
  g = 'g',
  k = 'k',
  h = 'h',
  j = 'j',
  q = 'q',
  x = 'x',
  zh = 'zh',
  ch = 'ch',
  sh = 'sh',
  r = 'r',
  z = 'z',
  c = 'c',
  s = 's',
  a = 'a',
  o = 'o',
  e = 'e',
  e2 = 'ê',
  ai = 'ai',
  ei = 'ei',
  ao = 'ao',
  ou = 'ou',
  an = 'an',
  en = 'en',
  ang = 'ang',
  eng = 'eng',
  er = 'er',
  i = 'i',
  u = 'u',
  u2 = 'ü'
}

export enum PartOfSpeech {
  noun = 'noun',
  verb = 'verb',
  adjective = 'adjective',
  adverb = 'adverb',
  pronoun = 'pronoun',
  preposition = 'preposition',
  conjunction = 'conjunction',
  auxiliaryVerb = 'auxiliaryVerb',
  measure = 'measure',
  particle = 'particle',
  determiner = 'determiner',
  symbol = 'symbol',
  numeral = 'numeral'
}

export enum MeanOfChunk {
  noun = 'noun',
  verv = 'verv',
  greeting = 'greeting',
  completeSentence = 'completeSentence',
  reason = 'reason',
  question = 'question',
  adnominalModifier = 'adnominalModifier',
  predicate = 'predicate',
  object = 'object',
  mainClause = 'mainClause',
  subordinateClause = 'subordinateClause',
  timeClause = 'timeClause',
  subjectVerb = 'subjectVerb',
  verbObject = 'verbObject',
  subject = 'subject'
}

export enum AvailableLang {
  en,
  jp
}

export enum LocalStrageName {
  userLang = 'user-lang',
  level = 'level',
  volume = 'volume',
  isVolumeOn = 'is-volume-on',
  verticalZhuyin = 'vertical-zhuyin',
  hideZhuyin = 'hide-zhuyin'
}

export enum Level {
  practice = 'practice',
  easy = 'easy',
  hard = 'hard'
}

export enum Notch {
  low = 1,
  high = 2
}

export enum GameState {
  stop,
  playing,
  result,
  loading
}

export enum ScoreSendingState {
  pending,
  sending,
  sent,
  error
}

export enum SocialMedia {
  twitter,
  facebook,
  mastodon
}
