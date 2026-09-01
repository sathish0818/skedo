import { certificate } from '@/lib/mock'
import { Badge, ButtonLink, Card, Eyebrow } from '@/components/ui'
import { formatDateLong } from '@/lib/format'
import { CERTIFICATE } from '@/lib/rules'

/**
 * Screen 09 — the certificate, and its public verification page. Same screen for
 * both: anyone with the code can confirm it is real, which is the entire point.
 *
 * Deliberately titled "Certificate of Participation". It claims attendance and
 * nothing more — the research is unambiguous that overclaiming is what makes
 * certificates worthless.
 */
export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const cert = { ...certificate, code: decodeURIComponent(code) }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="brand">Verified</Badge>
          <p className="text-sm text-ink-soft">This certificate was issued by Skedo.</p>
        </div>
        <p className="font-mono text-xs text-ink-faint">{cert.code}</p>
      </div>

      {/* Print layout is a fixed A4 landscape sheet; on screen it scales down. */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex flex-col gap-6 border-b-4 border-brand bg-surface px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl">Skedo</p>
              <Eyebrow className="mt-1">{CERTIFICATE.TITLE}</Eyebrow>
            </div>
            <div className="text-right">
              <Eyebrow>Attendance</Eyebrow>
              <p className="font-display text-lg tabular">
                {cert.minutesPresent}/{cert.totalMinutes} min
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-ink-soft">This certifies that</p>
            <p className="mt-1 font-display text-3xl sm:text-4xl">{cert.learnerName}</p>
            <p className="mt-4 max-w-[52ch] text-sm text-ink-soft">
              attended the live one-hour workshop
            </p>
            <p className="mt-1 font-display text-xl sm:text-2xl">{cert.workshopTitle}</p>
          </div>

          <dl className="grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <Eyebrow>Date</Eyebrow>
              <dd className="mt-1 text-sm">{formatDateLong(cert.sessionDate)}</dd>
            </div>
            <div>
              <Eyebrow>Led by</Eyebrow>
              <dd className="mt-1 text-sm">
                {cert.tutorName}
                <span className="block text-xs text-ink-faint">{cert.tutorCredential}</span>
              </dd>
            </div>
            <div>
              <Eyebrow>Verify at</Eyebrow>
              <dd className="mt-1 font-mono text-xs break-all">skedo.in/verify/{cert.code}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap gap-2">
        <ButtonLink href="#">Download PDF</ButtonLink>
        <ButtonLink href="#" variant="secondary">
          Add to LinkedIn
        </ButtonLink>
      </div>

      <p className="mt-6 max-w-[62ch] text-xs text-ink-faint">
        A Skedo certificate records measured attendance at a live session — the platform logs when a
        learner joined and left. It is not an accreditation and does not imply any qualification.
      </p>
    </div>
  )
}
