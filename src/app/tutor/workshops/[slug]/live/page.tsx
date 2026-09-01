import { notFound } from 'next/navigation'
import { attendees, chatMessages, getWorkshop, questions } from '@/lib/mock'
import { LiveRoom } from '@/components/live-room'

// Screen 20 — the live room, host view.
export default async function HostLivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()
  const present = attendees.filter((a) => a.status === 'PRESENT').length
  const hands = attendees.filter((a) => a.handRaised).length

  return (
    <LiveRoom
      host
      title={workshop.title}
      tutorName={workshop.tutor.name}
      learnerEmail={`${workshop.tutor.handle}@skedo.in`}
      seatNumber={0}
      initialQuestions={questions}
      chat={chatMessages}
      attendeeCount={present}
      handsRaised={hands}
    />
  )
}
