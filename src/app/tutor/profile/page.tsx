import { tutor } from '@/lib/mock'
import {
  Badge,
  Button,
  ButtonLink,
  Callout,
  Card,
  Field,
  Input,
  PageHeader,
  Textarea,
} from '@/components/ui'

// Screen 13 — Tutor profile. This is the learner's entire basis for trusting you.
export default function TutorProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Profile"
        title="How learners see you"
        lead="On a platform nobody has heard of yet, your profile is the whole reason a stranger pays. Fill it in properly."
        actions={
          <ButtonLink href={`/@${tutor.handle}`} variant="secondary">
            View public page
          </ButtonLink>
        }
      />

      <form className="mt-6 flex flex-col gap-5">
        <Card className="flex flex-col gap-5 p-5">
          <Field label="Full name" required hint="Appears on every certificate you issue.">
            <Input defaultValue={tutor.name} />
          </Field>

          <Field label="Handle" required hint="Your permanent link — reuse it in every bio and post.">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-ink-faint">skedo.in/@</span>
              <Input defaultValue={tutor.handle} className="flex-1" />
            </div>
          </Field>

          <Field label="Headline" required hint="One line. What you do, and for how long.">
            <Input defaultValue={tutor.headline} />
          </Field>

          <Field
            label="Credential"
            hint="Printed on certificates under your name. Job title and company works well."
          >
            <Input defaultValue={tutor.credential} />
          </Field>

          <Field
            label="About you"
            required
            hint="Why you specifically. Concrete beats impressive — what have you actually shipped?"
          >
            <Textarea defaultValue={tutor.bio} rows={5} />
          </Field>

          <Field label="Skills" hint="Comma separated. Used for search later.">
            <Input defaultValue={tutor.skills.join(', ')} />
          </Field>
        </Card>

        <Card className="flex flex-col gap-5 p-5">
          <div>
            <h2 className="text-lg">Proof you are real</h2>
            <p className="mt-1 text-sm text-ink-soft">
              At least one working link. This does more for conversion than anything else on the page.
            </p>
          </div>
          <Field label="LinkedIn">
            <Input defaultValue="https://linkedin.com/in/…" />
          </Field>
          <Field label="Portfolio or website">
            <Input defaultValue="https://…" />
          </Field>
        </Card>

        <Card className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg">Verification</h2>
            <Badge tone="brand">Verified</Badge>
          </div>
          <Callout tone="neutral">
            Phase 1 verification is a fifteen-minute call — identity checks confirm who you are, not
            whether you are any good. Bank details and KYC arrive when the platform opens to other
            tutors and Skedo starts handling payouts.
          </Callout>
        </Card>

        <div className="flex gap-2">
          <Button size="lg" type="submit">
            Save profile
          </Button>
          <Button size="lg" variant="ghost" type="reset">
            Discard changes
          </Button>
        </div>
      </form>
    </div>
  )
}
