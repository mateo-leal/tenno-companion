import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Cormorant_Garamond, Oxanium } from 'next/font/google'
import { Taskbar } from '@/components/taskbar'
import { getSiteOrigin } from '@/lib/seo'
import './globals.css'

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
  applicationName: 'WF Tool',
  title: {
    default: 'WF Tool',
    template: '%s | WF Tool',
  },
  description:
    'Explore and simulate Warframe KIM dialogue paths with chemistry, thermostat, and boolean state tracking.',
  keywords: [
    'Warframe',
    'KIM',
    'dialogue pathfinder',
    'dialogue simulator',
    'WF Tool',
    'Hex',
    'chatroom',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'WF Tool',
    description:
      'Explore and simulate Warframe KIM dialogue paths with chemistry, thermostat, and boolean state tracking.',
    url: '/',
    siteName: 'WF Tool',
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
    title: 'WF Tool',
    description:
      'Explore and simulate Warframe KIM dialogue paths with chemistry, thermostat, and boolean state tracking.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${oxanium.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <div className="kim-background min-h-screen overflow-y-auto text-foreground md:h-screen md:overflow-hidden">
          <main className="mx-auto flex min-h-screen w-full max-w-325 flex-col overflow-y-auto p-2 sm:p-4 md:h-screen md:overflow-hidden">
            {children}

            <Taskbar />
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
