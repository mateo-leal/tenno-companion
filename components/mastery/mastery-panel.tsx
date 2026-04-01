'use client'

import Image from 'next/image'
import { MASTERY_CHECKLIST_STORAGE_KEY } from '@/lib/constants'
import {
  fetchPublicExportDictionary,
  fetchPublicExportSentinels,
  fetchPublicExportWarframes,
  fetchPublicExportWeapons,
  resolveDictName,
  type PublicExportDictionary,
} from '@/lib/public-export/fetch-public-export'
import { useMemo, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

type MasteryCategory =
  | 'warframes'
  | 'primary'
  | 'secondary'
  | 'melee'
  | 'robotics'
  | 'companions'

type MasteryItem = {
  id: string
  name: string
  iconUrl?: string
  masteryReq?: number
}

type MasteryData = Record<MasteryCategory, MasteryItem[]>

type MasteryProgress = Record<string, boolean>

const CATEGORY_ORDER: MasteryCategory[] = [
  'warframes',
  'primary',
  'secondary',
  'melee',
  'robotics',
  'companions',
]

function normalizeProgress(value: unknown): MasteryProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key.trim().length > 0)
      .map(([key, checked]) => [key, Boolean(checked)])
  )
}

function loadProgress(): MasteryProgress {
  try {
    const raw = localStorage.getItem(MASTERY_CHECKLIST_STORAGE_KEY)
    if (!raw) {
      return {}
    }

    return normalizeProgress(JSON.parse(raw))
  } catch {
    return {}
  }
}

function saveProgress(progress: MasteryProgress): void {
  try {
    localStorage.setItem(
      MASTERY_CHECKLIST_STORAGE_KEY,
      JSON.stringify(progress)
    )
  } catch {
    // ignore storage errors
  }
}

function toSortedItems(
  entries: Array<{
    id: string
    name: string
    iconUrl?: string
    masteryReq?: number
  }>
): MasteryItem[] {
  return entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
}

function buildIconUrl(iconPath: string | undefined): string | undefined {
  if (!iconPath || iconPath.trim().length === 0) {
    return undefined
  }

  return `https://browse.wf${iconPath}`
}

function buildMasteryData(
  dict: PublicExportDictionary,
  weaponsMap: Record<
    string,
    {
      name?: string
      icon?: string
      productCategory?: string
      masteryReq?: number
    }
  >,
  warframesMap: Record<
    string,
    {
      name?: string
      icon?: string
      productCategory?: string
      masteryReq?: number
    }
  >,
  sentinelsMap: Record<
    string,
    {
      name?: string
      icon?: string
      productCategory?: string
      masteryReq?: number
    }
  >
): MasteryData {
  const data: MasteryData = {
    warframes: [],
    primary: [],
    secondary: [],
    melee: [],
    robotics: [],
    companions: [],
  }

  for (const [path, frame] of Object.entries(warframesMap)) {
    const category = frame.productCategory
    if (category !== 'Suits' && category !== 'SpaceSuits') {
      continue
    }

    const fallback = path.split('/').pop() ?? path
    data.warframes.push({
      id: `warframe:${path}`,
      name: resolveDictName(dict, frame.name, fallback),
      iconUrl: buildIconUrl(frame.icon),
      masteryReq: frame.masteryReq,
    })
  }

  for (const [path, weapon] of Object.entries(weaponsMap)) {
    const category = weapon.productCategory
    let targetCategory: MasteryCategory | null = null

    if (category === 'LongGuns') {
      targetCategory = 'primary'
    } else if (category === 'Pistols') {
      targetCategory = 'secondary'
    } else if (
      category === 'Melee' ||
      category === 'SpaceMelee' ||
      category === 'DrifterMelee'
    ) {
      targetCategory = 'melee'
    }

    if (!targetCategory) {
      continue
    }

    const fallback = path.split('/').pop() ?? path
    data[targetCategory].push({
      id: `weapon:${path}`,
      name: resolveDictName(dict, weapon.name, fallback),
      iconUrl: buildIconUrl(weapon.icon),
      masteryReq: weapon.masteryReq,
    })
  }

  for (const [path, sentinel] of Object.entries(sentinelsMap)) {
    const category = sentinel.productCategory
    let targetCategory: MasteryCategory | null = null

    if (category === 'Sentinels') {
      targetCategory = 'robotics'
    } else if (category === 'MoaPets') {
      targetCategory = 'robotics'
    } else if (category === 'KubrowPets' || category === 'SpecialItems') {
      targetCategory = 'companions'
    }

    if (!targetCategory) {
      continue
    }

    const fallback = path.split('/').pop() ?? path
    data[targetCategory].push({
      id: `sentinel:${path}`,
      name: resolveDictName(dict, sentinel.name, fallback),
      iconUrl: buildIconUrl(sentinel.icon),
      masteryReq: sentinel.masteryReq,
    })
  }

  return {
    warframes: toSortedItems(data.warframes),
    primary: toSortedItems(data.primary),
    secondary: toSortedItems(data.secondary),
    melee: toSortedItems(data.melee),
    robotics: toSortedItems(data.robotics),
    companions: toSortedItems(data.companions),
  }
}

