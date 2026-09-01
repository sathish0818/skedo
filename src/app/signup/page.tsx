import Link from 'next/link'
import { Button, Callout, Card, Eyebrow, Field, Input } from '@/components/ui'
import { Logo } from '@/components/shell'
import { TUTOR_TIER } from '@/lib/rules'

// Screen 12 — Sign up. Email magic link: no password to forget or leak.
export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <Logo />

      <header className="mt-8 flex flex-col gap-2">
        <Eyebrow>Teach on Skedo</Eyebrow>
        <h1 className="text-2xl sm:text-3xl">Run your first workshop</h1>
        <p className="text-ink-soft">
          You bring your audience. Skedo handles payment, reminders, the live room, attendance and
          certificates.
        </p>
      </header>

      <Card className="mt-6 flex flex-col gap-4 p-5">
        <form className="flex flex-col gap-4">
          <Field label="Email address" required hint="We send a sign-in link — no password to remember.">
            <Input type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
          </Field>
          <Button size="lg" full type="submit">
            Send me a sign-in link
          </Button>
        </form>
        <p className="text-center text-xs text-ink-faint">
          Already have an account? The same link signs you in.
        </p>
      </Card>

      <Callout tone="neutral" title="What to expect">
        <ul className="mt-1 flex flex-col gap-1.5">
          <li>Free tier runs {TUTOR_TIER.FREE.SESSIONS_PER_WEEK} session a week, up to 20 seats.</li>
          <li>You set the price — free, or anything from ₹49 up.</li>
          <li>
            Skedo keeps 20% of what you sell, capped at ₹2,500 per session. You see the exact number
            before you publish.
          </li>
          <li>Filling the seats is on you. We generate the poster; you post it.</li>
        </ul>
      </Callout>

      <Link href="/" className="mt-6 text-center text-sm text-ink-soft hover:text-ink">
        ← Back to workshops
      </Link>
    </div>
  )
}
