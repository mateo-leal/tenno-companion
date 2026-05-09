'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Window } from './window'
import { WindowTitlebar } from './window-titlebar'
import { CloseButton } from '../close-button'
import { WindowContent } from './window-content'
import { Button } from './button'

type Props = {
  id?: string
  contentClassName?: string
  title: string
  show: boolean
  setShow: (show: boolean) => void
}

export function Popup({
  id,
  children,
  contentClassName,
  setShow,
  show,
  title,
}: PropsWithChildren<Props>) {
  const [isSetNotShow, setIsSetNotShow] = useState(false)

  useEffect(() => {
    if (id) {
      const noShowModalsRaw = localStorage.getItem('no-show-modals')
      if (noShowModalsRaw) {
        const noShowModals: Record<string, boolean> =
          JSON.parse(noShowModalsRaw)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSetNotShow(noShowModals[id] ?? false)
      }
    }
  }, [id])

  const handleDontShowAgain = () => {
    const noShowModalsRaw = localStorage.getItem('no-show-modals') ?? '{}'
    if (id) {
      const noShowModals: Record<string, boolean> = JSON.parse(noShowModalsRaw)
      noShowModals[id] = true
      localStorage.setItem('no-show-modals', JSON.stringify(noShowModals))
      setIsSetNotShow(true)
    }
  }

  if (!show || isSetNotShow) {
    return null
  }

  return (
    <Window
      id={id}
      role="dialog"
      aria-labelledby="dialog-label"
      className="w-auto fixed bottom-18 right-4 md:right-18 z-50"
    >
      <WindowTitlebar>
        <h2 id="dialog-label">{title}</h2>
        <CloseButton onClick={() => setShow(false)} />
      </WindowTitlebar>
      <WindowContent className={contentClassName}>
        {children}
        {id && (
          <Button
            className="mt-2"
            variant="secondary"
            onClick={handleDontShowAgain}
          >
            Don&apos;t show again
          </Button>
        )}
      </WindowContent>
    </Window>
  )
}
