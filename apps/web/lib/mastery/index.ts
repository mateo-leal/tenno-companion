import {
  ArchwingProvider,
  NecramechProvider,
  PetProvider,
  RailjackIntrinsicProvider,
  RegionProvider,
  WarframeProvider,
  WeaponProvider,
} from '@tenno-companion/core/server'
import { sortByName } from '@tenno-companion/core/locales'

import {
  MasteryByCategory,
  MasteryData,
  MasteryItem,
  MasterySubcategoryLabels,
} from './types'
import { toTitleCase } from '../utils'

export async function buildMasteryData(locale: string): Promise<MasteryData> {
  const [items, railjackIntrinsics, startChart] = await Promise.all([
    getItems(locale),
    getRailjackIntrinsics(locale),
    getStarChart(locale),
  ])
  const drifterIntrinsics = getDrifterIntrinsics()

  const data: MasteryByCategory = {
    itemCompletion: items,
    railjackIntrinsic: railjackIntrinsics.masteryItems,
    drifterIntrinsic: drifterIntrinsics.masteryItems,
    starchartCompletion: startChart.masteryItems,
    starchartCompletionSP: startChart.masteryItemsSP,
  }

  const subcategoryLabels: MasterySubcategoryLabels = {
    itemCompletion: {},
    railjackIntrinsic: railjackIntrinsics.labels,
    drifterIntrinsic: drifterIntrinsics.labels,
    starchartCompletion: startChart.labels,
    starchartCompletionSP: startChart.labels,
  }

  return {
    ...data,
    subcategoryLabels,
  }
}

