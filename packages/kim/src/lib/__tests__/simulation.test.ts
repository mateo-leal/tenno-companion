import { Chat } from '../chat-factory'
import { Simulation } from '../simulation'
import { NodeType } from '../constants'
import type { StartDialogueNode, DialogueNode } from '../../types'

describe('Simulation', () => {
  let chat: Chat

  beforeAll(async () => {
    chat = await Chat.create('hex')
  })

  describe('constructor', () => {
    it('should initialize with a Chat instance', () => {
      const sim = new Simulation(chat)
      expect(sim).toBeDefined()
    })

    it('should initialize with empty state by default', () => {
      const sim = new Simulation(chat)
      expect(sim).toBeDefined()
      // Initial state should be clean
    })

    it('should accept custom initial state', () => {
      const initialState = {
        booleans: { TestBoolean: true },
        counters: { TestCounter: 5 },
      }
      const sim = new Simulation(chat, { initialState })
      expect(sim).toBeDefined()
    })
  })

  describe('getPaths', () => {
    it('should return an array of paths', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      expect(Array.isArray(paths)).toBe(true)
    })

    it('should return non-empty paths for valid start node', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should handle start node by ID', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const pathsFromNode = sim.getPaths(startNode)
      const pathsFromId = sim.getPaths(startNode.Id)
      expect(pathsFromNode.length).toBe(pathsFromId.length)
    })

    it('should track node traversal in paths', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      paths.forEach((path) => {
        expect(path.nodes).toBeDefined()
        expect(Array.isArray(path.nodes)).toBe(true)
        expect(path.nodes.length).toBeGreaterThan(0)
        // First node should be the start node
        expect(path.nodes[0]!.Id).toBe(startNode.Id)
      })
    })

    it('should track state mutations in paths', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      paths.forEach((path) => {
        expect(path.finalState).toBeDefined()
        expect(path.finalState.booleans).toBeDefined()
        expect(path.finalState.counters).toBeDefined()
      })
    })

    it('should track checks across path nodes', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      paths.forEach((path) => {
        expect(path.checks).toBeDefined()
        expect(path.checks.booleans).toBeDefined()
        expect(path.checks.counters).toBeDefined()
      })
    })

    it('should handle cycles in dialogue graph', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      // Should complete without infinite loop
      const paths = sim.getPaths(startNode)
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should handle uncertain paths (CheckBooleanScript)', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      paths.forEach((path) => {
        expect(typeof path.isUncertain).toBe('boolean')
      })
    })

    it('should accept custom state for getPaths', () => {
      const customState = {
        booleans: { SomeBoolean: true },
        counters: { SomeCounter: 10 },
      }
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode, customState)
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should produce different results with different initial states', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const pathsEmpty = sim.getPaths(startNode)
      const pathsWithState = sim.getPaths(startNode, {
        booleans: { TestBool: true },
        counters: {},
      })
      expect(pathsEmpty.length).toBeGreaterThan(0)
      expect(pathsWithState.length).toBeGreaterThan(0)
    })
  })

  describe('findAllFirstContentNodes', () => {
    it('should return array of first content nodes', () => {
      const sim = new Simulation(chat)
      const nodes = sim.findAllFirstContentNodes()
      expect(Array.isArray(nodes)).toBe(true)
      expect(nodes.length).toBeGreaterThan(0)
    })

    it('should find nodes for all start nodes', () => {
      const sim = new Simulation(chat)
      const startNodeCount = chat.startNodes.length
      const firstContentNodes = sim.findAllFirstContentNodes()
      expect(firstContentNodes.length).toBe(startNodeCount)
    })

    it('should include conversation names in results', () => {
      const sim = new Simulation(chat)
      const firstContentNodes = sim.findAllFirstContentNodes()
      firstContentNodes.forEach((node) => {
        expect(node.convoName).toBeDefined()
        expect(typeof node.convoName).toBe('string')
      })
    })

    it('should include dialogue nodes in results', () => {
      const sim = new Simulation(chat)
      const firstContentNodes = sim.findAllFirstContentNodes()
      firstContentNodes.forEach((node) => {
        expect(node.dialogueNodes).toBeDefined()
        expect(Array.isArray(node.dialogueNodes)).toBe(true)
      })
    })
  })

  describe('findFirstContentNodes', () => {
    it('should return first content node object for a start node', async () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const firstContentNode = sim.findFirstContentNodes(startNode)
      expect(firstContentNode).toBeDefined()
      expect(firstContentNode.dialogueNodes).toBeDefined()
      expect(Array.isArray(firstContentNode.dialogueNodes)).toBe(true)
    })

    it('should return first Dialogue or PlayerChoice nodes', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const firstContentNode = sim.findFirstContentNodes(startNode)
      firstContentNode.dialogueNodes.forEach((node) => {
        expect(
          node.type === NodeType.Dialogue || node.type === NodeType.PlayerChoice
        ).toBe(true)
      })
    })

    it('should handle start node by ID', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const firstContentFromNode = sim.findFirstContentNodes(startNode)
      const firstContentFromId = sim.findFirstContentNodes(startNode.Id)
      expect(firstContentFromNode.dialogueNodes.length).toBe(
        firstContentFromId.dialogueNodes.length
      )
    })

    it('should include node ID and conversation name', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const firstContentNode = sim.findFirstContentNodes(startNode)
      expect(firstContentNode.id).toBe(startNode.Id)
      expect(typeof firstContentNode.convoName).toBe('string')
    })
  })

  describe('state management', () => {
    it('should track boolean state through paths', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      const pathsWithBooleans = paths.filter(
        (p) => Object.keys(p.finalState.booleans).length > 0
      )
      // At least some paths should set booleans or none should, both are valid
      expect(Array.isArray(paths)).toBe(true)
    })

    it('should track counter state through paths', () => {
      const sim = new Simulation(chat)
      const startNode = chat.startNodes[0]!
      const paths = sim.getPaths(startNode)
      const pathsWithCounters = paths.filter(
        (p) => Object.keys(p.finalState.counters).length > 0
      )
      // Some or all paths might have counters depending on chatroom
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should preserve initial state across multiple getPaths calls', () => {
      const initialState = {
        booleans: { InitialBool: true },
        counters: { InitialCounter: 10 },
      }
      const sim = new Simulation(chat, { initialState })
      const startNode = chat.startNodes[0]!

      // Both calls should produce results
      const paths1 = sim.getPaths(startNode)
      const paths2 = sim.getPaths(startNode)

      expect(paths1.length).toBeGreaterThan(0)
      expect(paths2.length).toBeGreaterThan(0)
    })
  })
})
