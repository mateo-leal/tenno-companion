'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Panel } from '@/components/ui/panel'

import { useKIMChat } from '../../providers/kim-chat'
import { DialogueOptionsList } from './dialogue-options-list'
import { DialogueContentPanel } from '../dialogue-content-panel'

export function DialogueSelectorPanel() {
  const t = useTranslations('kim.chatroom')
  const { simulation } = useKIMChat()

  const firstNodesContent = useMemo(
    () => simulation.findAllFirstContentNodes() ?? [],
    [simulation]
  )

  const [selectedStartId, setSelectedStartId] = useState<number | null>(null)

  const selectedOption = useMemo(
    () => firstNodesContent.find((item) => item.id === selectedStartId),
    [firstNodesContent, selectedStartId]
  )

  return (
    <>
      <DialogueOptionsList
        firstNodes={firstNodesContent}
        selectedStartId={selectedStartId}
        onSelect={setSelectedStartId}
      />

      {selectedOption ? (
        <div>
          <DialogueContentPanel option={selectedOption} />
        </div>
      ) : (
        <Panel className="h-full flex justify-center items-center">
          {t('selectDialogue')}
        </Panel>
      )}
    </>
  )
}
