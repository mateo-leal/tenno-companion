import { ChecklistTask } from '@/lib/types'
import { Button } from '../ui/button'
import { getChecklistTaskCounter } from '@/lib/checklist'
import {
  AppWindowIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  EyeSlashIcon,
  MapPinIcon,
  UserIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

export function TaskRow({
  task,
  now,
  checked,
  checkable = true,
  onToggle,
  onToggleHidden,
}: {
  task: ChecklistTask
  now: Date
  checked: boolean
  checkable?: boolean
  onToggle: () => void
  onToggleHidden: () => void
}) {
  const t = useTranslations()
  const counter = getChecklistTaskCounter(task, now)
  const hasMetaItems = Boolean(
    task.location || task.terminal || task.prerequisite || task.npc || counter
  )

  if (!checkable) {
    return (
      <div className="flex w-full items-start justify-between gap-3 border border-muted-primary/70 bg-cathedrale/45 p-2 text-left">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-muted-primary text-[11px] leading-none text-primary">
            i
          </span>
          <span className="min-w-0">
            <p className="text-sm leading-tight text-foreground">
              {t(task.title)}
            </p>
            {task.info && (
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                {t(task.info)}
              </p>
            )}
            {hasMetaItems ? (
              <ul className="mt-1 text-xs leading-snug text-muted-foreground">
                {counter && (
                  <li className="text-primary">
                    <ClockCountdownIcon
                      size={14}
                      className="inline-block mr-1"
                    />
                    {t(`checklist.counters.${counter.label}`, {
                      time: counter.time,
                    })}
                  </li>
                )}
                {task.location && (
                  <li>
                    <MapPinIcon
                      size={14}
                      className="inline-block mr-1"
                      alt={t('locations.title')}
                    />
                    {t(task.location)}
                  </li>
                )}
                {task.terminal && (
                  <li>
                    <AppWindowIcon
                      size={14}
                      className="inline-block mr-1"
                      alt={t('terminal.title')}
                    />
                    {t(task.terminal)}
                  </li>
                )}
                {task.npc && (
                  <li>
                    <UserIcon
                      size={14}
                      className="inline-block mr-1"
                      alt={t('npcs.title')}
                    />
                    {t(task.npc)}
                  </li>
                )}
                {task.prerequisite && (
                  <li>
                    <CheckCircleIcon
                      size={14}
                      className="inline-block mr-1"
                      alt={t('checklist.prerequisite')}
                    />
                    {t(task.prerequisite)}
                  </li>
                )}
              </ul>
            ) : null}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleHidden}
          aria-label={t('ui.hide')}
          title={t('ui.hide')}
          className="size-6 px-0"
        >
          <EyeSlashIcon size={14} weight="bold" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full items-start justify-between gap-3 border border-muted-primary/70 bg-background/50 p-2 text-left transition hover:bg-muted-primary/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-start gap-2 text-left"
        aria-pressed={checked}
      >
        <span
          className={[
            'mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border text-[11px] leading-none',
            checked
              ? 'border-success-border bg-success-bg text-success'
              : 'border-muted-primary text-muted-foreground',
          ].join(' ')}
        >
          {checked ? <XIcon weight="bold" /> : ''}
        </span>
        <span className="min-w-0">
          <p
            className={[
              'text-sm leading-tight',
              checked
                ? 'text-muted-foreground line-through'
                : 'text-foreground',
            ].join(' ')}
          >
            {t(task.title)}
          </p>
          {!checked && (
            <>
              {task.info && (
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {t(task.info)}
                </p>
              )}
              {hasMetaItems && (
                <ul className="mt-1 text-xs leading-snug text-muted-foreground">
                  {counter && (
                    <li className="text-primary">
                      <ClockCountdownIcon
                        size={14}
                        className="inline-block mr-1"
                      />
                      {t(`checklist.counters.${counter.label}`, {
                        time: counter.time,
                      })}
                    </li>
                  )}
                  {task.location && (
                    <li>
                      <MapPinIcon
                        size={14}
                        className="inline-block mr-1"
                        alt={t('locations.title')}
                      />
                      {t(task.location)}
                    </li>
                  )}
                  {task.terminal && (
                    <li>
                      <AppWindowIcon
                        size={14}
                        className="inline-block mr-1"
                        alt={t('terminal.title')}
                      />
                      {t(task.terminal)}
                    </li>
                  )}
                  {task.npc && (
                    <li>
                      <UserIcon
                        size={14}
                        className="inline-block mr-1"
                        alt={t('npcs.title')}
                      />
                      {t(task.npc)}
                    </li>
                  )}
                  {task.prerequisite && (
                    <li>
                      <CheckCircleIcon
                        size={14}
                        className="inline-block mr-1"
                        alt={t('checklist.prerequisite')}
                      />
                      {t(task.prerequisite)}
                    </li>
                  )}
                </ul>
              )}
            </>
          )}
        </span>
      </button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleHidden}
        aria-label={t('ui.hide')}
        title={t('ui.hide')}
        className="size-6 px-0"
      >
        <EyeSlashIcon size={14} weight="bold" />
      </Button>
    </div>
  )
}
