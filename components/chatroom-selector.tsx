'use client'

import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const hexChatrooms = [
  {
    id: 'hex',
    name: 'The Hex',
    icon: 'https://wiki.warframe.com/images/HexIcon.png',
  },
  {
    id: 'arthur',
    name: 'Broadsword (Arthur)',
    icon: 'https://wiki.warframe.com/images/ArthurPixelGlyph.png',
  },
  {
    id: 'eleanor',
    name: 'Salem (Eleanor)',
    icon: 'https://wiki.warframe.com/images/EleanorPixelGlyph.png',
  },
  {
    id: 'lettie',
    name: 'Belladona ~{@ (Lettie)',
    icon: 'https://wiki.warframe.com/images/LettiePixelGlyph.png',
  },
  {
    id: 'amir',
    name: 'H16h V0l7463 (Amir)',
    icon: 'https://wiki.warframe.com/images/AmirPixelGlyph.png',
  },
  {
    id: 'aoi',
    name: 'xX GLIMMER Xx (Aoi)',
    icon: 'https://wiki.warframe.com/images/AoiPixelGlyph.png',
  },
  {
    id: 'quincy',
    name: 'Soldja1Shot1kil (Quincy)',
    icon: 'https://wiki.warframe.com/images/QuincyPixelGlyph.png',
  },
  {
    id: 'flare',
    name: 'Liminus_Star (Flare)',
    icon: 'https://wiki.warframe.com/images/FlarePixelGlyph.png',
  },
  {
    id: 'kaya',
    name: 'KOLTrial_5115 (Kaya)',
    icon: 'https://wiki.warframe.com/images/KayaPixelGlyph.png',
  },
  {
    id: 'minerva-velimir',
    name: 'Minerva, Velimir',
    icon: 'https://wiki.warframe.com/images/MinervaPixelGlyph.png',
  },
]

const cathedraleChatrooms = [
  {
    id: 'loid',
    name: 'POM2_LAB1 (Loid)',
  },
  {
    id: 'lyon',
    name: 'Lyon',
  },
  {
    id: 'marie',
    name: 'Marie',
  },
  {
    id: 'roathe',
    name: 'Roathe',
  },
]

export function ChatroomSelector() {
  const pathname = usePathname()

  return (
    <Tabs defaultValue="hex" className="h-full min-h-0 flex-col gap-0 pt-4">
      <TabsList className="shrink-0 gap-1 p-0">
        <TabsTrigger
          value="hex"
          className="p-0 border-4 border-primary/50 data-active:border-b-primary"
        >
          <Image
            src="https://wiki.warframe.com/images/HexIcon.png"
            alt="The Hex"
            width={60}
            height={60}
            className="bg-[#2a3314]"
          />
        </TabsTrigger>
        <TabsTrigger
          value="cathedrale"
          className="p-0 border-4 border-primary/50 data-active:border-b-primary"
        >
          <Image
            src="https://wiki.warframe.com/images/LotusSymbolGlyph.png"
            alt="La Cathédrale"
            width={60}
            height={60}
            className="bg-[#2a3314]"
          />
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="hex"
        className="border-t-4 border-primary/50 -mt-1 flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ul className="-mt-1 min-h-0 flex-1 overflow-y-auto border-4 border-primary/50 py-1">
          {hexChatrooms.map((chatroom) => (
            <li key={chatroom.id} className="mx-1">
              <Link
                href={`/kim/${chatroom.id}`}
                className={cn(
                  'inline-flex w-full gap-2 bg-accent/40 hover:bg-accent data-active:bg-accent',
                  {
                    'bg-accent': pathname === `/kim/${chatroom.id}`,
                  }
                )}
              >
                <Image
                  src={chatroom.icon}
                  alt={chatroom.name}
                  width={65}
                  height={65}
                  className={cn('border-2 border-primary/50', {
                    'bg-[#2a3314]': chatroom.id === 'hex',
                  })}
                />
                <span className="text-xl">{chatroom.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent
        value="cathedrale"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ul className="-mt-1 min-h-0 flex-1 overflow-y-auto border-4 border-primary/50 py-1">
          {cathedraleChatrooms.map((chatroom) => (
            <li key={chatroom.id} className="mx-1">
              <Link
                href={`/kim/${chatroom.id}`}
                className={cn(
                  'inline-flex w-full items-center gap-2 bg-accent/40 px-3 py-3 text-left hover:bg-accent data-active:bg-accent',
                  {
                    'bg-accent': pathname === `/kim/${chatroom.id}`,
                  }
                )}
              >
                <span className="font-title text-xl">{chatroom.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  )
}
