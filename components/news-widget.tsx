'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { fetchEventsNode } from '@/lib/world-state/fetch-world-state'
import Link from 'next/link'

function formatNewsDate(locale: string, dateMs: number): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateMs))
}

function NewsItem({ item }: { item: EventItem }) {
  const locale = useLocale()
  const t = useTranslations('newsWidget')

  if (item.link) {
    return (
      <Link
        href={item.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        prefetch={false}
        className="block border border-muted-primary/40 bg-background/35 p-2 transition hover:border-primary/60 hover:bg-background/50"
      >
        <p className="text-sm leading-snug text-foreground">{item.message}</p>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{t(item.type)}</span>
          <span className="tabular-nums">
            {formatNewsDate(locale, item.time * 1000)}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="block border border-muted-primary/40 bg-background/35 p-2">
      <p className="text-sm leading-snug text-foreground">{item.message}</p>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{t(item.type)}</span>
        <span className="tabular-nums">
          {formatNewsDate(locale, item.time * 1000)}
        </span>
      </div>
    </div>
  )
}

type EventItem = {
  id: string
  type: 'community' | 'official'
  message: string
  time: number
  link?: string
}

function parseLink(link?: string) {
  if (!link) return undefined

  try {
    const url = new URL(link)
    const params = new URLSearchParams(url.search) as URLSearchParams

    ;[
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ].forEach((param) => {
      params.delete(param)
    })

    params.append('utm_source', 'tennocompanion')
    url.search = params.toString()
    return url.href
  } catch {
    return undefined
  }
}

export function NewsWidget() {
  const locale = useLocale()
  const t = useTranslations('newsWidget')
  const [eventItems, setEventItems] = useState<EventItem[]>([])

  const fetchEvents = async () => {
    const events = await fetchEventsNode()
    return events
      .filter((event) => event.Date)
      .map((event) => {
        const time = Math.trunc(Number(event.Date!.$date.$numberLong) / 1000)
        const message = event.Messages.find(
          (msg) => msg.LanguageCode === locale
        )?.Message
        const eventLink = event.Links?.find(
          (link) => link.LanguageCode === locale
        )?.Link

        const link = parseLink(event.Prop.length > 0 ? event.Prop : eventLink)

        if (
          message &&
          message !== '/Lotus/Language/CommunityMessages/JoinDiscord'
        ) {
          return {
            id: event._id.$oid,
            type: event.Community ? 'community' : 'official',
            message,
            time,
            link,
          }
        }

        return undefined
      })
      .filter((item) => item !== undefined)
      .sort((a, b) => b.time - a.time)
  }

  useEffect(() => {
    fetchEvents().then((items) => {
      setEventItems(items as EventItem[])
    })
  }, [])

  return (
    <div className="border border-muted-primary/60 bg-background/75 p-3 pr-0 pb-0">
      <div className="border-b border-muted-primary/40 pb-2 mr-3">
        <p className="font-title text-xl leading-none text-primary">
          {t('title')}
        </p>
      </div>

      {eventItems.length > 0 ? (
        <div className="max-h-96 overflow-y-auto pr-1 pb-3 pt-3">
          <div className="grid gap-2">
            {eventItems.map((item) => (
              <NewsItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-muted-primary/40 bg-background/35 px-3 py-2 m-3 ml-0 text-sm text-muted-foreground">
          {t('empty')}
        </div>
      )}
    </div>
  )
}
