import { ChatWindow } from '@/components/windows/chat'

export default async function Page({ params }: PageProps<'/kim/[chatroom]'>) {
  const { chatroom } = await params

  return <ChatWindow chatroom={chatroom} />
}
