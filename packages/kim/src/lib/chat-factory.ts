import {
  Dictionary,
  SUPPORTED_LANGUAGES,
} from '@tenno-companion/shared/locales'

import { Chat as ChatClient } from './chat'
import { NodeType } from './constants'
import { Chatroom, Node } from '../types'
import { HydratedDataOptions } from '../types/internal'

export class Chat extends ChatClient {
  static async create(chatroom: Chatroom, options: HydratedDataOptions = {}) {
    const nodes = await this.getHydratedData(chatroom, options)
    return new Chat(chatroom, nodes)
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
}
