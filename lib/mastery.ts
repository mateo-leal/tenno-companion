import {
  resolveDictName,
  type PublicExportDictionary,
} from '@/lib/public-export/fetch-public-export'

export type MasteryCategory =
  | 'warframe'
  | 'primary'
  | 'secondary'
  | 'melee'
  | 'kitgun'
  | 'zaw'
  | 'amp'
  | 'sentinel'
  | 'moa'
  | 'hound'
  | 'beast'
  | 'robotic'
  | 'archwing'
  | 'archgun'
  | 'archmelee'
  | 'necramech'
  | 'railjack'
  | 'kDrive'

export type MasteryItem = {
  id: string
  name: string
  iconUrl?: string
  masteryReq?: number
}

export type MasteryData = Record<MasteryCategory, MasteryItem[]>

export const CATEGORY_ORDER: MasteryCategory[] = [
  'warframe',
  'primary',
  'secondary',
  'melee',
  'kitgun',
  'zaw',
  'amp',
  'sentinel',
  'moa',
  'hound',
  'beast',
  'robotic',
  'archwing',
  'archgun',
  'archmelee',
  'necramech',
  'railjack',
  'kDrive',
]

function toSortedItems(entries: MasteryItem[]): MasteryItem[] {
  return entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
}

function buildIconUrl(iconPath: string | undefined): string | undefined {
  if (!iconPath || iconPath.trim().length === 0) {
    return undefined
  }

  return `https://browse.wf${iconPath}`
}

