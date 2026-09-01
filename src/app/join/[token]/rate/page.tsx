import Link from 'next/link'
import { getBooking } from '@/lib/mock'
import { Button, ButtonLink, Card, Eyebrow, Textarea } from '@/components/ui'
import { Logo } from '@/components/shell'
import { CERTIFICATE } from '@/lib/rules'

// Screen 08 — one tap after the session. This is how we learn anything at all.
export default async function RatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const booking = getBooking(token)

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 py-6 sm:px-6 sm:py-12">
      <Logo />

      <header className="mt-10 flex flex-col gap-2">
        <Eyebrow>That&rsquo;s a wrap</Eyebrow>
        <h1 className="text-2xl sm:text-3xl">How was it?</h1>
        <p className="text-ink-soft">
          One tap is plenty. It decides which tutors we put in front of people.
        </p>
      </header>

      <Card className="mt-6 flex flex-col gap-5 p-5">
        <fieldset>
          <legend className="text-sm font-medium">Your rating</legend>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <label
                key={score}
                className="flex-1 cursor-pointer rounded-card border border-line py-3 text-center text-lg has-checked:border-brand has-checked:bg-brand-tint"
              >
                <input type="radio" name="score" value={score} className="sr-only" />
                {score}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-faint">1 = not worth it · 5 = would book again</p>
        </fieldset>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Anything the tutor should know?</span>
          <Textarea placeholder="Optional. Only the tutor sees this, without your name." />
        </label>

        <Button size="lg" full type="submit">
          Send feedback
        </Button>
      </Card>

      <Card className="mt-5 p-5">
        <Eyebrow>Coming to your inbox</Eyebrow>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-soft">
          <li>The recording, within an hour or two.</li>
          <li>
            Your certificate — you were present for {booking.minutesPresent ?? 57} minutes, which clears
            the {CERTIFICATE.THRESHOLD_MINUTES} needed.
          </li>
          <li>Written answers to anything the Q&amp;A ran out of time for.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href="/bookings" variant="secondary" size="sm">
            My bookings
          </ButtonLink>
          <ButtonLink href={`/chat/${booking.workshop.slug}`} variant="ghost" size="sm">
            Workshop chat
          </ButtonLink>
        </div>
      </Card>

      <Link href="/" className="mt-6 text-center text-sm text-ink-soft hover:text-ink">
        Browse other workshops
      </Link>
    </div>
  )
}
