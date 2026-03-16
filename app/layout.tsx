import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Cormorant_Garamond, Oxanium } from 'next/font/google'
import { Taskbar } from '@/components/taskbar'
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
  title: {
    default: 'WF Tool',
    template: '%s | WF Tool',
  },
  description: 'In-game inspired dialogue interface for KIM conversations',
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
        <div className="kim-background min-h-screen overflow-y-auto text-[#ebdfbf] md:h-screen md:overflow-hidden">
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