export function MasteryPanel() {
  const t = useTranslations('masteryChecklist')
  const [activeCategory, setActiveCategory] =
    useState<MasteryCategory>('warframes')
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState<MasteryProgress>({})
  const [masteryData, setMasteryData] = useState<MasteryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setProgress(loadProgress())

    let isCancelled = false

    async function loadData() {
      setIsLoading(true)
      setError(null)

      try {
        const [dict, weaponsMap, warframesMap, sentinelsMap] =
          await Promise.all([
            fetchPublicExportDictionary(),
            fetchPublicExportWeapons(),
            fetchPublicExportWarframes(),
            fetchPublicExportSentinels(),
          ])

        if (isCancelled) {
          return
        }

        setMasteryData(
          buildMasteryData(dict, weaponsMap, warframesMap, sentinelsMap)
        )
      } catch {
        if (isCancelled) {
          return
        }

        setError(t('loadFailed'))
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isCancelled = true
    }
  }, [t])

  const filteredItems = useMemo(() => {
    const categoryItems = masteryData?.[activeCategory] ?? []
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return categoryItems
    }

    return categoryItems.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery)
    )
  }, [activeCategory, masteryData, query])

  const categoryStats = useMemo(() => {
    if (!masteryData) {
      return Object.fromEntries(
        CATEGORY_ORDER.map((category) => [category, { done: 0, total: 0 }])
      ) as Record<MasteryCategory, { done: number; total: number }>
    }

    return Object.fromEntries(
      CATEGORY_ORDER.map((category) => {
        const items = masteryData[category]
        const done = items.reduce(
          (count, item) => count + (progress[item.id] ? 1 : 0),
          0
        )

        return [category, { done, total: items.length }]
      })
    ) as Record<MasteryCategory, { done: number; total: number }>
  }, [masteryData, progress])

  function toggleItem(itemId: string) {
    setProgress((previous) => {
      const next = {
        ...previous,
        [itemId]: !previous[itemId],
      }

      saveProgress(next)
      return next
    })
  }

  function clearCategory() {
    if (!masteryData) {
      return
    }

    const ids = masteryData[activeCategory].map((item) => item.id)

    setProgress((previous) => {
      const next = { ...previous }
      for (const id of ids) {
        delete next[id]
      }

      saveProgress(next)
      return next
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {CATEGORY_ORDER.map((category) => {
          const stats = categoryStats[category]
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={[
                'border px-2 py-2 text-left transition',
                isActive
                  ? 'border-success-border bg-success-bg text-success'
                  : 'border-muted-primary bg-background/50 text-foreground hover:bg-muted-primary/15',
              ].join(' ')}
            >
              <p className="text-sm">{t(`categories.${category}`)}</p>
              <p className="text-xs opacity-80">
                {t('doneCount', { count: stats.done, total: stats.total })}
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="min-w-0 flex-1 border border-muted-primary bg-background px-2 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <button
          type="button"
          onClick={clearCategory}
          className="border border-muted-primary bg-background px-2 py-1 text-sm text-foreground transition hover:bg-muted-primary/15"
        >
          {t('clearCategory')}
        </button>
      </div>

      <div className="border border-muted-primary bg-background/40 px-2 py-1 text-xs text-muted-foreground">
        {t('activeCategoryCount', {
          category: t(`categories.${activeCategory}`),
          count: filteredItems.length,
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border border-muted-primary bg-background/35 p-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        ) : error ? (
          <p className="text-sm text-error">{error}</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('emptyState')}</p>
        ) : (
          <div className="space-y-1.5">
            {filteredItems.map((item) => {
              const checked = Boolean(progress[item.id])
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-center gap-2 border border-muted-primary/70 bg-background/50 px-2 py-1.5 text-left transition hover:bg-muted-primary/10"
                  aria-pressed={checked}
                >
                  <span
                    className={[
                      'inline-flex h-4 w-4 shrink-0 items-center justify-center border text-[11px] leading-none',
                      checked
                        ? 'border-success-border bg-success-bg text-success'
                        : 'border-muted-primary text-muted-foreground',
                    ].join(' ')}
                  >
                    {checked ? 'X' : ''}
                  </span>
                  {item.iconUrl ? (
                    <Image
                      src={item.iconUrl}
                      alt={item.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 shrink-0 border border-muted-primary/60 bg-background/70 object-contain p-0.5"
                      loading="lazy"
                      unoptimized
                    />
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span
                      className={[
                        'block text-sm leading-tight',
                        checked
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground',
                      ].join(' ')}
                    >
                      {item.name}
                    </span>
                    {typeof item.masteryReq === 'number' ? (
                      <span className="text-xs text-muted-foreground">
                        {t('masteryRequirement', { mr: item.masteryReq })}
                      </span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
