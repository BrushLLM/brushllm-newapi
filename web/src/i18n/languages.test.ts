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
import { describe, expect, test } from 'vitest'

import { convertDetectedLanguage } from './languages'

describe('convertDetectedLanguage', () => {
  test('maps browser BCP-47 Chinese tags onto interface codes', () => {
    expect(convertDetectedLanguage('zh-TW')).toBe('zhTW')
    expect(convertDetectedLanguage('zh-HK')).toBe('zhTW')
    expect(convertDetectedLanguage('zh-MO')).toBe('zhTW')
    expect(convertDetectedLanguage('zh-Hant-TW')).toBe('zhTW')
    expect(convertDetectedLanguage('zh')).toBe('zhCN')
    expect(convertDetectedLanguage('zh-CN')).toBe('zhCN')
    expect(convertDetectedLanguage('zh-Hans')).toBe('zhCN')
  })

  test('keeps already-normalized interface codes stable (localStorage round-trip)', () => {
    // i18next caches `zhTW`/`zhCN`/`ptBR` (the supportedLngs codes) to
    // localStorage, and the detector runs this converter on the cached value
    // at every page load — if `zhTW` does not survive the round-trip, a user
    // who picked Traditional Chinese is flipped to Simplified on the next
    // load and the cache is overwritten, making the flip permanent.
    expect(convertDetectedLanguage('zhTW')).toBe('zhTW')
    expect(convertDetectedLanguage('zhCN')).toBe('zhCN')
    expect(convertDetectedLanguage('ptBR')).toBe('ptBR')
  })

  test('maps Portuguese locales onto the single ptBR variant', () => {
    expect(convertDetectedLanguage('pt-BR')).toBe('ptBR')
    expect(convertDetectedLanguage('pt')).toBe('ptBR')
    expect(convertDetectedLanguage('pt-PT')).toBe('ptBR')
  })

  test('strips region subtags so currentOnly matching hits supportedLngs', () => {
    // `load: 'currentOnly'` only matches exact codes, so a `de-DE` browser
    // would otherwise fall back to English despite German being supported.
    expect(convertDetectedLanguage('de-DE')).toBe('de')
    expect(convertDetectedLanguage('es-MX')).toBe('es')
    expect(convertDetectedLanguage('fr-FR')).toBe('fr')
    expect(convertDetectedLanguage('ko-KR')).toBe('ko')
    expect(convertDetectedLanguage('en-US')).toBe('en')
  })

  test('passes base codes through unchanged', () => {
    expect(convertDetectedLanguage('en')).toBe('en')
    expect(convertDetectedLanguage('fr')).toBe('fr')
    expect(convertDetectedLanguage('ja')).toBe('ja')
    expect(convertDetectedLanguage('de')).toBe('de')
    expect(convertDetectedLanguage('ru')).toBe('ru')
  })
})
