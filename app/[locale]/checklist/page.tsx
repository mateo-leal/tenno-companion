import { ChecklistWindow } from '@/components/windows/checklist'

export default function Page() {
  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
      <div className="flex min-h-full flex-col gap-2 md:block">
        <ChecklistWindow />
      </div>
    </div>
  )
}
