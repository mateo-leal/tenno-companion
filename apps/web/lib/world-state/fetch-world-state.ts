import type { WorldState } from 'warframe-worldstate-parser'

import { FetchError } from '../errors'


const ORACLE_WORLD_STATE_URL = 'https://api.warframestat.us/pc'

export async function fetchOracleWorldState(locale: string): Promise<WorldState> {
  const supportedLocales = ['de', 'es', 'fr', 'it', 'ko', 'pl', 'pt', 'ru', 'zh', 'cs', 'sr', 'uk', 'en']
  let url = ORACLE_WORLD_STATE_URL
  if (locale && supportedLocales.includes(locale)) {
    url += `?language=${locale}`
  }
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      "Accept-Language": locale,
    }
  })

  if (!response.ok) {
    throw new FetchError(response.status)
  }

  return (await response.json()) as WorldState
}
