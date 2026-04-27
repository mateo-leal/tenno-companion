'use client'

import type {
  DialoguePath,
  FirstContentNode,
  OptimizedResults,
  SimulationState,
} from '@tenno-companion/kim/types'
import { logger } from '@sentry/nextjs'
import { useLocale, useTranslations } from 'next-intl'
import { CaretLeftIcon } from '@phosphor-icons/react'
import { useEffect, useState, useTransition } from 'react'

import { Panel } from '@/components/ui/panel'
import { Button } from '@/components/ui/button'

import { useKIMChat } from '../../providers/kim-chat'
import { SimulationChecks } from './simulation-checks'
import { SimulationLoadingState } from './loading-state'
import { DialogueViewerPanel } from './dialogue-viewer-panel'
import { PreferredPathSelectorPanel } from './preferred-path-panel'

type Props = {
  option: FirstContentNode
}

export function DialogueContentPanel({ option }: Props) {
  const locale = useLocale()
  const t = useTranslations('kim.chatroom')
  const { chatroom, gameState } = useKIMChat()

  const [isPending, startTransition] = useTransition()
  const [activeDialoguePath, setActiveDialoguePath] = useState<DialoguePath>()

  const [customState, setCustomState] = useState<SimulationState>({
    booleans: gameState.booleans,
    counters: gameState.counters,
  })

  const [checks, setChecks] = useState<{
    booleans: string[]
    counters: string[]
  } | null>(null)

  const [optimizedResults, setOptimizedResults] =
    useState<OptimizedResults | null>(null)

  const label = option.dialogueNodes.map((node) => node.LocTag).join('/')

  useEffect(() => {
    const controller = new AbortController()

    startTransition(async () => {
      try {
        // Reset results when starting a new fetch
        setChecks(null)
        setOptimizedResults(null)

        const searchParams = new URLSearchParams({
          locale,
          startNodeId: String(option.id),
          state: JSON.stringify(customState),
        })

        const response = await fetch(
          `/api/simulate/${chatroom}?${searchParams.toString()}`,
          { signal: controller.signal }
        )

        if (!response.ok) throw new Error('Failed to fetch simulation')

        const data = await response.json()

        setChecks(data.checks)
        setOptimizedResults(data.optimizedResults)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          logger.error('Simulation fetch error:', err)
        }
      }
    })

    return () => controller.abort()
  }, [chatroom, customState, locale, option.id])

  useEffect(() => {
    setActiveDialoguePath(undefined)
  }, [option])

  return (
    <Panel
      as="section"
      className="min-h-0 h-full flex flex-col space-y-2 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-1">
        {activeDialoguePath && (
          <Button
            variant="ghost"
            onClick={() => setActiveDialoguePath(undefined)}
            className="size-7 p-0 animate-in fade-in slide-in-from-left-4 duration-200"
          >
            <CaretLeftIcon className="size-5" />
          </Button>
        )}
        <p className="font-title text-xl text-primary">{label}</p>
      </div>

      <div className="relative flex-1 overflow-y-auto px-1">
        {activeDialoguePath === undefined && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-forwards">
            {isPending && <SimulationLoadingState />}
            {!isPending && checks && optimizedResults && (
              <>
                <SimulationChecks
                  checks={checks}
                  customState={customState}
                  setCustomState={setCustomState}
                />
                <PreferredPathSelectorPanel
                  optimizedResults={optimizedResults}
                  setActiveDialoguePath={setActiveDialoguePath}
                />
              </>
            )}

            {!isPending && !checks && (
              <div className="text-center py-10 text-error">
                {t('simulationFailed')}
              </div>
            )}
          </div>
        )}
        {activeDialoguePath !== undefined && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-300 fill-mode-forwards">
            <DialogueViewerPanel dialoguePath={activeDialoguePath} />
          </div>
        )}
      </div>
    </Panel>
  )
}
