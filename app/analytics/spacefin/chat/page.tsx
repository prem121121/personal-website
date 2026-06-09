import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ChatClient from '@/components/spacefin/chat/ChatClient'

export const metadata = { title: 'Space Financial — AI Analyst' }

export default async function ChatPage() {
  const session = await auth()
  if (!session) redirect('/signin?callbackUrl=/analytics/spacefin/chat')

  return <ChatClient userName={session.user?.name ?? 'Analyst'} />
}
