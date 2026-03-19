import type { Metadata } from 'next'
import { ChatWindow } from '@/components/windows/chat'
import { CHATROOM_SOURCE_BY_ID } from '@/lib/chatrooms'
import { capitalizeFirstLetter } from '@/lib/utils'

export async function generateStaticParams() {
  return Object.keys(CHATROOM_SOURCE_BY_ID).map((id) => ({ chatroom: id }))
}

export async function generateMetadata({
  params,
}: PageProps<'/kim/[chatroom]'>): Promise<Metadata> {
  const { chatroom } = await params
  const source = CHATROOM_SOURCE_BY_ID[chatroom]

  if (!source) {
    return {
      title: 'Chatroom Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const chatroomName = capitalizeFirstLetter(chatroom.replace('-', ' '))

  return {
    title: `${chatroomName} KIM Dialogue`,
    description: `Simulate and analyze ${chatroomName} KIM dialogue paths with chemistry, thermostat, and boolean state outcomes.`,
    alternates: {
      canonical: `/kim/${chatroom}`,
    },
    openGraph: {
      title: `${chatroomName} KIM Dialogue`,
      description: `Simulate and analyze ${chatroomName} KIM dialogue paths with chemistry, thermostat, and boolean state outcomes.`,
      url: `/kim/${chatroom}`,
    },
  }
}

export default async function Page({ params }: PageProps<'/kim/[chatroom]'>) {
  const { chatroom } = await params

  return <ChatWindow chatroom={chatroom} />
}
