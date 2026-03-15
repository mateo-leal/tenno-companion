import Image from 'next/image'
import Link from 'next/link'

export function Taskbar() {
  return (
    <footer className="taskbar mt-2 flex flex-wrap items-center gap-2 border border-[#55704e] px-2 py-1 text-[#111a0f] sm:flex-nowrap">
      <Link href="/kim">
        <Image
          src="https://wiki.warframe.com/images/KIMChat.png"
          alt="KIM"
          width={45}
          height={45}
        />
      </Link>

      <div className="ml-auto text-sm tracking-wider">
        {new Date().toLocaleString('en-US', {
          dateStyle: 'long',
        })}
      </div>
    </footer>
  )
}
