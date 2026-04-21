import { Chat } from '../chat-factory'
import { Simulation } from '../simulation'
import { PathSelector } from '../path-selector'

describe('Smoke Tests', () => {
  it('should load a chatroom and generate paths', async () => {
    const chat = await Chat.create('hex')
    expect(chat).toBeDefined()
    expect(chat.nodes.length).toBeGreaterThan(0)

    const sim = new Simulation(chat)
    const startNode = chat.startNodes[0]!
    const paths = sim.getPaths(startNode)

    expect(paths.length).toBeGreaterThan(0)
  })

  it('should optimize paths after simulation', async () => {
    const chat = await Chat.create('hex')
    const sim = new Simulation(chat)
    const paths = sim.getPaths(chat.startNodes[0]!)
    const optimized = PathSelector.selectBestPaths(paths)

    expect(optimized.bestGeneral).toBeDefined()
  })

  it('should work with different locales', async () => {
    const chatEn = await Chat.create('hex', { locale: 'en' })
    const chatEs = await Chat.create('hex', { locale: 'es' })

    const simEn = new Simulation(chatEn)
    const simEs = new Simulation(chatEs)

    const pathsEn = simEn.getPaths(chatEn.startNodes[0]!)
    const pathsEs = simEs.getPaths(chatEs.startNodes[0]!)

    expect(pathsEn.length).toBeGreaterThan(0)
    expect(pathsEs.length).toBeGreaterThan(0)
  })
})
