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
