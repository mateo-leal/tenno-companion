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
        { name: 'Rank 1: Deadly Decrees' },
        { name: 'Rank 2: Adrenaline Surge' },
        { name: 'Rank 3: Transference Sync' },
        { name: 'Rank 4: Swifter Strike' },
        { name: 'Rank 5: Swifter Abilities' },
        { name: 'Rank 6: Neural Pulse' },
        { name: 'Rank 7: Weaponmaster' },
        { name: 'Rank 8: Transference Synergy' },
        { name: 'Rank 9: Muscle Mass' },
        { name: 'Rank 10: Overpowering Abilities' },
      ],
    },
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicRiding.png',
      uniqueName: 'RIDING',
      ranks: [
        { name: 'Rank 1: Summon Kaithe' },
        { name: 'Rank 2: Cavalier Strength' },
        { name: 'Rank 3: Hoof Stomp' },
        { name: 'Rank 4: Fast Travel' },
        { name: 'Rank 5: Smooth Path' },
        { name: 'Rank 6: Steadfast Dismount' },
        { name: 'Rank 7: Endurance Racer' },
        { name: 'Rank 8: Unique Identity' },
        { name: 'Rank 9: Equestrian Bond' },
        { name: 'Rank 10: Herd Travel' },
      ],
    },
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicOpportunity.png',
      uniqueName: 'OPPORTUNITY',
      ranks: [
        { name: 'Rank 1: Expanded Decrees' },
        { name: 'Rank 2: Expanded Arsenal' },
        { name: 'Rank 3: Lucky Opener' },
        { name: 'Rank 4: Warframe Abundance' },
        { name: 'Rank 5: Treasure Finder' },
        { name: 'Rank 6: Fresh Hand' },
        { name: 'Rank 7: Maximized Arsenal' },
        { name: 'Rank 8: Warframe Diversity' },
        { name: 'Rank 9: High Value Vendor' },
        { name: 'Rank 10: Stranger in Black' },
      ],
    },
    {
      icon: 'https://wiki.warframe.com/images/DrifterIntrinsicEndurance.png',
      uniqueName: 'ENDURANCE',
      ranks: [
        { name: 'Rank 1: Fortifying Decrees' },
        { name: 'Rank 2: Restorative Decree' },
        { name: 'Rank 3: Determination' },
        { name: 'Rank 4: Deft Defender' },
        { name: 'Rank 5: Born Survivor' },
        { name: 'Rank 6: Precision Power' },
        { name: 'Rank 7: Sharpshooter’s Bounty' },
        { name: 'Rank 8: Tenacity' },
        { name: 'Rank 9: Tough As Old Boots' },
        { name: 'Rank 10: Cheat Death' },
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
