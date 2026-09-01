import { chatMessages, getBooking, questions } from '@/lib/mock'
import { LiveRoom } from '@/components/live-room'

// Screen 07 — the live room, learner view.
export default async function LivePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const booking = getBooking(token)

  return (
    <LiveRoom
      title={booking.workshop.title}
      tutorName={booking.workshop.tutor.name}
      learnerEmail="priya.ramanathan@example.com"
      seatNumber={booking.seatNumber}
      initialQuestions={questions}
      chat={chatMessages}
    />
  )
}
