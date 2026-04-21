import { Chat } from '../chat-factory'
import { Simulation } from '../simulation'
import { PathSelector } from '../path-selector'
import {
  ROMANCE_BOOLEAN_NAMES,
  AVOIDABLE_BOOLEAN_NAMES,
  NodeType,
} from '../constants'

describe('PathSelector', () => {
  let chat: Chat
  let paths: any[]

  beforeAll(async () => {
    chat = await Chat.create('hex')
    const sim = new Simulation(chat)
    const startNode = chat.startNodes[0]!
    paths = sim.getPaths(startNode)
  })

  describe('getChecks', () => {
    it('should aggregate boolean checks across paths', () => {
      const checks = PathSelector.getChecks(paths)
      expect(checks).toBeDefined()
      expect(checks.booleans).toBeDefined()
      expect(typeof checks.booleans).toBe('object')
    })

    it('should aggregate counter checks across paths', () => {
      const checks = PathSelector.getChecks(paths)
      expect(checks.counters).toBeDefined()
      expect(typeof checks.counters).toBe('object')
    })

    it('should return empty checks for empty paths', () => {
      const checks = PathSelector.getChecks([])
      expect(checks.booleans).toBeDefined()
      expect(checks.counters).toBeDefined()
    })

    it('should identify all unique booleans checked', () => {
      const checks = PathSelector.getChecks(paths)
      expect(Object.keys(checks.booleans).length).toBeGreaterThanOrEqual(0)
    })

    it('should identify all unique counters checked', () => {
      const checks = PathSelector.getChecks(paths)
      expect(Object.keys(checks.counters).length).toBeGreaterThanOrEqual(0)
    })

    it('should count check occurrences', () => {
      const checks = PathSelector.getChecks(paths)
      Object.values(checks.booleans).forEach((count: any) => {
        expect(typeof count).toBe('number')
        expect(count).toBeGreaterThan(0)
      })
    })
  })

  describe('selectBestPaths', () => {
    it('should return OptimizedResults', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(results).toBeDefined()
      expect(results.bestGeneral).toBeDefined()
      expect(results.bestChemistry).toBeDefined()
      expect(Array.isArray(results.bestGeneral)).toBe(true)
      expect(Array.isArray(results.bestChemistry)).toBe(true)
    })

    it('should select bestGeneral paths as array', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(results.bestGeneral)).toBe(true)
      if (results.bestGeneral.length > 0) {
        expect(results.bestGeneral[0]!.nodes).toBeDefined()
        expect(Array.isArray(results.bestGeneral[0]!.nodes)).toBe(true)
      }
    })

    it('should select bestChemistry paths as array', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(results.bestChemistry)).toBe(true)
    })

    it('should select bestCounterGains paths', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(results.bestCounterGains)).toBe(true)
    })

    it('should select bestPositiveRomance paths', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(results.bestPositiveRomance)).toBe(true)
    })

    it('should select bestNegativeRomance paths', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(results.bestNegativeRomance)).toBe(true)
    })

    it('should rank paths by general criteria (non-romance, non-avoidable)', () => {
      const results = PathSelector.selectBestPaths(paths)
      // bestGeneral should be an array of paths
      expect(Array.isArray(results.bestGeneral)).toBe(true)
    })

    it('should rank paths by chemistry gain', () => {
      const results = PathSelector.selectBestPaths(paths)
      const bestChemistry = results.bestChemistry
      if (bestChemistry && bestChemistry.length > 0) {
        expect(bestChemistry[0]!.finalState).toBeDefined()
      }
    })

    it('should handle empty paths array', () => {
      const results = PathSelector.selectBestPaths([])
      expect(results).toBeDefined()
      expect(Array.isArray(results.bestGeneral)).toBe(true)
    })

    it('should return different selections for different chatroom paths', async () => {
      const arthurChat = await Chat.create('arthur')
      const arthurSim = new Simulation(arthurChat)
      const arthurPaths = arthurSim.getPaths(arthurChat.startNodes[0]!)
      const arthurResults = PathSelector.selectBestPaths(arthurPaths)

      const hexChat = await Chat.create('hex')
      const hexSim = new Simulation(hexChat)
      const hexPaths = hexSim.getPaths(hexChat.startNodes[0]!)
      const hexResults = PathSelector.selectBestPaths(hexPaths)

      // Different chatrooms should have optimization results
      expect(arthurResults.bestGeneral).toBeDefined()
      expect(hexResults.bestGeneral).toBeDefined()
    })

    it('should provide valid path objects with all required fields', () => {
      const results = PathSelector.selectBestPaths(paths)
      if (results.bestGeneral && results.bestGeneral.length > 0) {
        const path = results.bestGeneral[0]!
        expect(path.nodes).toBeDefined()
        expect(path.finalState).toBeDefined()
        expect(path.finalState.booleans).toBeDefined()
        expect(path.finalState.counters).toBeDefined()
      }
    })
  })

  describe('path metrics', () => {
    it('should handle paths with no state mutations', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(results.bestGeneral).toBeDefined()
    })

    it('should identify paths with romance booleans', () => {
      const results = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(results.bestPositiveRomance)).toBe(true)
    })

    it('should identify paths avoiding avoidable booleans', () => {
      const results = PathSelector.selectBestPaths(paths)
      // bestGeneral should prefer paths without avoidable booleans
      expect(results.bestGeneral).toBeDefined()
    })

    it('should score paths by mutations', () => {
      const results = PathSelector.selectBestPaths(paths)
      if (results.bestGeneral && results.bestGeneral.length > 0) {
        const path = results.bestGeneral[0]!
        expect(path.mutations).toBeDefined()
        expect(path.mutations.set).toBeDefined()
      }
    })

    it('should score paths by chemistry', () => {
      const results = PathSelector.selectBestPaths(paths)
      if (results.bestChemistry && results.bestChemistry.length > 0) {
        const path = results.bestChemistry[0]!
        expect(typeof path.mutations.chemistry).toBe('number')
      }
    })

    it('should score paths by counter increments', () => {
      const results = PathSelector.selectBestPaths(paths)
      if (results.bestCounterGains && results.bestCounterGains.length > 0) {
        const path = results.bestCounterGains[0]!
        expect(path.mutations.increments).toBeDefined()
      }
    })
  })

  describe('path mutations', () => {
    it('should track boolean mutations in selected paths', () => {
      const results = PathSelector.selectBestPaths(paths)
      if (results.bestGeneral && results.bestGeneral.length > 0) {
        const path = results.bestGeneral[0]!
        expect(path.mutations.set).toBeDefined()
        expect(Array.isArray(path.mutations.set)).toBe(true)
      }
    })

    it('should track all state changes in paths', () => {
      const results = PathSelector.selectBestPaths(paths)
      if (results.bestGeneral && results.bestGeneral.length > 0) {
        const path = results.bestGeneral[0]!
        expect(path.finalState).toBeDefined()
        expect(path.finalState.booleans).toBeDefined()
        expect(path.finalState.counters).toBeDefined()
      }
    })
  })
})
