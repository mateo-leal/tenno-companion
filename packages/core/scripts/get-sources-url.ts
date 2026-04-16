export const SOURCES = {
  factions: 'ExportFactions',
  missionTypes: 'ExportMissionTypes',
  railjackIntrinsics: 'ExportIntrinsics',
  regions: 'ExportRegions',
  sentinels: 'ExportSentinels',
  warframes: 'ExportWarframes',
  weapons: 'ExportWeapons',
}

const OWNER = 'calamity-inc'
const REPO = 'warframe-public-export-plus'
const BRANCH = 'senpai'

export const BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/refs/heads/${BRANCH}/`

export const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/branches/${BRANCH}`
