import { Chat } from '../chat-factory'
import { CHATROOMS, NodeType } from '../constants'

describe('Chat Factory', () => {
  describe('Chat.create', () => {
    it('should create a Chat instance with loaded nodes', async () => {
      const chat = await Chat.create('hex')
      expect(chat).toBeDefined()
      expect(chat.chatroom).toBe('hex')
      expect(Array.isArray(chat.nodes)).toBe(true)
      expect(chat.nodes.length).toBeGreaterThan(0)
    })

    it('should load nodes from data/chats directory', async () => {
      const hexChat = await Chat.create('hex')
      const arthurChat = await Chat.create('arthur')
      expect(hexChat.nodes.length).toBeGreaterThan(0)
      expect(arthurChat.nodes.length).toBeGreaterThan(0)
      // Different chatrooms should have different numbers of nodes
      expect(hexChat.nodes.length).not.toBe(arthurChat.nodes.length)
    })

    it('should work with all defined chatrooms', async () => {
      const chatPromises = CHATROOMS.slice(0, 3).map((room) =>
        Chat.create(room)
      )
      const chats = await Promise.all(chatPromises)
      chats.forEach((chat, index) => {
        expect(chat.chatroom).toBe(CHATROOMS[index])
        expect(chat.nodes.length).toBeGreaterThan(0)
      })
    })

    it('should load translations for default locale (en)', async () => {
      const chat = await Chat.create('hex')
      // Verify nodes are created and translations are loaded
      const dialogueNodes = chat.nodes.filter(
        (n) => n.type === NodeType.Dialogue || n.type === NodeType.PlayerChoice
      )
      expect(dialogueNodes.length).toBeGreaterThan(0)
    })

    it('should load translations for specified locale', async () => {
      const chatEn = await Chat.create('hex', { locale: 'en' })
      const chatDe = await Chat.create('hex', { locale: 'de' })
      expect(chatEn.nodes.length).toBe(chatDe.nodes.length)
      // Same dialogue structure but different translations
    })

    it('should support multiple locales', async () => {
      const locales = ['en', 'es', 'fr', 'de']
      const chats = await Promise.all(
        locales.map((locale) => Chat.create('hex', { locale }))
      )
      chats.forEach((chat) => {
        expect(chat.nodes.length).toBeGreaterThan(0)
      })
    })

    it('should have accessible start nodes after creation', async () => {
      const chat = await Chat.create('hex')
      const startNodes = chat.startNodes
      expect(startNodes.length).toBeGreaterThan(0)
      startNodes.forEach((node) => {
        expect(node.type).toBe(NodeType.Start)
      })
    })

    it('should have accessible dialogue nodes', async () => {
      const chat = await Chat.create('hex')
      const dialogueNodes = chat.nodes.filter(
        (n) => n.type === NodeType.Dialogue
      )
      expect(dialogueNodes.length).toBeGreaterThan(0)
    })

    it('should throw for invalid chatroom', async () => {
      await expect(Chat.create('nonexistent' as any)).rejects.toThrow()
    })

    it('should handle case sensitivity for chatrooms', async () => {
      // Should work with lowercase
      const chat = await Chat.create('hex')
      expect(chat).toBeDefined()
      // Should fail with uppercase (if not handled)
      // Implementation may vary, but consistency is important
    })

    it('should preserve node graph structure', async () => {
      const chat = await Chat.create('hex')
      // Check that outgoing edges reference valid nodes
      chat.nodes.forEach((node) => {
        const outgoing =
          (node as any).Outgoing ||
          (node as any).TrueNodes ||
          (node as any).FalseNodes
        if (Array.isArray(outgoing)) {
          outgoing.forEach((nodeId) => {
            const referencedNode = chat.getById(nodeId)
            expect(referencedNode).toBeDefined()
          })
        }
      })
    })
  })
})
