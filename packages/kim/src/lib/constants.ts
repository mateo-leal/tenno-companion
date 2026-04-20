export const CHATROOMS = [
  'aoi',
  'arthur',
  'eleanor',
  'flare',
  'hex',
  'amir',
  'kaya',
  'lettie',
  'loid',
  'lyon',
  'marie',
  'minerva',
  'minerva-velimir',
  'quincy',
  'roathe',
  'velimir',
] as const

export const AVOIDABLE_BOOLEAN_NAMES = [
  'LyonSuspicious',
  'DrifterLiar',
  'RoatheInsulted',
]

// Exact names for flirting-related booleans that do not follow keyword patterns.
export const ROMANCE_BOOLEAN_NAMES = [
  // General
  'IsDating',
  // Amir
  'AmirCasualFlirt',
  'AmirDating',
  'AmirHasDated',
  'AmirFirstFlirt',
  'AmirWillDate',
  'DrifterIntoAmir',
  // Arthur
  'ArthurConfessedFeels',
  'ArthurDating',
  'ArthurHasDated',
  'DrifterIntoArthur',
  // Aoi
  'AoiDating',
  'AoiHasDated',
  // Eleanor
  'DrifterIntoEleanor',
  'EleanorConfession',
  'EleanorDating',
  'EleanorHasDated',
  'EleanorHasFlirted',
  // Lettie
  'DrifterIntoLettie',
  'LettieConfession',
  'LettieFlirt',
  'LettieWillDate',
  'LettieDating',
  'LettieHasDated',
  // Quincy
  'DrifterIntoQuincy',
  // 'QuincyConfession1', // Not sure about this one
  'QuincyDating',
  'QuincyFlirt',
  'QuincyFlirtMaybe',
  // Lyon
  'DrifterLyon',
  'LyonDating',
  'LyonFirstFlirt',
  'LyonFlirtOffer',
  'LyonHasDated',
  'LyonWillDate',
  // Marie
  'DrifterMarie',
  'MarieDating',
  'MarieWillDate',
]

export const NO_ROMANCE_BOOLEAN_NAMES = [
  // Amir
  'AmirNoDate',
  // Arthur
  'ArthurNoDate',
  // Aoi
  'AoiNoDate',
  // Eleanor
  'EleanorNoDate',
  // Lettie
  'LettieNoDate',
  'LettieNoFlirt',
  // Quincy
  'QuincyFlirtNo',
  'QuincyNoDate',
  // Marie
  'MarieNoDate',
]

export enum NodeType {
  CheckBoolean = '/EE/Types/Engine/CheckBooleanDialogueNode',
  CheckBooleanScript = '/EE/Types/Engine/CheckBooleanScriptDialogueNode',
  CheckCounter = '/EE/Types/Engine/CheckCounterDialogueNode',
  CheckMultiBoolean = '/EE/Types/Engine/CheckMultiBooleanDialogueNode',
  Chemistry = '/EE/Types/Engine/ChemistryDialogueNode',
  Dialogue = '/EE/Types/Engine/DialogueNode',
  End = '/EE/Types/Engine/EndDialogueNode',
  IncCounter = '/EE/Types/Engine/IncCounterDialogueNode',
  PlayerChoice = '/EE/Types/Engine/PlayerChoiceDialogueNode',
  ResetBoolean = '/EE/Types/Engine/ResetBooleanDialogueNode',
  SetBoolean = '/EE/Types/Engine/SetBooleanDialogueNode',
  SpecialCompletion = '/EE/Types/Engine/SpecialCompletionDialogueNode',
  Start = '/EE/Types/Engine/StartDialogueNode',
}