async function getItems(locale: string) {
  const data: Record<string, MasteryItem[]> = {}
  const warframes = await WarframeProvider.create({ locale })
  const weapons = await WeaponProvider.create({ locale })
  const pets = await PetProvider.create({ locale })
  const archwings = await ArchwingProvider.create({ locale })
  const necramechs = await NecramechProvider.create({ locale })

  data.warframe = warframes.getAll().map((warframe) => ({
    id: warframe.uniqueName,
    name: warframe.name,
    iconUrl: `https://browse.wf${warframe.icon}`,
    masteryReq: warframe.masteryReq,
    masteryPoints: 6000,
  }))

  data.primary = weapons.getPrimaries().map((weapon) => ({
    id: weapon.uniqueName,
    name: weapon.name,
    iconUrl: `https://browse.wf${weapon.icon}`,
    masteryReq: weapon.masteryReq,
    masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
  }))

  data.secondary = sortByName(
    [
      ...weapons.getSecondaries({ masterable: true }).map((weapon) => ({
        id: weapon.uniqueName,
        name: weapon.name,
        iconUrl: `https://browse.wf${weapon.icon}`,
        masteryReq: weapon.masteryReq,
        masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
      })),
      ...weapons.getKitguns({ masterable: true }).map((weapon) => ({
        id: weapon.uniqueName,
        name: weapon.name,
        iconUrl: `https://browse.wf${weapon.icon}`,
        masteryReq: weapon.masteryReq,
        masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
      })),
    ],
    { locale }
  )

  data.melee = sortByName(
    [
      ...weapons.getMelees({ masterable: true }).map((weapon) => ({
        id: weapon.uniqueName,
        name: weapon.name,
        iconUrl: `https://browse.wf${weapon.icon}`,
        masteryReq: weapon.masteryReq,
        masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
      })),
      ...weapons.getZaws({ masterable: true }).map((weapon) => ({
        id: weapon.uniqueName,
        name: weapon.name,
        iconUrl: `https://browse.wf${weapon.icon}`,
        masteryReq: weapon.masteryReq,
        masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
      })),
    ],
    { locale }
  )

  data.robotic = sortByName(
    [
      ...pets.getSentinels({ masterable: true }).map((pet) => ({
        id: pet.uniqueName,
        name: pet.name,
        iconUrl: `https://browse.wf${pet.icon}`,
        masteryPoints: 6000,
      })),
      ...pets.getMOAs({ masterable: true }).map((pet) => ({
        id: pet.uniqueName,
        name: pet.name,
        iconUrl: `https://browse.wf${pet.icon}`,
        masteryReq: pet.masteryReq,
        masteryPoints: 6000,
      })),
      ...pets.getHounds({ masterable: true }).map((pet) => ({
        id: pet.uniqueName,
        name: pet.name,
        iconUrl: `https://browse.wf${pet.icon}`,
        masteryReq: pet.masteryReq,
        masteryPoints: 6000,
      })),
      ...pets.getSentinelWeapons({ masterable: true }).map((weapon) => ({
        id: weapon.uniqueName,
        name: weapon.name,
        iconUrl: `https://browse.wf${weapon.icon}`,
        masteryReq: weapon.masteryReq,
        masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
      })),
    ],
    { locale }
  )

  data.companion = pets
    .getBeasts({ masterable: true, includeSpecial: true })
    .map((pet) => ({
      id: pet.uniqueName,
      name: pet.name,
      iconUrl: `https://browse.wf${pet.icon}`,
      masteryPoints: 6000,
    }))

  data.vehicle = sortByName(
    [
      ...archwings.getAll().map((archwing) => ({
        id: archwing.uniqueName,
        name: archwing.name,
        iconUrl: `https://browse.wf${archwing.icon}`,
        masteryReq: archwing.masteryReq,
        masteryPoints: 6000,
      })),
      ...necramechs.getAll().map((necramech) => ({
        id: necramech.uniqueName,
        name: necramech.name,
        iconUrl: `https://browse.wf${necramech.icon}`,
        masteryReq: necramech.masteryReq,
        masteryPoints: 8000,
      })),
      ...weapons.getKDrives({ masterable: true }).map((kdrive) => ({
        id: kdrive.uniqueName,
        name: kdrive.name,
        iconUrl: `https://browse.wf${kdrive.icon}`,
        masteryReq: kdrive.masteryReq,
        masteryPoints: 6000,
      })),
      {
        id: 'railjack-plexus',
        name: 'Plexus',
        iconUrl: 'https://wiki.warframe.com/images/Plexus.png?25d71',
        masteryPoints: 6000,
      },
    ],
    { locale }
  )

  data.archgun = weapons.getArchguns({ masterable: true }).map((weapon) => ({
    id: weapon.uniqueName,
    name: weapon.name,
    iconUrl: `https://browse.wf${weapon.icon}`,
    masteryReq: weapon.masteryReq,
    masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
  }))

  data.archmelee = weapons
    .getArchmelees({ masterable: true })
    .map((weapon) => ({
      id: weapon.uniqueName,
      name: weapon.name,
      iconUrl: `https://browse.wf${weapon.icon}`,
      masteryReq: weapon.masteryReq,
      masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
    }))

  data.amp = weapons.getAmps({ masterable: true }).map((weapon) => ({
    id: weapon.uniqueName,
    name: weapon.name,
    iconUrl: `https://browse.wf${weapon.icon}`,
    masteryReq: weapon.masteryReq,
    masteryPoints: weapon.maxLevelCap === 40 ? 4000 : 3000,
  }))

  return data
}

async function getRailjackIntrinsics(locale: string) {
  const railjackIntrinsics = await RailjackIntrinsicProvider.create({ locale })
  return railjackIntrinsics.getAll().reduce(
    (data, intrinsic) => {
      data.labels[intrinsic.uniqueName] = toTitleCase(intrinsic.name)
      data.masteryItems[intrinsic.uniqueName] = intrinsic.ranks.map(
        (rank, index) => ({
          id: `intrinsic:${intrinsic.uniqueName}:${index + 1}`,
          name: rank.name,
          iconUrl: `https://browse.wf${intrinsic.icon}`,
          rankNumber: index + 1,
          masteryPoints: 1500,
        })
      )
      return data
    },
    { labels: {}, masteryItems: {} } as {
      labels: Record<string, string>
      masteryItems: Record<string, MasteryItem[]>
    }
  )
}

