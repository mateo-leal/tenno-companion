import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Cormorant_Garamond, Oxanium } from 'next/font/google'
import { Taskbar } from '@/components/taskbar'
import { MigrationBridge } from '@/components/migration-bridge'
import { getSiteOrigin, APP_TITLE } from '@/lib/seo'
import './globals.css'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

const oxanium = Oxanium({
  variable: '--font-ui-sans',
  subsets: ['latin'],
})

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-ui-title',
  weight: ['500', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  applicationName: APP_TITLE,
  title: {
    default: APP_TITLE,
    template: '%s | Tenno Companion',
  },
  description:
    'Your Warframe companion for KIM dialogue simulation and daily or weekly checklist tracking with live reset counters.',
  keywords: [
    APP_TITLE,
    'Warframe',
    'KIM',
    'dialogue pathfinder',
    'dialogue simulator',
    'kim pathfinder',
    'Warframe Tool',
    'Hex',
    'chatroom',
    'WF',
    'checklist',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: APP_TITLE,
    description:
      'Your Warframe companion for KIM dialogue simulation and daily or weekly checklist tracking with live reset counters.',
    url: '/',
    siteName: APP_TITLE,
    locale: 'en_US',
    images: [
      {
        url: '/favicon.ico',
        width: 256,
        height: 256,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: APP_TITLE,
    description:
      'Your Warframe companion for KIM dialogue simulation and daily or weekly checklist tracking with live reset counters.',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'games',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body
        className={`${oxanium.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <div className="kim-background min-h-screen overflow-y-auto text-foreground md:h-screen md:overflow-hidden">
          <NextIntlClientProvider>
            <main className="mx-auto flex min-h-screen w-full max-w-325 flex-col overflow-y-auto p-2 sm:p-4 md:h-screen md:overflow-hidden">
              {children}

              <Taskbar />
            </main>
          </NextIntlClientProvider>
        </div>
        <Analytics />
        <MigrationBridge />
      </body>
    </html>
  )
}
