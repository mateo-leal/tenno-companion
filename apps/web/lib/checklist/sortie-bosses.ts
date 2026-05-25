import { toTitleCase } from '../utils'
import { Dictionary } from '../language'

const SORTIE_BOSS_DICT_KEY = {
  SORTIE_BOSS_CORRUPTED_VOR: '/Lotus/Language/Game/VorTwo',
  SORTIE_BOSS_KRIL: '/Lotus/Language/Game/LieutenantLechKril',
  SORTIE_BOSS_JACKAL: '/Lotus/Language/Game/QuadRobot',
  SORTIE_BOSS_ALAD: '/Lotus/Language/Game/AladV',
  SORTIE_BOSS_NEF: '/Lotus/Language/Bosses/NefAnyoName',
  SORTIE_BOSS_KELA: '/Lotus/Language/Game/KelaDeThaym',
  SORTIE_BOSS_INFALAD: '/Lotus/Language/Game/InfestedAladV',
  SORTIE_BOSS_TYL: '/Lotus/Language/Game/TylRegor',
  SORTIE_BOSS_VOR: '/Lotus/Language/Game/CaptainVor',
  SORTIE_BOSS_LEPHANTIS: '/Lotus/Language/Game/GolemBossFull',
  SORTIE_BOSS_HYENA: '/Lotus/Language/Bosses/BossTheHyena',
  SORTIE_BOSS_PHORID: '/Lotus/Language/Game/Phorid',
  // Archon
  SORTIE_BOSS_AMAR: '/Lotus/Language/Narmer/ArchonAmar',
  SORTIE_BOSS_BOREAL: '/Lotus/Language/Narmer/ArchonBoreal',
  SORTIE_BOSS_NIRA: '/Lotus/Language/Narmer/ArchonNira',
}

export function getSortieBossName(boss: string, dictionary: Dictionary) {
  const dictKey =
    SORTIE_BOSS_DICT_KEY[boss as keyof typeof SORTIE_BOSS_DICT_KEY]
  if (dictKey) {
    return dictionary[dictKey] ?? boss
  }

  // Fallback: try to convert the boss name from the sortie data to a human-readable format
  // This is needed because some bosses don't have a corresponding entry in the dictionary
  return toTitleCase(boss.replace('SORTIE_BOSS_', '').replace(/_/g, ' '))
}
