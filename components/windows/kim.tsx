import Image from 'next/image'
import { ChatroomSelector } from '../chatroom-selector'

export function KimWindow() {
  return (
    <aside className="kim-window absolute top-3 bottom-3 left-3 flex w-[320px] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden">
      <header className="window-titlebar">
        <p className="window-title">Welcome to KIM!</p>
      </header>
      <div className="window-content flex min-h-0 flex-1 flex-col border-t border-[#8f5d1f] bg-[#060606] p-2">
        <div className="flex gap-3 text-primary">
          <Image
            src="https://wiki.warframe.com/images/LotusSymbolGlyph.png"
            alt="Lotus Symbol"
            width={70}
            height={70}
            className="border-4 border-primary/70"
          />
          <div>
            <p className="font-title text-xl tracking-wide uppercase">
              Username:
            </p>
            <p className="font-title text-3xl leading-none">Drifter</p>
          </div>
        </div>
        <div className="mt-3 min-h-0 flex-1 overflow-hidden">
          <ChatroomSelector />
        </div>
      </div>
    </aside>
  )
}
