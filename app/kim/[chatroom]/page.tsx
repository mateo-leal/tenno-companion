import { DialogueSelectorPanel } from '@/components/dialogue-selector-panel'
import { CHATROOM_SOURCE_BY_ID } from '@/lib/chatrooms'
import { notFound } from 'next/navigation'
import {
  DEFAULT_DICT_SOURCE,
  getBooleanName,
  getConversationName,
  getCounterName,
  loadDictionary,
  loadNodes,
  resolveContent,
  resolveStartNodes,
} from '@/lib/core/pathfinder'
import { Type, type DialogueNode } from '@/lib/types'

const BOOLEAN_CHECK_TYPES = new Set<Type>([
  Type.CheckBooleanDialogueNode,
  Type.CheckBooleanScriptDialogueNode,
  Type.CheckMultiBooleanDialogueNode,
])

type SimulationRequirements = {
  booleans: string[]
  counters: Array<{
    name: string
    expressions: string[]
  }>
}

export async function generateStaticParams() {
  return Object.keys(CHATROOM_SOURCE_BY_ID).map((id) => ({ chatroom: id }))
}

function collectSimulationRequirements(
  byId: Map<number, DialogueNode>,
  startId: number
): SimulationRequirements {
  const visited = new Set<number>()
  const queue: number[] = [startId]
  const booleans = new Set<string>()
  const counters = new Map<string, Set<string>>()

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (typeof currentId !== 'number' || visited.has(currentId)) {
      continue
    }

    visited.add(currentId)
    const node = byId.get(currentId)
    if (!node) {
      continue
    }

    if (BOOLEAN_CHECK_TYPES.has(node.type)) {
      booleans.add(getBooleanName(node))
    }

    if (node.type === Type.CheckCounterDialogueNode) {
      const counterName = getCounterName(node)
      const values = counters.get(counterName) ?? new Set<string>()
      for (const output of node.Outputs ?? []) {
        const expression = output.Expression?.trim()
        if (expression) {
          values.add(expression)
        }
      }
      counters.set(counterName, values)
    }

    for (const nextId of node.Outgoing ?? []) {
      if (!visited.has(nextId)) {
        queue.push(nextId)
      }
    }

    for (const nextId of node.TrueNodes ?? []) {
      if (!visited.has(nextId)) {
        queue.push(nextId)
      }
    }

    for (const nextId of node.FalseNodes ?? []) {
      if (!visited.has(nextId)) {
        queue.push(nextId)
      }
    }

    for (const output of node.Outputs ?? []) {
      for (const nextId of output.Outgoing ?? []) {
        if (!visited.has(nextId)) {
          queue.push(nextId)
        }
      }
    }
  }

  return {
    booleans: [...booleans].sort((a, b) => a.localeCompare(b)),
    counters: [...counters.entries()]
      .map(([name, expressions]) => ({
        name,
        expressions: [...expressions],
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }
}

export default async function Page({ params }: PageProps<'/kim/[chatroom]'>) {
  const { chatroom } = await params
  const source = CHATROOM_SOURCE_BY_ID[chatroom]

  if (!source) {
    notFound()
  }

  const [nodes, dictionary] = await Promise.all([
    loadNodes(source),
    loadDictionary(DEFAULT_DICT_SOURCE).catch(() => new Map<string, string>()),
  ])

  const startNodes = resolveStartNodes(nodes)
  const byId = new Map<number, DialogueNode>(
    nodes.map((node) => [node.Id, node])
  )

  const dialogueOptions = startNodes.map((startNode, index) => {
    const fallbackName = getConversationName(source, startNode)
    const label =
      typeof startNode.Content === 'string' && startNode.Content.length > 0
        ? resolveContent(startNode.Content, dictionary)
        : fallbackName

    return {
      option: index + 1,
      id: startNode.Id,
      label,
    }
  })

  const requirementsByStartId = Object.fromEntries(
    startNodes.map((startNode) => [
      String(startNode.Id),
      collectSimulationRequirements(byId, startNode.Id),
    ])
  )

  return (
    <article className="kim-window relative z-10 mt-20 ml-auto flex h-[58svh] w-full max-w-220 flex-col md:mt-16 md:mr-10 md:h-[65svh]">
      <header className="window-titlebar">
        <p className="window-title capitalize">{chatroom}.dialogue</p>
      </header>

      <div className="window-content flex min-h-0 flex-1 flex-col border-t border-[#8f5d1f] bg-[#040404] p-2 sm:p-3">
        <div className="border border-[#8f5d1f] bg-[#151006] px-2 py-1 text-sm text-[#d8c79f]">
          Selecciona la conversacion ({dialogueOptions.length} disponibles)
        </div>

        <div className="mt-2 grid min-h-0 flex-1 gap-2 md:grid-cols-[minmax(0,270px)_minmax(0,1fr)]">
          <DialogueSelectorPanel
            chatroom={chatroom}
            dialogueOptions={dialogueOptions}
            requirementsByStartId={requirementsByStartId}
          />
        </div>
      </div>
    </article>
  )
}
