/**
 * List of supported languages in Warframe. This is not an exhaustive list of all languages, but rather the ones that are currently supported by the game.
 * https://wiki.warframe.com/w/Languages
 */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  tr: 'Türkçe',
  uk: 'Українська',
  zh: '简体中文',
  tc: '繁體中文',
  th: 'แบบไทย',
}

export type Locale = keyof typeof SUPPORTED_LANGUAGES

export type Dictionary = Record<string, string>
