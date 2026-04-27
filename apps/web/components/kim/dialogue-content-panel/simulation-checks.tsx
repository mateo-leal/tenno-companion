import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction } from 'react'

import { SimulationState } from '@tenno-companion/kim/types'

import { Panel } from '@/components/ui/panel'
import { Switch } from '@/components/ui/switch'
import { TextInput } from '@/components/ui/text-input'

type Props = {
  checks: {
    booleans: string[]
    counters: string[]
  }
  customState: SimulationState
  setCustomState: Dispatch<SetStateAction<SimulationState>>
}

export function SimulationChecks({
  checks,
  customState,
  setCustomState,
}: Props) {
  const t = useTranslations('kim.chatroom')

  return (
    <div className="flex gap-2 flex-col md:flex-row justify-between">
      <Panel className="w-full">
        <p className="font-title text-lg text-primary">{t('booleanChecks')}</p>
        {checks.booleans.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {checks.booleans.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between border border-muted-primary/70 bg-pressable-bg p-2"
              >
                <p className="text-sm">{name}</p>
                <div className="flex items-center gap-3 text-sm">
                  <Switch
                    checked={customState.booleans[name] || false}
                    onCheckedChange={(checked) =>
                      setCustomState((previous) => ({
                        ...previous,
                        booleans: {
                          ...previous.booleans,
                          [name]: checked,
                        },
                      }))
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {t('noBooleanChecksRequired')}
          </p>
        )}
      </Panel>

      <Panel className="w-full">
        <p className="font-title text-lg text-primary">{t('counterValues')}</p>
        {checks.counters.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {checks.counters.map((name) => (
              <li
                key={name}
                className="border border-muted-primary/70 bg-pressable-bg px-2 py-1"
              >
                <label className="flex items-center gap-1 text-sm">
                  <span className="w-full">{name}</span>
                  <TextInput
                    type="number"
                    defaultValue={customState.counters[name] ?? 0}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      if (!isNaN(value)) {
                        setCustomState((previous) => ({
                          ...previous,
                          counters: {
                            ...previous.counters,
                            [name]: value,
                          },
                        }))
                      }
                    }}
                    className="py-1"
                  />
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {t('noCounterValuesRequired')}
          </p>
        )}
      </Panel>
    </div>
  )
}
