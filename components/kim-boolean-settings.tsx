'use client'

import { BOOLEANS_STORAGE_KEY } from '@/lib/constants'
import { GearSixIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseButton } from './close-button'
import { cn } from '@/lib/utils'
import { TextInput } from './ui/text-input'
import { WindowContent } from './ui/window-content'
import { Window } from './ui/window'
import { WindowTitlebar } from './ui/window-titlebar'
import { Button } from './ui/button'

type BooleanState = Record<string, boolean>

function loadBooleanState(): BooleanState {
  try {
    const raw = localStorage.getItem(BOOLEANS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return {}

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([key]) => key.trim().length > 0)
        .map(([key, value]) => [key, Boolean(value)])
    )
  } catch {
    return {}
  }
}

function saveBooleanState(state: BooleanState): void {
  try {
    localStorage.setItem(BOOLEANS_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

export function KimBooleanSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [booleanState, setBooleanState] = useState<BooleanState>({})
  const [newName, setNewName] = useState('')

  const entries = useMemo(
    () =>
      Object.entries(booleanState).sort(([a], [b]) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      ),
    [booleanState]
  )

  function openSettings() {
    setBooleanState(loadBooleanState())
    setIsOpen(true)
  }

  function updateState(next: BooleanState) {
    setBooleanState(next)
    saveBooleanState(next)
  }

  function addBoolean() {
    const name = newName.trim()
    if (!name) return
    if (Object.prototype.hasOwnProperty.call(booleanState, name)) return

    updateState({ ...booleanState, [name]: true })
    setNewName('')
  }

  function removeBoolean(name: string) {
    const next = { ...booleanState }
    delete next[name]
    updateState(next)
  }

  function setBoolean(name: string, value: boolean) {
    updateState({ ...booleanState, [name]: value })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open boolean settings"
        onClick={openSettings}
        className={cn(
          'inline-flex size-7 items-center justify-center px-1 text-sm leading-none',
          'border border-primary bg-accent text-primary hover:bg-accent-hover transition'
        )}
      >
        <GearSixIcon className="size-4" weight="bold" />
      </button>

      {isOpen
        ? createPortal(
            <section className="fixed inset-0 z-50 flex items-center justify-center p-3">
              <Window className="h-[min(82svh,700px)] max-w-190">
                <WindowTitlebar>
                  <p>Boolean settings</p>
                  <CloseButton
                    onClick={() => setIsOpen(false)}
                    label="Close boolean settings"
                  />
                </WindowTitlebar>

                <WindowContent>
                  <div className="flex gap-2 border border-muted-primary bg-background p-2">
                    <TextInput
                      id="boolean-name-input"
                      value={newName}
                      onChange={(event) => setNewName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          addBoolean()
                        }
                      }}
                      placeholder="Add boolean name"
                    />
                    <Button className="shrink-0" onClick={addBoolean}>
                      <PlusIcon size={14} weight="bold" />
                      Add
                    </Button>
                  </div>

                  <div className="mt-2 min-h-0 flex-1 overflow-y-auto border border-muted-primary bg-background p-2">
                    {entries.length === 0 ? (
                      <p className="text-sm text-foreground">
                        No booleans saved yet.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {entries.map(([name, value]) => (
                          <li
                            key={name}
                            className="border border-muted-primary bg-background p-2"
                          >
                            <p className="text-sm text-foreground break-all">
                              {name}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <Button
                                variant={value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setBoolean(name, true)}
                              >
                                Activate
                              </Button>
                              <Button
                                variant={!value ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => setBoolean(name, false)}
                              >
                                Deactivate
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeBoolean(name)}
                              >
                                <TrashIcon size={12} weight="bold" />
                                Remove
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </WindowContent>
              </Window>
            </section>,
            document.body
          )
        : null}
    </>
  )
}
