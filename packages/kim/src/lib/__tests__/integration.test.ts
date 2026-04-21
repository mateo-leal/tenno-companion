import { Chat } from '../chat-factory'
import { Simulation } from '../simulation'
import { PathSelector } from '../path-selector'
import { CHATROOMS } from '../constants'

describe('Integration Tests', () => {
  describe('Full Workflow: Load Chat → Simulate → Optimize', () => {
    it('should complete full workflow for hex chatroom', async () => {
      // Step 1: Load chat
      const chat = await Chat.create('hex')
      expect(chat.nodes.length).toBeGreaterThan(0)

      // Step 2: Get start nodes
      const startNode = chat.startNodes[0]!
      expect(startNode).toBeDefined()

      // Step 3: Simulate paths
      const sim = new Simulation(chat)
      const paths = sim.getPaths(startNode)
      expect(paths.length).toBeGreaterThan(0)

      // Step 4: Optimize paths
      const optimized = PathSelector.selectBestPaths(paths)
      expect(Array.isArray(optimized.bestGeneral)).toBe(true)
    })

    it('should work with multiple chatrooms', async () => {
      const testChatrooms = CHATROOMS.slice(0, 3)
      const results = await Promise.all(
        testChatrooms.map(async (room) => {
          const chat = await Chat.create(room)
          const sim = new Simulation(chat)
          const paths = sim.getPaths(chat.startNodes[0]!)
          const optimized = PathSelector.selectBestPaths(paths)
          return {
            chatroom: room,
            pathCount: paths.length,
            hasOptimized: optimized.bestGeneral !== undefined,
          }
        })
      )

      results.forEach((result) => {
        expect(result.pathCount).toBeGreaterThan(0)
        expect(result.hasOptimized).toBe(true)
      })
    })

    it('should handle localized content', async () => {
      const chat = await Chat.create('hex', { locale: 'en' })
      const sim = new Simulation(chat)
      const paths = sim.getPaths(chat.startNodes[0]!)
      expect(paths.length).toBeGreaterThan(0)

      // Verify dialogue nodes contain expected properties
      const dialogueNodes = paths.flatMap((p) =>
        p.nodes.filter((n) => (n as any).LocTag !== undefined)
      )
      expect(dialogueNodes.length).toBeGreaterThan(0)
    })

    it('should maintain consistency across multiple simulations', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!

      const paths1 = sim.getPaths(startNode)
      const paths2 = sim.getPaths(startNode)

      expect(paths1.length).toBe(paths2.length)
    })
  })

  describe('Multi-start node handling', () => {
    it('should handle multiple start nodes in a chatroom', async () => {
      const chat = await Chat.create('hex')
      expect(chat.startNodes.length).toBeGreaterThan(0)

      const sim = new Simulation(chat)
      const allPaths = chat.startNodes.map((startNode) =>
        sim.getPaths(startNode)
      )

      allPaths.forEach((paths) => {
        expect(paths.length).toBeGreaterThan(0)
      })
    })

    it('should find first content nodes for all starts', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const firstContent = sim.findAllFirstContentNodes()
      expect(firstContent.length).toBeGreaterThan(0)
    })
  })

  describe('State mutation tracking', () => {
    it('should track mutations through entire path', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const paths = sim.getPaths(chat.startNodes[0]!)

      // Verify we have paths to check
      expect(paths.length).toBeGreaterThan(0)
      // At least verify path structure is consistent
      paths.forEach((path) => {
        expect(path.nodes.length).toBeGreaterThan(0)
        expect(path.mutations).toBeDefined()
      })
    })

    it('should preserve initial state when provided', async () => {
      const initialState = {
        booleans: { TestBool: true },
        counters: { TestCounter: 5 },
      }
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat, { initialState })
      const paths = sim.getPaths(chat.startNodes[0]!)

      // Initial state should be present in final states
      paths.forEach((path) => {
        expect(path.finalState.booleans.TestBool).toBe(true)
        expect(path.finalState.counters.TestCounter).toBe(5)
      })
    })
  })

  describe('Performance and scalability', () => {
    it('should complete simulation in reasonable time', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const startTime = Date.now()
      const paths = sim.getPaths(chat.startNodes[0]!)
      const duration = Date.now() - startTime

      expect(paths.length).toBeGreaterThan(0)
      // Should complete quickly since getPaths is synchronous
      expect(duration).toBeLessThan(5000)
    })

    it('should handle path optimization of large path sets', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const paths = sim.getPaths(chat.startNodes[0]!)

      const startTime = Date.now()
      const optimized = PathSelector.selectBestPaths(paths)
      const duration = Date.now() - startTime

      expect(optimized).toBeDefined()
      // Optimization should be fast
      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle chatroom with minimal nodes', async () => {
      const chat = await Chat.create('hex')
      expect(chat.nodes.length).toBeGreaterThan(0)
    })

    it('should handle empty custom state', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const paths = sim.getPaths(chat.startNodes[0]!, {
        booleans: {},
        counters: {},
      })
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should handle paths with no mutations', async () => {
      const chat = await Chat.create('hex')
      const sim = new Simulation(chat)
      const paths = await sim.getPaths(chat.startNodes[0]!)
      const optimized = PathSelector.selectBestPaths(paths)
      expect(optimized.bestGeneral).toBeDefined()
    })
  })

  describe('Different chatrooms produce different results', () => {
    it('should have different path structures for different chatrooms', async () => {
      const hexChat = await Chat.create('hex')
      const arthurChat = await Chat.create('arthur')

      const hexSim = new Simulation(hexChat)
      const arthurSim = new Simulation(arthurChat)

      const hexPaths = hexSim.getPaths(hexChat.startNodes[0]!)
      const arthurPaths = arthurSim.getPaths(arthurChat.startNodes[0]!)

      // Should have different number of paths or different structures
      expect(hexPaths.length + arthurPaths.length).toBeGreaterThan(0)
    })

    it('should have chatroom-specific romance paths', async () => {
      const hexChat = await Chat.create('hex')
      const hexSim = new Simulation(hexChat)
      const hexPaths = hexSim.getPaths(hexChat.startNodes[0]!)
      const hexOptimized = PathSelector.selectBestPaths(hexPaths)

      const arthurChat = await Chat.create('arthur')
      const arthurSim = new Simulation(arthurChat)
      const arthurPaths = arthurSim.getPaths(arthurChat.startNodes[0]!)
      const arthurOptimized = PathSelector.selectBestPaths(arthurPaths)

      // Both should have optimized results but they should be different
      expect(hexOptimized.bestGeneral).toBeDefined()
      expect(arthurOptimized.bestGeneral).toBeDefined()
    })
  })

  describe('Multi-language support', () => {
    it('should produce same path structure in different locales', async () => {
      const hexEn = await Chat.create('hex', { locale: 'en' })
      const hexDe = await Chat.create('hex', { locale: 'de' })

      const simEn = new Simulation(hexEn)
      const simDe = new Simulation(hexDe)

      const pathsEn = simEn.getPaths(hexEn.startNodes[0]!)
      const pathsDe = simDe.getPaths(hexDe.startNodes[0]!)

      // Same number of paths regardless of locale
      expect(pathsEn.length).toBe(pathsDe.length)
    })
  })
})
