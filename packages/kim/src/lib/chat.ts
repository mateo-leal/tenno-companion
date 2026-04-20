import { Chatroom, Node } from '../types'
import { NodeType } from './constants'

export class Chat {
  constructor(
    readonly chatroom: Chatroom,
    readonly nodes: Node[]
  ) {}

  filter<S extends Node>(predicate: (item: Node) => item is S): S[]
  filter(predicate: (item: Node) => boolean): Node[] {
    const results: Node[] = []
    for (const chat of Object.values(this.nodes)) {
      if (predicate(chat)) results.push(chat)
    }
    return results
  }

  getById(id: number) {
    return this.nodes.find((chat) => chat.Id === id)
  }

  get startNodes() {
    return this.nodes.filter((node) => node.type === NodeType.Start)
  }
}
