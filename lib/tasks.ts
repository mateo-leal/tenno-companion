import { ChecklistTask } from './types'

export const DAILY_TASKS: ChecklistTask[] = [
  {
    id: 'daily-login-reward',
    title: 'checklist.daily.tasks.login',
  },
  {
    id: 'daily-forma',
    title: 'checklist.daily.tasks.craftForma',
    location: 'checklist.locations.baseOfOperations',
    terminal: 'checklist.terminal.foundry',
  },
  {
    id: 'daily-other-foundry',
    title: 'checklist.daily.tasks.craftOther',
    location: 'checklist.locations.baseOfOperations',
    terminal: 'checklist.terminal.foundry',
  },
  {
    id: 'daily-syndicate-standing',
    title: 'checklist.daily.tasks.factionSyndicates',
    info: 'checklist.daily.tasks.factionSyndicatesInfo',
  },
  {
    id: 'daily-world-syndicates',
    title: 'checklist.daily.tasks.worldSyndicates',
    checkable: false,
    subitems: [
      {
        id: 'daily-world-simaris',
        title: 'checklist.daily.tasks.cephalonSimaris',
        location: 'checklist.locations.anyRelay',
      },
      {
        id: 'daily-world-ostron',
        title: 'checklist.daily.tasks.ostron',
        location: 'checklist.locations.cetus',
        prerequisite: 'checklist.prerequisites.sayasVigil',
      },
      {
        id: 'daily-world-quills',
        title: 'checklist.daily.tasks.theQuills',
        location: 'checklist.locations.cetus',
        prerequisite: 'checklist.prerequisites.theWarWithin',
      },
      {
        id: 'daily-world-solaris-united',
        title: 'checklist.daily.tasks.solarisUnited',
        location: 'checklist.locations.fortuna',
        prerequisite: 'checklist.prerequisites.voxSolaris',
      },
      {
        id: 'daily-world-vox-solaris',
        title: 'checklist.daily.tasks.voxSolaris',
        location: 'checklist.locations.fortuna',
        prerequisite: 'checklist.prerequisites.theWarWithin',
      },
      {
        id: 'daily-world-ventkids',
        title: 'checklist.daily.tasks.ventkids',
        location: 'checklist.locations.fortuna',
        prerequisite: 'checklist.prerequisites.voxSolaris',
      },
      {
        id: 'daily-world-entrati',
        title: 'checklist.daily.tasks.entrati',
        location: 'checklist.locations.necralisk',
        prerequisite: 'checklist.prerequisites.heartOfDeimos',
      },
      {
        id: 'daily-world-necraloid',
        title: 'checklist.daily.tasks.necraloid',
        location: 'checklist.locations.necralisk',
        prerequisite: 'checklist.prerequisites.theWarWithin',
      },
      {
        id: 'daily-world-holdfasts',
        title: 'checklist.daily.tasks.theHoldfasts',
        location: 'checklist.locations.chrysalith',
        prerequisite: 'checklist.prerequisites.angelsOfTheZariman',
      },
      {
        id: 'daily-world-cavia',
        title: 'checklist.daily.tasks.cavia',
        location: 'checklist.locations.sanctumAnatomica',
        prerequisite: 'checklist.prerequisites.whispersInTheWalls',
      },
      {
        id: 'daily-world-hex',
        title: 'checklist.daily.tasks.theHex',
        location: 'checklist.locations.hollvaniaCentralMall',
        prerequisite: 'checklist.prerequisites.theHex',
      },
    ],
  },
  // {
  //   id: 'daily-sortie',
  //   title: 'Complete Sortie (3 missions)',
  //   location: 'Orbiter > Navigation > Sortie',
  //   terminal: 'The War Within',
  // },
  // {
  //   id: 'daily-focus',
  //   title: 'Farm daily Focus cap',
  //   location: 'Any mission with Focus Lens / Sanctuary Onslaught',
  //   terminal: 'The Second Dream',
  // },
  // {
  //   id: 'daily-steel-path-incursions',
  //   title: 'Run Steel Path Incursions',
  //   location: 'Orbiter > Navigation > Steel Path',
  //   terminal: 'Steel Path unlocked',
  // },
  // {
  //   id: 'daily-acrithis',
  //   title: 'Check Acrithis daily stock',
  //   location: 'Dormizone / Duviri > Acrithis',
  //   terminal: 'The Duviri Paradox',
  // },
  // {
  //   id: 'daily-ticker-crew',
  //   title: 'Check Ticker crew candidates',
  //   location: 'Fortuna, Venus > Ticker',
  //   terminal: 'Rising Tide and Command Intrinsics 1',
  // },
]

