export type PublicExportWeapon = {
  name?: string
  icon?: string
  productCategory?: string
  masteryReq?: number
}

export type PublicExportWarframe = {
  name?: string
  icon?: string
  productCategory?: string
  masteryReq?: number
}

export type PublicExportSentinel = {
  name?: string
  icon?: string
  productCategory?: string
  masteryReq?: number
}

export type PublicExportDictionary = Record<string, string>

export type PublicExportMap<T> = Record<string, T>

const EXPORT_WEAPONS_URL =
  'https://browse.wf/warframe-public-export-plus/ExportWeapons.json'
const EXPORT_WARFRAMES_URL =
  'https://browse.wf/warframe-public-export-plus/ExportWarframes.json'
const EXPORT_SENTINELS_URL =
  'https://browse.wf/warframe-public-export-plus/ExportSentinels.json'
const EXPORT_DICT_EN_URL =
  'https://browse.wf/warframe-public-export-plus/dict.en.json'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return (await response.json()) as T
}

export function fetchPublicExportWeapons() {
  return fetchJson<PublicExportMap<PublicExportWeapon>>(EXPORT_WEAPONS_URL)
}

export function fetchPublicExportWarframes() {
  return fetchJson<PublicExportMap<PublicExportWarframe>>(EXPORT_WARFRAMES_URL)
}

export function fetchPublicExportSentinels() {
  return fetchJson<PublicExportMap<PublicExportSentinel>>(EXPORT_SENTINELS_URL)
}

export function fetchPublicExportDictionary() {
  return fetchJson<PublicExportDictionary>(EXPORT_DICT_EN_URL)
}

export function resolveDictName(
  dict: PublicExportDictionary,
  nameToken: string | undefined,
  fallback: string
): string {
  if (!nameToken) {
    return fallback
  }

  return dict[nameToken] ?? fallback
}
