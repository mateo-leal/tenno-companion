import {
  DialogueNode,
  Node,
  PlayerChoiceDialogueNode,
  SimulationState,
} from '.'

/** Simulation initial state and configuration options */
export type TraversalOptions = {
  initialState?: SimulationState
}

export type HydratedDataOptions = {
  locale?: string
}

export type PathOptimizationOptions = {
  state?: SimulationState
  avoidableBooleans: string[] // Booleans that make a path "worse"
  positiveRomanceBooleans: string[] // Booleans indicating successful romance
  negativeRomanceBooleans: string[] // Booleans indicating romance failure
}

export type SimulationTracking = {
  /** Tracking information for checks */
  checks: {
    /** Names of booleans checked */
    booleans: Set<string>
    /** Names of counters checked */
    counters: Set<string>
  }
  /** Tracking information for mutations */
  mutations: {
    /** Cumulative chemistry */
    chemistry: number
    /** Names of booleans set to true */
    set: Set<string>
    /** Names of booleans set to false */
    reset: Set<string>
    /**
     * Amounts each counter was incremented by.
     * The amount can be negative if the counter was decremented.
     */
    increments: {
      [x: string]: number
    }
  }
}
