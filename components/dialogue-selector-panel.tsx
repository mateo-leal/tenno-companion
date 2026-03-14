'use client'

import { CATHEDRALE_CHATROOMS, HEX_CHATROOMS } from '@/lib/chatrooms'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

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
  chatroom: string
  dialogueOptions: DialogueOption[]
  requirementsByStartId: Record<string, SimulationRequirements>
}

type PreferredPathOption = {
  id: string
  label: string
  metrics: string
  path: number[]
  chemistry: number
  thermostat: number
  activatedBooleans: number
  chatLines: { user: string; content: string }[]
}

export function DialogueSelectorPanel({
  chatroom,
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

  const [booleanValues, setBooleanValues] = useState<Record<string, boolean>>(
    {}
  )
  const [counterValues, setCounterValues] = useState<Record<string, number>>({})
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulateError, setSimulateError] = useState<string | null>(null)
  const [preferredPaths, setPreferredPaths] = useState<PreferredPathOption[]>(
    []
  )
  const [selectedPreferredPathId, setSelectedPreferredPathId] = useState<
    string | null
  >(null)
  const [showConversation, setShowConversation] = useState(false)

  const chatroomIcon = useMemo(() => {
    return (
      [...HEX_CHATROOMS, ...CATHEDRALE_CHATROOMS].find(
        (room) => room.id === chatroom.toLowerCase()
      )?.icon ?? 'https://wiki.warframe.com/images/LotusSymbolGlyph.png'
    )
  }, [chatroom])

  useEffect(() => {
    if (!requirements) {
      setBooleanValues({})
      setCounterValues({})
      return
    }

    setBooleanValues(
      Object.fromEntries(requirements.booleans.map((name) => [name, true]))
    )
    setCounterValues(
      Object.fromEntries(
        requirements.counters.map((counter) => [counter.name, 0])
      )
    )
    setPreferredPaths([])
    setSelectedPreferredPathId(null)
    setShowConversation(false)
    setSimulateError(null)
  }, [requirements, selectedStartId])

  async function handleSimulate() {
    if (!selectedOption) {
      return
    }

    setIsSimulating(true)
    setSimulateError(null)
    setPreferredPaths([])
    setSelectedPreferredPathId(null)
    setShowConversation(false)

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatroom,
          startId: selectedOption.id,
          booleans: booleanValues,
          counters: counterValues,
        }),
      })

      const payload = (await response.json()) as {
        error?: string
        options?: PreferredPathOption[]
      }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Simulation request failed.')
      }

      const options = payload.options ?? []
      setPreferredPaths(options)
      setSelectedPreferredPathId(options[0]?.id ?? null)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Simulation request failed.'
      setSimulateError(message)
    } finally {
      setIsSimulating(false)
    }
  }

  const selectedPreferredPath = useMemo(
    () =>
      preferredPaths.find((option) => option.id === selectedPreferredPathId),
    [preferredPaths, selectedPreferredPathId]
  )

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

            {isSimulating ? (
              <div className="border border-[#6b4820] bg-[#120e08] p-4">
                <div className="flex flex-col items-center gap-3 py-8">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#8f5d1f] border-t-[#f0bb5f]" />
                  <p className="text-sm text-[#d8ccb5]">Simulating paths...</p>
                </div>
              </div>
            ) : preferredPaths.length > 0 ? (
              <div className="space-y-3">
                <div className="border border-[#6b4820] bg-[#120e08] p-2">
                  <p className="font-title text-lg text-[#f0bb5f]">
                    Choose preferred path
                  </p>
                  <ul className="mt-2 space-y-2">
                    {preferredPaths.map((option) => (
                      <li key={option.id}>
                        <label className="flex cursor-pointer items-start gap-2 border border-[#3f2a11] bg-[#0f0a06] p-2">
                          <input
                            type="radio"
                            name={`preferred-${selectedOption.id}`}
                            value={option.id}
                            checked={selectedPreferredPathId === option.id}
                            onChange={() =>
                              setSelectedPreferredPathId(option.id)
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-[#f0bb5f]">
                              {option.label}
                            </p>
                            <p className="text-xs text-[#d8ccb5]">
                              {option.metrics}
                            </p>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={!selectedPreferredPathId}
                  onClick={() => setShowConversation(true)}
                  className="w-full border border-[#8f5d1f] bg-[#2c1300] px-3 py-2 font-title text-lg text-[#f0bb5f] transition hover:bg-[#4a2000] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Mostrar conversacion
                </button>

                {showConversation && selectedPreferredPath ? (
                  <div className="border border-[#6b4820] bg-[#120e08] p-2">
                    <p className="font-title text-lg text-[#f0bb5f]">
                      Conversacion simulada
                    </p>
                    {selectedPreferredPath.chatLines.length > 0 ? (
                      <ul className="mt-2 space-y-1 border border-[#3f2a11] bg-[#0f0a06] p-2 text-sm text-[#ddd7c9]">
                        {selectedPreferredPath.chatLines.map((line, index) => (
                          <li key={`${selectedPreferredPath.id}-${index}`}>
                            {line.user === 'system' ? (
                              <>
                                <strong className="capitalize">
                                  {line.user}:
                                </strong>{' '}
                                {line.content}
                              </>
                            ) : line.user === 'player' ? (
                              <div className="flex items-center gap-2">
                                <Image
                                  src="https://wiki.warframe.com/images/LotusSymbolGlyph.png"
                                  alt="Player"
                                  width={55}
                                  height={55}
                                  className="border-2 border-primary/50"
                                />
                                <div className="flex flex-col">
                                  <span className="text-primary text-xl capitalize">
                                    {line.user}:
                                  </span>
                                  <span className="">{line.content}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Image
                                  src={chatroomIcon}
                                  alt="Player"
                                  width={55}
                                  height={55}
                                  className="border-2 border-primary/50 bg-[#2a3314]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-primary text-xl capitalize">
                                    {line.user}:
                                  </span>
                                  <span className="">{line.content}</span>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-[#b9ac8f]">
                        No dialogue text available on this path.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleSimulate()
                }}
              >
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
                                checked={booleanValues[name] !== false}
                                onChange={() =>
                                  setBooleanValues((current) => ({
                                    ...current,
                                    [name]: true,
                                  }))
                                }
                              />
                              TRUE
                            </label>
                            <label className="inline-flex items-center gap-1">
                              <input
                                type="radio"
                                name={`bool-${selectedOption.id}-${name}`}
                                value="false"
                                checked={booleanValues[name] === false}
                                onChange={() =>
                                  setBooleanValues((current) => ({
                                    ...current,
                                    [name]: false,
                                  }))
                                }
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
                              value={counterValues[counter.name] ?? 0}
                              onChange={(event) =>
                                setCounterValues((current) => ({
                                  ...current,
                                  [counter.name]: Number(event.target.value),
                                }))
                              }
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

                <button
                  type="submit"
                  className="w-full border border-[#8f5d1f] bg-[#2c1300] px-3 py-2 font-title text-lg text-[#f0bb5f] transition hover:bg-[#4a2000]"
                >
                  Simular
                </button>
              </form>
            )}

            {simulateError ? (
              <p className="border border-[#7e2f1e] bg-[#2a0f07] px-2 py-1 text-sm text-[#f3af9f]">
                {simulateError}
              </p>
            ) : null}
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
