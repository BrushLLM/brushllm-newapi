/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
/* Language list order follows the BrushLLM console spec; languages not in
 * that list (ru, vi) sit after Korean. Codes are the non-standard camelCase
 * values i18next registers in resources/supportedLngs. */
export const INTERFACE_LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ptBR', label: 'Português (Brasil)' },
  { code: 'ja', label: '日本語' },
  { code: 'zhCN', label: '简体中文' },
  { code: 'zhTW', label: '繁體中文' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' },
  { code: 'vi', label: 'Tiếng Việt' },
] as const

export type InterfaceLanguageCode =
  (typeof INTERFACE_LANGUAGE_OPTIONS)[number]['code']

export function normalizeInterfaceLanguage(value?: string | null): string {
  if (!value) return 'en'

  let normalized = value.trim().replaceAll('_', '-').toLowerCase()
  if (
    value === 'zh-TW' ||
    value === 'zh-HK' ||
    value === 'zh-MO' ||
    value === 'zhTW'
  ) {
    normalized = 'zhTW'
  }
  if (value === 'zh-CN' || value === 'zh-Hans' || value === 'zhCN') {
    normalized = 'zhCN'
  }
  if (value === 'pt-BR' || value === 'ptBR') {
    normalized = 'ptBR'
  }

  return INTERFACE_LANGUAGE_OPTIONS.some((lang) => lang.code === normalized)
    ? normalized
    : 'en'
}

/**
 * Map a browser-detected locale onto the interface language codes this project
 * uses with i18next (`zhCN` / `zhTW` / `ptBR`).
 *
 * Browsers report standard BCP-47 tags (`zh-CN`, `pt-BR`, `de-DE`, ...), but
 * `supportedLngs` uses the non-standard camelCase codes AND `load:
 * 'currentOnly'` only matches exact codes, so without normalization a
 * `de-DE`/`fr-FR`/`pt-BR` browser would fall back to English. Chinese and
 * Portuguese variants collapse onto our single variants; every other language
 * strips its region subtag to the base code.
 */
export function convertDetectedLanguage(value: string): string {
  const lower = value.trim().replaceAll('_', '-').toLowerCase()
  if (lower.startsWith('zh')) {
    if (
      lower === 'zhtw' ||
      lower === 'zh-tw' ||
      lower === 'zh-hk' ||
      lower === 'zh-mo' ||
      lower.startsWith('zh-hant')
    ) {
      return 'zhTW'
    }
    return 'zhCN'
  }
  if (lower === 'pt' || lower === 'ptbr' || lower.startsWith('pt-')) {
    return 'ptBR'
  }
  const base = lower.split('-')[0]
  if (base && base !== lower) {
    const STRIP_OK = ['en', 'de', 'es', 'fr', 'ja', 'ko', 'ru', 'vi']
    if (STRIP_OK.includes(base)) return base
  }
  return value
}

/**
 * Convert an interface language code (the values i18next uses, such as `zhCN` /
 * `zhTW`) into a valid BCP-47 locale tag that the `Intl.*` APIs accept.
 *
 * `new Intl.NumberFormat('zhCN')` throws `RangeError: Invalid language tag`, so
 * any locale derived from `i18n.language` / `i18n.resolvedLanguage` MUST be run
 * through this before it reaches an `Intl` constructor. Unknown values fall back
 * to `undefined`, which makes `Intl` use the runtime default locale.
 */
export function toIntlLocale(value?: string | null): string | undefined {
  if (!value) return undefined
  switch (value) {
    case 'zhCN':
      return 'zh-CN'
    case 'zhTW':
      return 'zh-TW'
    case 'ptBR':
      return 'pt-BR'
    default:
      break
  }
  try {
    return Intl.getCanonicalLocales(value)[0]
  } catch {
    return undefined
  }
}
