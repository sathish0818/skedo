import { notFound } from 'next/navigation'
import { getWorkshop, chatMessages, questions } from '@/lib/mock'
import { Avatar, Badge, Button, Card, Eyebrow, Input } from '@/components/ui'
import { CHAT } from '@/lib/rules'

/**
 * Screen 11 — the workshop channel. Stays open for 30 days after the session,
 * because isolation is the most consistently documented reason people drift away
 * — and because questions the Q&A ran out of time for get answered here.
 */
export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()
  const answered = questions.filter((q) => q.answered && q.answerBody)

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <Eyebrow>Workshop chat</Eyebrow>
          <h1 className="mt-1 text-xl">{workshop.title}</h1>
        </div>
        <Badge tone="neutral">Open for {CHAT.OPEN_DAYS_AFTER_SESSION} days</Badge>
      </header>

      {answered.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg">Answered after the session</h2>
          <p className="mt-1 text-sm text-ink-faint">
            Questions the Q&amp;A ran out of time for, answered in writing.
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {answered.map((q) => (
              <Card as="li" key={q.id} className="p-4">
                <p className="text-sm font-medium">{q.body}</p>
                <p className="mt-2 text-sm text-ink-soft">{q.answerBody}</p>
                <p className="mt-2 text-xs text-ink-faint">— {workshop.tutor.name}</p>
              </Card>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 flex flex-col gap-4">
        <h2 className="text-lg">Messages</h2>
        <ul className="flex flex-col gap-4">
          {chatMessages.map((msg) => (
            <li key={msg.id} className="flex gap-3">
              <Avatar name={msg.from} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">{msg.from}</span>
                  {msg.fromTutor && <Badge tone="brand">Tutor</Badge>}
                  <span className="text-xs text-ink-faint tabular">{msg.at}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{msg.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <form className="pb-safe sticky bottom-0 mt-6 flex gap-2 border-t border-line bg-paper py-4">
        <Input placeholder="Ask a follow-up…" aria-label="Message" className="flex-1" />
        <Button type="submit" className="shrink-0">
          Send
        </Button>
      </form>
    </div>
  )
}
