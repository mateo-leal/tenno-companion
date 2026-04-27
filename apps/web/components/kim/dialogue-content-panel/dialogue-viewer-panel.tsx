import type {
  DialogueContentNode,
  DialoguePath,
  Node,
} from '@tenno-companion/kim/types'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { NodeType } from '@tenno-companion/kim/constants'

import { Panel } from '@/components/ui/panel'
import { Button } from '@/components/ui/button'
import { useKIMChat } from '@/components/providers/kim-chat'

import { ChatLine } from './chat-line'
import { SystemChatLine } from './system-chat-line'

function isDialogueNode(node: Node): node is DialogueContentNode {
  return (
    (node.type === NodeType.Dialogue || node.type === NodeType.PlayerChoice) &&
    node.LocTag !== undefined
  )
}

type Props = {
  dialoguePath: DialoguePath
}

export function DialogueViewerPanel({ dialoguePath }: Props) {
  const t = useTranslations()
  const {
    chatroom,
    updateBooleans,
    updateChemistry,
    updateCompletedDialogue,
    updateCounters,
  } = useKIMChat()
  const [isPending, startTransition] = useTransition()
  const [showBooleanUpdateNotice, setShowBooleanUpdateNotice] = useState(false)

  const handleUpdateGameState = () => {
    startTransition(() => {
      updateBooleans(dialoguePath.finalState.booleans)
      updateChemistry(chatroom, dialoguePath.mutations.chemistry)
      updateCounters(dialoguePath.finalState.counters)

      const startNode = dialoguePath.nodes.find(
        (node) => node.type === NodeType.Start
      )

      if (startNode) {
        const nodes = dialoguePath.nodes.map((node) => node.Id)
        updateCompletedDialogue(startNode.Content, nodes)
      }
      setShowBooleanUpdateNotice(true)
    })
  }

  return (
    <Panel className="space-y-2">
      {dialoguePath.nodes.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {dialoguePath.nodes.map((node, index) => (
            <li key={`${node.Id}-${index}`}>
              {isDialogueNode(node) ? (
                <ChatLine node={node} />
              ) : (
                <SystemChatLine node={node} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('kim.chatroom.noDialogueTextAvailable')}</p>
      )}

      {showBooleanUpdateNotice ? (
        <p className="border border-success-border bg-success-bg px-2 py-1 text-sm text-success">
          {t('kim.chatroom.booleanUpdated')}
        </p>
      ) : (
        <>
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleUpdateGameState}
            disabled={isPending}
          >
            {isPending
              ? t('ui.loading')
              : t('kim.chatroom.updateBooleanValues')}
          </Button>
          <p className="text-center text-xs">
            {t('kim.chatroom.futureSimulationsNotice')}
          </p>
        </>
      )}
    </Panel>
  )
}
