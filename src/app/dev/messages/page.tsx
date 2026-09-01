import { MESSAGES } from '@/emails/templates'
import { Badge, Card, Eyebrow, PageHeader } from '@/components/ui'

/**
 * Not a product screen — a review surface. All nine messages side by side so
 * copy and layout can be checked without sending anything.
 */
export default function MessagesPreviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Internal · not linked from the app"
        title="The nine messages"
        lead="Every automated message Skedo sends. WhatsApp templates need Meta approval before they can send, so variables are written the way they get submitted."
      />

      <div className="mt-8 flex flex-col gap-10">
        {MESSAGES.map((message) => (
          <section key={message.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 border-b border-line pb-2">
              <span className="font-mono text-xs text-ink-faint">{message.id}</span>
              <h2 className="text-lg">{message.name}</h2>
              <Badge tone={message.channel === 'WHATSAPP' ? 'brand' : 'neutral'}>
                {message.channel === 'WHATSAPP' ? 'WhatsApp' : 'Email'}
              </Badge>
              <span className="ml-auto text-xs text-ink-faint">{message.when}</span>
            </div>

            {message.subject && (
              <p className="text-sm text-ink-soft">
                <Eyebrow className="inline">Subject</Eyebrow> {message.subject}
              </p>
            )}

            {message.channel === 'EMAIL' ? (
              <div className="overflow-hidden rounded-card border border-line">{message.body}</div>
            ) : (
              <Card className="max-w-md p-4">
                <div className="rounded-card rounded-bl-sm bg-brand-tint px-4 py-3 text-sm whitespace-pre-line">
                  {message.body}
                </div>
                <p className="mt-2 text-xs text-ink-faint">
                  WhatsApp template · approval required before first send
                </p>
              </Card>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
