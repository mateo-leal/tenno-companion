'use client'

import { CloseButton } from '@/components/close-button'
import { LANGUAGE_OPTIONS } from '@/lib/language'
import { createPortal } from 'react-dom'
import { Window } from '../ui/window'
import { WindowContent } from '../ui/window-content'
import { WindowTitlebar } from '../ui/window-titlebar'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

type SettingsPortalProps = {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPortal({ isOpen, onClose }: SettingsPortalProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  if (!isOpen) {
    return null
  }

  function onLanguageChange(value: string) {
    router.replace(pathname, { locale: value })
  }

  return createPortal(
    <section className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3">
      <Window className="pointer-events-auto w-full max-w-sm">
        <WindowTitlebar>
          <p>Settings</p>
          <CloseButton onClick={onClose} />
        </WindowTitlebar>
        <WindowContent>
          <label
            htmlFor="global-language-selector"
            className="mb-1 block text-xs uppercase tracking-wide"
          >
            Language
          </label>
          <select
            id="global-language-selector"
            value={locale}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="w-full border border-muted-primary bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
          >
            {LANGUAGE_OPTIONS.filter((option) =>
              ['en', 'es'].includes(option.value)
            ).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </WindowContent>
      </Window>
    </section>,
    document.body
  )
}
