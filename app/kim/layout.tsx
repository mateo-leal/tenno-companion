'use client'

import { KimWindow } from '@/components/windows/kim'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: LayoutProps<'/kim'>) {
  const pathname = usePathname()
  const isKimHome = pathname === '/kim'

  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
      <div className="flex min-h-full flex-col gap-2 md:block">
        {isKimHome ? (
          <KimWindow />
        ) : (
          <div className="hidden md:block">
            <KimWindow />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