export function buildMasteryData(
  dict: PublicExportDictionary,
  weaponsMap: Record<
    string,
    {
      name?: string
      icon?: string
      productCategory?: string
      masteryReq?: number
      partType?: string
    }
  >,
  warframesMap: Record<
    string,
    {
      name?: string
      icon?: string
      productCategory?: string
      masteryReq?: number
    }
  >,
  sentinelsMap: Record<
    string,
    {
      name?: string
      icon?: string
      productCategory?: string
      masteryReq?: number
    }
  >
): MasteryData {
  const data: MasteryData = {
    warframe: [],
    primary: [],
    secondary: [],
    melee: [],
    kitgun: [],
    zaw: [],
    amp: [],
    sentinel: [],
    moa: [],
    hound: [],
    beast: [],
    robotic: [],
    archwing: [],
    archgun: [],
    archmelee: [],
    necramech: [],
    railjack: [],
    kDrive: [],
  }

  for (const [path, frame] of Object.entries(warframesMap)) {
    const category = frame.productCategory
    let targetCategory: MasteryCategory | null = null

    if (category === 'Suits') {
      targetCategory = 'warframe'
    } else if (category === 'SpaceSuits') {
      targetCategory = 'archwing'
    } else if (category === 'MechSuits') {
      targetCategory = 'necramech'
    }

    if (!targetCategory) {
      continue
    }

    const fallback = path.split('/').pop() ?? path
    data[targetCategory].push({
      id: `warframe:${path}`,
      name: resolveDictName(dict, frame.name, fallback),
      iconUrl: buildIconUrl(frame.icon),
      masteryReq: frame.masteryReq,
    })
  }

  for (const [path, weapon] of Object.entries(weaponsMap)) {
    if (
      // Exclude amp parts
      weapon.partType === 'LWPT_AMP_BRACE' ||
      weapon.partType === 'LWPT_AMP_CORE' ||
      // Exclude Zanuka parts
      weapon.partType === 'LWPT_ZANUKA_BODY' ||
      weapon.partType === 'LWPT_ZANUKA_LEG' ||
      weapon.partType === 'LWPT_ZANUKA_TAIL' ||
      // Exclude Mutagen
      weapon.partType === 'LWPT_CATBROW_MUTAGEN' ||
      weapon.partType === 'LWPT_KUBROW_MUTAGEN' ||
      // Exclude Antigen
      weapon.partType === 'LWPT_CATBROW_ANTIGEN' ||
      weapon.partType === 'LWPT_KUBROW_ANTIGEN' ||
      // Exclude Moa Parts
      weapon.partType === 'LWPT_MOA_PAYLOAD' ||
      weapon.partType === 'LWPT_MOA_ENGINE' ||
      weapon.partType === 'LWPT_MOA_LEG' ||
      // Exclude K-Drive Parts
      weapon.partType === 'LWPT_HB_ENGINE' ||
      weapon.partType === 'LWPT_HB_FRONT' ||
      weapon.partType === 'LWPT_HB_JET' ||
      // Exclude Kitgun Parts
      weapon.partType === 'LWPT_GUN_CLIP' ||
      weapon.partType === 'LWPT_GUN_PRIMARY_HANDLE' ||
      weapon.partType === 'LWPT_GUN_SECONDARY_HANDLE' ||
      // Exclude Zaw Parts
      weapon.partType === 'LWPT_HILT' ||
      weapon.partType === 'LWPT_HILT_WEIGHT' ||
      // Exclude PvP Variant Zaws
      (weapon.partType === 'LWPT_BLADE' && path?.includes('PvPVariant')) ||
      // Exclude duplicate Grimoire
      path.includes('TnDoppelgangerGrimoire')
    ) {
      continue
    }

    const category = weapon.productCategory
    const partType = weapon.partType
    let targetCategory: MasteryCategory | null = null

    if (partType === 'LWPT_AMP_OCULUS') {
      targetCategory = 'amp'
    } else if (partType === 'LWPT_HB_DECK') {
      targetCategory = 'kDrive'
    } else if (partType === 'LWPT_BLADE') {
      targetCategory = 'zaw'
    } else if (partType === 'LWPT_GUN_BARREL') {
      targetCategory = 'kitgun'
    } else if (partType === 'LWPT_MOA_HEAD') {
      targetCategory = 'moa'
    } else if (partType === 'LWPT_ZANUKA_HEAD') {
      targetCategory = 'hound'
    } else if (category === 'LongGuns') {
      targetCategory = 'primary'
    } else if (category === 'Pistols') {
      targetCategory = 'secondary'
    } else if (category === 'Melee') {
      targetCategory = 'melee'
    } else if (category === 'SpaceMelee') {
      targetCategory = 'archmelee'
    } else if (category === 'SpaceGuns') {
      targetCategory = 'archgun'
    } else if (category === 'OperatorAmps') {
      targetCategory = 'amp'
    } else if (category === 'SentinelWeapons') {
      targetCategory = 'robotic'
    }

    if (!targetCategory) {
      continue
    }

    const fallback = path.split('/').pop() ?? path
    data[targetCategory].push({
      id: `weapon:${path}`,
      name: resolveDictName(dict, weapon.name, fallback),
      iconUrl: buildIconUrl(weapon.icon),
      masteryReq: weapon.masteryReq,
    })
  }

  for (const [path, sentinel] of Object.entries(sentinelsMap)) {
    const category = sentinel.productCategory
    let targetCategory: MasteryCategory | null = null

    if (category === 'Sentinels') {
      targetCategory = 'sentinel'
    } else if (category === 'KubrowPets' || category === 'SpecialItems') {
      targetCategory = 'beast'
    }

    if (!targetCategory) {
      continue
    }

    const fallback = path.split('/').pop() ?? path
    data[targetCategory].push({
      id: `sentinel:${path}`,
      name: resolveDictName(dict, sentinel.name, fallback),
      iconUrl: buildIconUrl(sentinel.icon),
      masteryReq: sentinel.masteryReq,
    })
  }

  return {
    warframe: toSortedItems(data.warframe),
    primary: toSortedItems(data.primary),
    secondary: toSortedItems(data.secondary),
    melee: toSortedItems(data.melee),
    kitgun: toSortedItems(data.kitgun),
    zaw: toSortedItems(data.zaw),
    amp: toSortedItems(data.amp),
    sentinel: toSortedItems(data.sentinel),
    moa: toSortedItems(data.moa),
    hound: toSortedItems(data.hound),
    beast: toSortedItems(data.beast),
    robotic: toSortedItems(data.robotic),
    archwing: toSortedItems(data.archwing),
    archgun: toSortedItems(data.archgun),
    archmelee: toSortedItems(data.archmelee),
    necramech: toSortedItems(data.necramech),
    railjack: toSortedItems(data.railjack),
    kDrive: toSortedItems(data.kDrive),
  }
}
