import { ChatWindow } from '@/components/windows/chat'
import { CHATROOM_SOURCE_BY_ID } from '@/lib/chatrooms'

export async function generateStaticParams() {
  return Object.keys(CHATROOM_SOURCE_BY_ID).map((id) => ({ chatroom: id }))
}

export default async function Page({ params }: PageProps<'/kim/[chatroom]'>) {
  const { chatroom } = await params

  return <ChatWindow chatroom={chatroom} />
}
