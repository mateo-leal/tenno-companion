import { useTranslations } from 'next-intl'
import { ArrowRightIcon } from '@phosphor-icons/react'

import {
  NodeType,
  AVOIDABLE_BOOLEAN_NAMES,
  ROMANCE_BOOLEAN_NAMES,
  NO_ROMANCE_BOOLEAN_NAMES,
} from '@tenno-companion/kim/constants'
import { DialoguePath, OptimizedResults } from '@tenno-companion/kim/types'

import { cn } from '@/lib/utils'
import { Panel } from '@/components/ui/panel'
import { useKIMChat } from '@/components/providers/kim-chat'

type Props = {
  optimizedResults: OptimizedResults
  setActiveDialoguePath: (path: DialoguePath) => void
}

export function PreferredPathSelectorPanel({
  optimizedResults,
  setActiveDialoguePath,
}: Props) {
  const t = useTranslations('kim.chatroom')
  const {
    gameState: { counters },
  } = useKIMChat()

  const sections = [
    { data: optimizedResults.bestGeneral, label: t('bestOverallPath') },
    { data: optimizedResults.bestChemistry, label: t('bestChemistryPath') },
    { data: optimizedResults.bestCounterGains, label: t('bestCounterPath') },
    {
      data: optimizedResults.bestPositiveRomance,
      label: t('bestRomancePath'),
    },
    {
      data: optimizedResults.bestNegativeRomance,
      label: t('bestBadRomancePath'),
    },
  ]

  const amountOfValidPaths = sections.reduce((acc, section) => {
    if (!section.data || !Array.isArray(section.data)) return acc

    const hasValidPath = section.data.some((path) =>
      path.nodes?.some(
        (node) =>
          node.type === NodeType.Dialogue || node.type === NodeType.PlayerChoice
      )
    )

    return acc + (hasValidPath ? 1 : 0)
  }, 0)

  if (amountOfValidPaths === 0) {
    return (
      <Panel>
        <p className="text-foreground">{t('noPathsForCurrentState')}</p>
      </Panel>
    )
  }

  return (
    <Panel>
      <p className="font-title text-lg text-primary">
        {t('choosePreferredPath')}
      </p>
      <ul className="mt-2 space-y-2">
        {sections.map((section) =>
          section.data.map((path, index) => (
            <PathItem
              key={`${section.label}-${index}`}
              path={path}
              label={section.label}
              counters={counters}
              setActiveDialoguePath={setActiveDialoguePath}
            />
          ))
        )}
      </ul>
    </Panel>
  )
}

const PathItem = ({
  path,
  label,
  counters,
  setActiveDialoguePath,
}: {
  path: DialoguePath
  label: string
  counters: Record<string, number>
  setActiveDialoguePath: (dialogue: DialoguePath) => void
}) => {
  const t = useTranslations('kim.chatroom')
  return (
    <li>
      <button
        className={cn(
          'w-full flex flex-col cursor-pointer items-start p-2',
          'border border-muted-primary/70 bg-pressable-bg hover:bg-muted-primary/10 transition-colors'
        )}
        onClick={() => setActiveDialoguePath(path)}
      >
        <div className="text-start">
          <p className="text-sm font-medium text-primary">{label}</p>
          {path.isUncertain && (
            <p className="text-xs text-muted-foreground">
              {t('uncertainPath')}
            </p>
          )}
        </div>
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {path.mutations.chemistry > 0 && (
            <MutationBadge
              key="chemistry"
              name={'Chemistry'}
              value={path.mutations.chemistry}
              type="chemistry"
            />
          )}
          {path.mutations.set.map((name: string) => (
            <MutationBadge key={`set-${name}`} name={name} type="set" />
          ))}
          {path.mutations.reset.map((name: string) => (
            <MutationBadge key={`reset-${name}`} name={name} type="reset" />
          ))}
          {Object.entries(path.mutations.increments).map(([name, value]) => (
            <MutationBadge
              key={`inc-${name}`}
              name={name}
              type="increment"
              value={value}
              oldValue={counters[name]}
            />
          ))}
        </ul>
      </button>
    </li>
  )
}

const MutationBadge = ({
  name,
  type,
  value,
  oldValue,
}: {
  name: string
  type: 'set' | 'reset' | 'increment' | 'chemistry'
  value?: number
  oldValue?: number
}) => {
  const t = useTranslations('kim.chatroom.booleanNotes')
  const isAvoidable = AVOIDABLE_BOOLEAN_NAMES.includes(name)
  const isRomance = ROMANCE_BOOLEAN_NAMES.includes(name)
  const isBadRomance = NO_ROMANCE_BOOLEAN_NAMES.includes(name)

  const getTitle = () => {
    if (isAvoidable) return t('avoidable')
    if (isRomance) return t('romance')
    if (isBadRomance) return t('badRomance')
    return undefined
  }

  const getStyles = () => {
    if (isBadRomance) return 'border-[#5c1a4b] bg-[#1a0715] text-[#d45ab4]'
    if (isRomance) return 'border-[#7b2f6e] bg-[#241021] text-[#f2b6ea]'
    if (isAvoidable) return 'border-[#8a6418] bg-[#2b1d07] text-[#f1c768]'

    if (type === 'reset') return 'border-[#5c1a1a] bg-[#1f0707] text-[#d45a5a]'
    if (type === 'chemistry')
      return 'border-[#1a5c5c] bg-[#071f1f] text-[#5ad4d4]'
    if (type === 'increment') {
      const val = value ?? 0
      const oldVal = oldValue ?? 0

      if (val > oldVal) return 'border-[#1e40af] bg-[#0f172a] text-[#93c5fd]'
      if (val < oldVal) return 'border-[#9f1239] bg-[#1c0a0e] text-[#fda4af]'
    }
    return 'border-[#3a5c1a] bg-[#0f1f07] text-[#8fd45a]'
  }

  return (
    <li
      className={cn(
        'inline-flex items-center gap-1 border px-1.5 py-0.5 text-xs leading-tight',
        getStyles()
      )}
      title={getTitle()}
    >
      {/* Symbol for booleans */}
      {type === 'set' && <span>+</span>}
      {type === 'reset' && <span>-</span>}

      <span>{name}</span>

      {/* Chemistry */}
      {type === 'chemistry' && <span>+{value}</span>}

      {/* Counter specific display */}
      {type === 'increment' && (
        <span className="flex gap-1 ml-1">
          <span className="line-through opacity-60">{oldValue ?? 0}</span>
          <ArrowRightIcon />
          <span>{value}</span>
        </span>
      )}
    </li>
  )
}