export const WEEKLY_TASKS: ChecklistTask[] = [
  // {
  //   id: 'weekly-nightwave',
  //   title: 'Complete weekly Nightwave acts',
  //   location: 'Orbiter > Nightwave panel',
  //   terminal: 'Always available',
  // },
  // {
  //   id: 'weekly-nightwave-spend',
  //   title: 'Spend Nightwave credits',
  //   location: 'Orbiter > Nightwave offerings',
  //   terminal: 'Always available',
  // },
  // {
  //   id: 'weekly-maroo',
  //   title: "Run Maroo's Ayatan hunt",
  //   location: "Maroo's Bazaar, Mars > Maroo",
  //   terminal: 'Always available',
  // },
  // {
  //   id: 'weekly-help-clem',
  //   title: 'Help Clem mission',
  //   location: 'Any Relay > Darvo',
  //   terminal: 'A Man of Few Words',
  // },
  // {
  //   id: 'weekly-archon-hunt',
  //   title: 'Complete Archon Hunt',
  //   location: 'Orbiter > Navigation > Archon Hunt',
  //   terminal: 'The New War',
  // },
  // {
  //   id: 'weekly-circuit-normal',
  //   title: 'Review Duviri Circuit (Normal)',
  //   location: 'Orbiter or Dormizone > Duviri Circuit',
  //   terminal: 'The Duviri Paradox',
  // },
  // {
  //   id: 'weekly-circuit-sp',
  //   title: 'Review Duviri Circuit (Steel Path)',
  //   location: 'Orbiter or Dormizone > Duviri Circuit',
  //   terminal: 'Steel Path and The Duviri Paradox',
  // },
  // {
  //   id: 'weekly-netracells',
  //   title: 'Use weekly Netracell entries',
  //   location: 'Sanctum Anatomica, Deimos > Tagfer',
  //   terminal: 'Whispers in the Walls',
  // },
  // {
  //   id: 'weekly-eda',
  //   title: 'Attempt Elite Deep Archimedea',
  //   location: 'Sanctum Anatomica, Deimos > Necraloid',
  //   terminal: 'Rank 5 Cavia',
  // },
  // {
  //   id: 'weekly-helminth',
  //   title: 'Use Helminth invigorations',
  //   location: 'Orbiter > Helminth room',
  //   terminal: 'Helminth Segment and Rank 5 Entrati',
  // },
  // {
  //   id: 'weekly-vendors',
  //   title: 'Check weekly vendor rotations',
  //   location: 'Relays and open world hub vendors',
  //   terminal: 'Vendor-specific progression',
  // },
]

export const OTHER_TASKS: ChecklistTask[] = [
  // {
  //   id: 'other-baro',
  //   title: "Baro Ki'Teer visit",
  //   location: 'Any active relay with Baro icon',
  //   terminal: 'Relay access and Ducats',
  // },
  // {
  //   id: 'other-fissure-surge',
  //   title: 'Prime part stock refresh',
  //   location: 'Orbiter > Navigation > Void Fissures',
  //   terminal: 'Void Fissures unlocked',
  // },
  // {
  //   id: 'other-family-tokens',
  //   title: 'Mend the Family token purchases',
  //   location: 'Necralisk, Deimos > Grandmother',
  //   terminal: 'Heart of Deimos',
  // },
  // {
  //   id: 'other-zariman-turn-ins',
  //   title: 'Voidplume turn-ins and spending',
  //   location: 'Chrysalith, Zariman > Archimedean Yonta',
  //   terminal: 'Angels of the Zariman',
  // },
  // {
  //   id: 'other-sanctum-voca',
  //   title: 'Voca turn-ins and spending',
  //   location: 'Sanctum Anatomica, Deimos > Loid',
  //   terminal: 'Whispers in the Walls',
  // },
  // {
  //   id: 'other-goal-cleanup',
  //   title: 'Goal-based cleanup',
  //   location: 'Varies by event or farm route',
  //   terminal: 'Varies by objective',
  // },
]
