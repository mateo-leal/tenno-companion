import { ChatroomSelector } from '@/components/chatroom-selector'
import Image from 'next/image'

export default function Layout({ children }: LayoutProps<'/kim'>) {
  return (
    <div className="desktop-area relative min-h-0 flex-1 overflow-hidden border border-[#4e3b16] bg-black/45 p-2 sm:p-3">
      <aside className="kim-window absolute top-3 bottom-3 left-3 flex w-[320px] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden">
        <header className="window-titlebar">
          <p className="window-title">¡Bienvenidos a KIM!</p>
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
                Nombre de usuario:
              </p>
              <p className="font-title text-3xl leading-none">Viajero</p>
            </div>
          </div>
          <div className="mt-3 min-h-0 flex-1 overflow-hidden">
            <ChatroomSelector />
          </div>
          {/* <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {['Lotes', 'Mapa', 'Historia', 'Runas'].map((item) => (
              <button
                key={item}
                className="border border-[#8f5d1f] bg-[#1d1308] px-2 py-1 tracking-wider text-[#d4be8a] hover:bg-[#372413]"
                type="button"
              >
                {item}
              </button>
            ))}
          </div> */}
        </div>
      </aside>

      {children}
    </div>
  )
}
