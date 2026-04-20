import { writeFileSync } from 'fs'
import { Chat } from '../chat'
import { Simulation } from '../simulation'
import { PathSelector } from '../path-selector'

describe('test', () => {
  // it('test', async () => {
  //   const startNodes = {
  //     amir: (await Chat.create('amir', { locale: 'es' })).nodes,
  //     aoi: (await Chat.create('aoi', { locale: 'es' })).nodes,
  //     arthur: (await Chat.create('arthur', { locale: 'es' })).nodes,
  //     eleanor: (await Chat.create('eleanor', { locale: 'es' })).nodes,
  //     flare: (await Chat.create('flare', { locale: 'es' })).nodes,
  //     hex: (await Chat.create('hex', { locale: 'es' })).nodes,
  //     kaya: (await Chat.create('kaya', { locale: 'es' })).nodes,
  //     lettie: (await Chat.create('lettie', { locale: 'es' })).nodes,
  //     loid: (await Chat.create('loid', { locale: 'es' })).nodes,
  //     lyon: (await Chat.create('lyon', { locale: 'es' })).nodes,
  //     marie: (await Chat.create('marie', { locale: 'es' })).nodes,
  //     minerva: (await Chat.create('minerva', { locale: 'es' })).nodes,
  //     'minerva-velimir': (
  //       await Chat.create('minerva-velimir', { locale: 'es' })
  //     ).nodes,
  //     quincy: (await Chat.create('quincy', { locale: 'es' })).nodes,
  //     roathe: (await Chat.create('roathe', { locale: 'es' })).nodes,
  //     velimir: (await Chat.create('velimir', { locale: 'es' })).nodes,
  //   }

  //   Object.entries(startNodes).forEach(([chatroom, nodes]) => {
  //     nodes
  //       .filter((node) => node.type === NodeType.CheckCounter)
  //       .forEach((node) => {
  //         // console.log(chatroom, node.Id, node.Outgoing.length)
  //         node.Outputs.forEach((output) => {
  //           console.log(chatroom, node.Id)
  //           expect(output.CompareOperators.includes(5)).toBe(false)
  //         })
  //       })
  //   })
  // })

  it('simulate path', async () => {
    const startTimestamp = Date.now()
    const chat = await Chat.create('hex', { locale: 'es' })
    const sim = new Simulation(chat)

    // const startingNode = chat.nodes.find(
    //   (node) => node.Id === 77
    // ) as StartDialogueNode

    // const paths = sim.getPaths(startingNode)

    // const selectedPaths = PathSelector.getChecks(paths)

    const selectedPaths = sim.getPaths(0)
    // const checks = PathSelector.getChecks(selectedPaths)
    const endTimestamp = Date.now()

    console.log(endTimestamp - startTimestamp)

    // Write the paths to a JSON file for inspection
    writeFileSync(
      'src/lib/__tests__/paths.json',
      JSON.stringify(selectedPaths, null, 2)
    )
  })
})
