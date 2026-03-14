'use client'

import { useMemo, useState } from 'react'

type DialogueOption = {
  option: number
  id: number
  label: string
}

type SimulationRequirements = {
  booleans: string[]
  counters: Array<{
    name: string
    expressions: string[]
  }>
}

type DialogueSelectorPanelProps = {
  dialogueOptions: DialogueOption[]
  requirementsByStartId: Record<string, SimulationRequirements>
}

export function DialogueSelectorPanel({
  dialogueOptions,
  requirementsByStartId,
}: DialogueSelectorPanelProps) {
  const [selectedStartId, setSelectedStartId] = useState<number | null>(
    dialogueOptions[0]?.id ?? null
  )

  const selectedOption = useMemo(
    () => dialogueOptions.find((item) => item.id === selectedStartId),
    [dialogueOptions, selectedStartId]
  )

  const requirements =
    selectedStartId !== null
      ? requirementsByStartId[String(selectedStartId)]
      : undefined

  return (
    <>
      <div className="min-h-0 border border-[#8f5d1f] bg-black p-2 h-full overflow-y-auto">
        <ul className="space-y-1 pr-1">
          {dialogueOptions.map((item) => {
            const active = item.id === selectedStartId

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStartId(item.id)}
                  className={`flex w-full items-start gap-2 border px-2 py-1.5 text-left text-sm leading-snug transition ${
                    active
                      ? 'border-[#cfad73] bg-[#3e1f00] text-[#ffe2af]'
                      : 'border-[#6b4820] bg-[#120e08] text-[#d8ccb5] hover:bg-[#2a1805]'
                  }`}
                >
                  <span className="font-title text-base text-[#f0bb5f]">
                    {item.option}.
                  </span>
                  <span className="min-w-0 flex-1">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <section className="min-h-0 border border-[#8f5d1f] bg-black p-3 h-full overflow-y-auto">
        {selectedOption && requirements ? (
          <div className="space-y-3 text-[#ddd7c9]">
            <p className="font-title text-xl text-[#f0bb5f]">
              {selectedOption.label}
            </p>

            <form className="space-y-3">
              <div className="border border-[#6b4820] bg-[#120e08] p-2">
                <p className="font-title text-lg text-[#f0bb5f]">
                  Boolean checks
                </p>
                {requirements.booleans.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {requirements.booleans.map((name) => (
                      <li
                        key={name}
                        className="border border-[#3f2a11] bg-[#0f0a06] p-2"
                      >
                        <p className="text-sm text-[#d8ccb5]">{name}</p>
                        <div className="mt-1 flex items-center gap-3 text-sm">
                          <label className="inline-flex items-center gap-1">
                            <input
                              type="radio"
                              name={`bool-${selectedOption.id}-${name}`}
                              value="true"
                              defaultChecked
                            />
                            TRUE
                          </label>
                          <label className="inline-flex items-center gap-1">
                            <input
                              type="radio"
                              name={`bool-${selectedOption.id}-${name}`}
                              value="false"
                            />
                            FALSE
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[#b9ac8f]">
                    This dialogue does not require boolean checks.
                  </p>
                )}
              </div>

              <div className="border border-[#6b4820] bg-[#120e08] p-2">
                <p className="font-title text-lg text-[#f0bb5f]">
                  Counter values
                </p>
                {requirements.counters.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {requirements.counters.map((counter) => (
                      <li
                        key={counter.name}
                        className="border border-[#3f2a11] bg-[#0f0a06] p-2"
                      >
                        <label className="flex flex-col gap-1 text-sm text-[#d8ccb5]">
                          <span>{counter.name}</span>
                          <input
                            type="number"
                            name={`counter-${selectedOption.id}-${counter.name}`}
                            defaultValue={0}
                            className="w-full border border-[#6b4820] bg-black px-2 py-1 text-[#efe4cb]"
                          />
                        </label>
                        {counter.expressions.length > 0 ? (
                          <p className="mt-1 text-xs text-[#b9ac8f]">
                            Conditions: {counter.expressions.join(' | ')}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[#b9ac8f]">
                    This dialogue does not require counter input.
                  </p>
                )}
              </div>
            </form>
          </div>
        ) : (
          <p className="text-sm text-[#ddd7c9]">
            No start dialogues found for this chatroom.
          </p>
        )}
      </section>
    </>
  )
}
