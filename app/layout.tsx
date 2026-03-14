import type { Metadata } from 'next'
import { Cormorant_Garamond, Oxanium, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

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
  title: 'KIM Pathfinder UI',
  description: 'In-game inspired dialogue interface for KIM conversations',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn('font-mono', jetbrainsMono.variable)}>
      <body
        className={`${oxanium.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <div className="kim-background h-screen overflow-hidden text-[#ebdfbf]">
          <main className="mx-auto flex h-screen w-full max-w-325 flex-col overflow-hidden p-2 sm:p-4">
            {children}

            <footer className="taskbar mt-2 flex flex-wrap items-center gap-2 border border-[#55704e] px-2 py-2 text-[#111a0f] sm:flex-nowrap">
              <button
                type="button"
                className="border border-[#2f402b] bg-[linear-gradient(180deg,#d6e8c8_0,#95b580_100%)] px-3 py-1 font-title text-sm tracking-wider"
              >
                KIM
              </button>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap">
                {/* {openedApps.map((app) => (
              <button
                key={app.name}
                type="button"
                className={`max-w-full truncate border px-2 py-1 text-xs tracking-wide ${
                  app.active
                    ? "border-[#293f2e] bg-[linear-gradient(180deg,#d7ebc9_0,#90ad7f_100%)]"
                    : "border-[#607a5a] bg-[linear-gradient(180deg,#96b285_0,#6f8865_100%)] text-[#e9f0dd]"
                }`}
              >
                {app.name}
              </button>
            ))} */}
              </div>

              <div className="ml-auto border border-[#3d5840] bg-[linear-gradient(180deg,#c3d8b7_0,#89a57b_100%)] px-3 py-1 text-sm tracking-wider">
                24 ene 1999 | 23:07
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  )
}
