import {
  Dictionary,
  SUPPORTED_LANGUAGES,
} from '@tenno-companion/shared/locales'
import { Chatroom, Node } from '../types'
import { HydratedDataOptions } from '../types/internal'
import { NodeType } from './constants'

export class Chat {
  private constructor(readonly nodes: Node[]) {}

  static async create(chatroom: Chatroom, options: HydratedDataOptions = {}) {
    const chats = await this.getHydratedData(chatroom, options)
    return new this(chats)
  }

  /**
   * Static helper used by subclasses to fetch and translate data
   */
  private static async getHydratedData(
    chatroom: Chatroom,
    { locale }: HydratedDataOptions = {}
  ) {
    const validLocale =
      locale && Object.keys(SUPPORTED_LANGUAGES).includes(locale)
        ? locale
        : 'en'

    const [rawStats, dict] = await Promise.all([
      import(`../../data/chats/${chatroom}.json`).then(
        (m) => m.default as Node[]
      ),
      import(`../../data/dicts/${validLocale}.json`).then(
        (m) => m.default as Dictionary
      ),
    ])

    return rawStats.map((rawData) => {
      return this.translate(rawData, dict)
    })
  }

  /**
   *
   */
  private static translate(data: Node, dict: Dictionary): Node {
    if (
      data !== null &&
      (data.type === NodeType.Dialogue || data.type === NodeType.PlayerChoice)
    ) {
      if ('Speaker' in data && data.Speaker) {
        return {
          ...data,
          LocTag: dict[data.LocTag] ?? data.LocTag,
          Speaker: dict[data.Speaker] ?? data.Speaker,
        }
      }
      return {
        ...data,
        LocTag: dict[data.LocTag] ?? data.LocTag,
      }
    }

    return data
  }

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