function getDrifterIntrinsics() {
  const DRIFTER_INTRINSICS = [
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicCombat.png',
      uniqueName: 'COMBAT',
      ranks: [
        { name: 'Deadly Decrees' },
        { name: 'Adrenaline Surge' },
        { name: 'Transference Sync' },
        { name: 'Swifter Strike' },
        { name: 'Swifter Abilities' },
        { name: 'Neural Pulse' },
        { name: 'Weaponmaster' },
        { name: 'Transference Synergy' },
        { name: 'Muscle Mass' },
        { name: 'Overpowering Abilities' },
      ],
    },
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicRiding.png',
      uniqueName: 'RIDING',
      ranks: [
        { name: 'Summon Kaithe' },
        { name: 'Cavalier Strength' },
        { name: 'Hoof Stomp' },
        { name: 'Fast Travel' },
        { name: 'Smooth Path' },
        { name: 'Steadfast Dismount' },
        { name: 'Endurance Racer' },
        { name: 'Unique Identity' },
        { name: 'Equestrian Bond' },
        { name: 'Herd Travel' },
      ],
    },
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicOpportunity.png',
      uniqueName: 'OPPORTUNITY',
      ranks: [
        { name: 'Expanded Decrees' },
        { name: 'Expanded Arsenal' },
        { name: 'Lucky Opener' },
        { name: 'Warframe Abundance' },
        { name: 'Treasure Finder' },
        { name: 'Fresh Hand' },
        { name: 'Maximized Arsenal' },
        { name: 'Warframe Diversity' },
        { name: 'High Value Vendor' },
        { name: 'Stranger in Black' },
      ],
    },
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicEndurance.png',
      uniqueName: 'ENDURANCE',
      ranks: [
        { name: 'Fortifying Decrees' },
        { name: 'Restorative Decree' },
        { name: 'Determination' },
        { name: 'Deft Defender' },
        { name: 'Born Survivor' },
        { name: 'Precision Power' },
        { name: 'Sharpshooter’s Bounty' },
        { name: 'Tenacity' },
        { name: 'Tough As Old Boots' },
        { name: 'Cheat Death' },
      ],
    },
  ]
  return DRIFTER_INTRINSICS.reduce(
    (data, intrinsic) => {
      data.labels[intrinsic.uniqueName] = toTitleCase(intrinsic.uniqueName)
      data.masteryItems[intrinsic.uniqueName] = intrinsic.ranks.map(
        (rank, index) => ({
          id: `drifter-intrinsic:${intrinsic.uniqueName}:${index + 1}`,
          name: rank.name,
          iconUrl: intrinsic.icon,
          rankNumber: index + 1,
          masteryPoints: 1500,
        })
      )
      return data
    },
    { labels: {}, masteryItems: {} } as {
      labels: Record<string, string>
      masteryItems: Record<string, MasteryItem[]>
    }
  )
}

async function getStarChart(locale: string) {
  const regions = await RegionProvider.create({ locale })
  return Object.entries(regions.getStarChart({ masterable: true })).reduce(
    (data, [systemIndex, system]) => {
      data.labels[systemIndex] = system.systemName
      data.masteryItems[systemIndex] = system.nodes.map((node) => ({
        id: `starchart:${node.uniqueName}`,
        name: node.name,
        masteryPoints: node.masteryExp,
        masteryReq: node.masteryReq,
      }))
      data.masteryItemsSP[systemIndex] = system.nodes.map((node) => ({
        id: `starchart-sp:${node.uniqueName}`,
        name: node.name,
        masteryPoints: node.masteryExp,
        masteryReq: node.masteryReq,
      }))
      return data
    },
    { labels: {}, masteryItems: {}, masteryItemsSP: {} } as {
      labels: Record<string, string>
      masteryItems: Record<string, MasteryItem[]>
      masteryItemsSP: Record<string, MasteryItem[]>
    }
  )
}
