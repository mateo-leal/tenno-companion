import { KimWindow } from '@/components/windows/kim'

export default function Layout({ children }: LayoutProps<'/kim'>) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <KimWindow />

      {children}
    </div>
  )
}
