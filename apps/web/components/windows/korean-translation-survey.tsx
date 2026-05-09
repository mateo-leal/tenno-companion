'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect, useState } from 'react'

import { Popup } from '../ui/popup'
import { Button } from '../ui/button'
import { TextArea } from '../ui/text-input'
import { useLocale } from 'next-intl'

export function KoreanTranslationSurvey() {
  const locale = useLocale()
  const [showSurvey, setShowSurvey] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [selectedItem, setSelectedItem] = useState<number>()

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Trigger if the user hides the page, and we haven't shown it yet
      if (document.visibilityState === 'hidden' && !hasShown) {
        setShowSurvey(true)
        setHasShown(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [hasShown])

  const submitFeedback = (formData: FormData) => {
    const comment = formData.get('comment')

    Sentry.captureFeedback({
      message: `Accuracy: ${selectedItem}/5. Comment: ${comment}`,
      associatedEventId: Sentry.lastEventId(),
      tags: {
        section: 'translation-survey',
        locale,
        rating: selectedItem,
      },
    })

    const noShowModalsRaw = localStorage.getItem('no-show-modals') ?? '{}'
    const noShowModals: Record<string, boolean> = JSON.parse(noShowModalsRaw)
    noShowModals[`${locale}-translation-survey`] = true
    localStorage.setItem('no-show-modals', JSON.stringify(noShowModals))

    setShowSurvey(false)
  }

  if (locale !== 'ko') return null

  if (!showSurvey) return null

  return (
    <Popup
      show={showSurvey}
      setShow={setShowSurvey}
      id={`${locale}-translation-survey`}
      title="번역이 정확한가요?"
    >
      <form action={submitFeedback} className="flex flex-col gap-2">
        <p>번역이 정확한가요? (Is the translation accurate?)</p>
        <ul className="mx-auto flex gap-2" role="radiogroup">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item}>
              <Button
                aria-checked={selectedItem === item}
                role="radio"
                tabIndex={0}
                variant={selectedItem === item ? 'default' : 'outline'}
                onClick={() => setSelectedItem(item)}
              >
                {item}
              </Button>
            </li>
          ))}
        </ul>
        <TextArea name="comment" placeholder="무엇을 개선할 수 있을까요?" />
        <Button type="submit" disabled={selectedItem === undefined}>
          제출하다
        </Button>
      </form>
    </Popup>
  )
}
