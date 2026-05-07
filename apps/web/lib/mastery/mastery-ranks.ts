import { MasteryRank } from './types'

export function getMasteryRank(xp: number): MasteryRank {
  for (let i = MASTERY_RANKS.length - 1; i >= 0; i--) {
    if (xp >= MASTERY_RANKS[i].xp) {
      return MASTERY_RANKS[i]
    }
  }

  return MASTERY_RANKS[0] // fallback (MR0)
}

const MASTERY_RANKS: MasteryRank[] = [
  {
    id: 0,
    xp: 0,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank00Unranked.png',
  },
  {
    id: 1,
    xp: 2500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank01Initiate.png',
  },
  {
    id: 2,
    xp: 10000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank02SilverInitiate.png',
  },
  {
    id: 3,
    xp: 22500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank03GoldInitiate.png',
  },
  {
    id: 4,
    xp: 40000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank04Novice.png',
  },
  {
    id: 5,
    xp: 62500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank05SilverNovice.png',
  },
  {
    id: 6,
    xp: 90000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank06GoldNovice.png',
  },
  {
    id: 7,
    xp: 122500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank07Disciple.png',
  },
  {
    id: 8,
    xp: 160000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank08SilverDisciple.png',
  },
  {
    id: 9,
    xp: 202500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank09GoldDisciple.png',
  },
  {
    id: 10,
    xp: 250000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank10Seeker.png',
  },
  {
    id: 11,
    xp: 302500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank11SilverSeeker.png',
  },
  {
    id: 12,
    xp: 360000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank12GoldSeeker.png',
  },
  {
    id: 13,
    xp: 422500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank13Hunter.png',
  },
  {
    id: 14,
    xp: 490000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank14SilverHunter.png',
  },
  {
    id: 15,
    xp: 562000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank15GoldHunter.png',
  },
  {
    id: 16,
    xp: 640000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank16Eagle.png',
  },
  {
    id: 17,
    xp: 722500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank17SilverEagle.png',
  },
  {
    id: 18,
    xp: 810000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank18GoldEagle.png',
  },
  {
    id: 19,
    xp: 902500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank19Tiger.png',
  },
  {
    id: 20,
    xp: 1000000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank20SilverTiger.png',
  },
  {
    id: 21,
    xp: 1102500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank21GoldTiger.png',
  },
  {
    id: 22,
    xp: 1210000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank22Dragon.png',
  },
  {
    id: 23,
    xp: 1322500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank23SilverDragon.png',
  },
  {
    id: 24,
    xp: 1440000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank24GoldDragon.png',
  },
  {
    id: 25,
    xp: 1562500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank25Sage.png',
  },
  {
    id: 26,
    xp: 1690000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank26SilverSage.png',
  },
  {
    id: 27,
    xp: 1822500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank27GoldSage.png',
  },
  {
    id: 28,
    xp: 1960000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank28Master.png',
  },
  {
    id: 29,
    xp: 2102500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank29MiddleMaster.png',
  },
  {
    id: 30,
    xp: 2250000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank30GrandMaster.png',
  },
  {
    id: 31,
    xp: 2397500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank31.png',
  },
  {
    id: 32,
    xp: 2545000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank32.png',
  },
  {
    id: 33,
    xp: 2692500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank33.png',
  },
  {
    id: 34,
    xp: 2840000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank34.png',
  },
  {
    id: 35,
    xp: 2987500,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank35.png',
  },
  {
    id: 36,
    xp: 3135000,
    icon: 'https://browse.wf/Lotus/Interface/Icons/MasteryRanks/Rank36.png',
  },
]
