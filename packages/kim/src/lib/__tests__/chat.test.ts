import { Chat } from '../chat'
import { NodeType } from '../constants'
import type {
  StartDialogueNode,
  DialogueNode,
  EndDialogueNode,
  Node,
} from '../../types'

describe('Chat', () => {
  const mockNodes: Node[] = [
    {
      type: NodeType.Start,
      Id: 0,
      Content: 'Start',
      Outgoing: [1],
    } as StartDialogueNode,
    {
      type: NodeType.Dialogue,
      Id: 1,
      Incoming: [0],
      Outgoing: [2],
      LocTag: 'some.key',
    } as DialogueNode,
    {
      type: NodeType.Dialogue,
      Id: 2,
      Incoming: [1],
      Outgoing: [3],
      LocTag: 'another.key',
    } as DialogueNode,
    {
      type: NodeType.End,
      Id: 3,
      Incoming: [2],
    } as EndDialogueNode,
  ]

  describe('constructor', () => {
    it('should initialize with chatroom and nodes', () => {
      const chat = new Chat('hex', mockNodes)
      expect(chat.chatroom).toBe('hex')
      expect(chat.nodes).toEqual(mockNodes)
    })

    it('should store the exact nodes provided', () => {
      const chat = new Chat('arthur', mockNodes)
      expect(chat.nodes).toHaveLength(4)
    })
  })

  describe('getById', () => {
    it('should return a node by its ID', () => {
      const chat = new Chat('hex', mockNodes)
      const node = chat.getById(1)
      expect(node?.Id).toBe(1)
      expect(node?.type).toBe(NodeType.Dialogue)
    })

    it('should return undefined for non-existent IDs', () => {
      const chat = new Chat('hex', mockNodes)
      expect(chat.getById(999)).toBeUndefined()
    })

    it('should handle ID 0', () => {
      const chat = new Chat('hex', mockNodes)
      const node = chat.getById(0)
      expect(node?.type).toBe(NodeType.Start)
    })
  })

  describe('startNodes getter', () => {
    it('should return all Start type nodes', () => {
      const extendedNodes = [
        ...mockNodes,
        {
          type: NodeType.Start,
          Id: 10,
          Outgoing: [11],
        } as StartDialogueNode,
      ]
      const chat = new Chat('hex', extendedNodes)
      const starts = chat.startNodes
      expect(starts).toHaveLength(2)
      expect(starts.every((n) => n.type === NodeType.Start)).toBe(true)
    })

    it('should return empty array if no start nodes', () => {
      const noStartNodes = mockNodes.filter((n) => n.type !== NodeType.Start)
      const chat = new Chat('hex', noStartNodes)
      expect(chat.startNodes).toHaveLength(0)
    })
  })

  describe('filter', () => {
    it('should filter nodes by type', () => {
      const chat = new Chat('hex', mockNodes)
      const dialogues = chat.filter((n) => n.type === NodeType.Dialogue)
      expect(dialogues).toHaveLength(2)
      expect(dialogues.every((n) => n.type === NodeType.Dialogue)).toBe(true)
    })

    it('should filter nodes by custom predicate', () => {
      const chat = new Chat('hex', mockNodes)
      const filtered = chat.filter((n): n is Node => n.Id > 1)
      expect(filtered).toHaveLength(2)
      expect(filtered.map((n) => n.Id)).toEqual([2, 3])
    })

    it('should return empty array for no matches', () => {
      const chat = new Chat('hex', mockNodes)
      const filtered = chat.filter((n): n is Node => n.Id > 100)
      expect(filtered).toHaveLength(0)
    })

    it('should maintain type safety', () => {
      const chat = new Chat('hex', mockNodes)
      const dialogues = chat.filter(
        (n) => n.type === NodeType.Dialogue
      ) as DialogueNode[]
      dialogues.forEach((n) => {
        // Should be able to access DialogueNode specific properties
        expect(n.LocTag).toBeDefined()
      })
    })
  })
})
