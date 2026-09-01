import { getWorkshops } from '@/lib/mock'
import { WorkshopCard } from '@/components/workshop'
import { ButtonLink, Eyebrow } from '@/components/ui'

// Screen 02 — Browse. Every workshop that is open for booking.
export default function BrowsePage() {
  const workshops = getWorkshops()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10 sm:py-16">
        <Eyebrow>Live · 20 seats · one hour</Eyebrow>
        <h1 className="mt-3 max-w-[22ch] text-3xl leading-[1.1] sm:text-5xl">
          Learn one thing properly, in an hour, from someone who does it.
        </h1>
        <p className="mt-4 max-w-[54ch] text-ink-soft sm:text-lg">
          Forty minutes of someone building in front of you, then twenty minutes where you can
          actually ask. Twenty seats, so your question gets answered.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="#upcoming" size="lg">
            See upcoming sessions
          </ButtonLink>
          <ButtonLink href="/signup" size="lg" variant="secondary">
            Teach on Skedo
          </ButtonLink>
        </div>
      </section>

      <section id="upcoming" className="scroll-mt-20 border-t border-line py-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl sm:text-2xl">Upcoming</h2>
          <p className="text-sm text-ink-faint">{workshops.length} open for booking</p>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.slug} workshop={workshop} />
          ))}
        </ul>
      </section>
    </div>
  )
}
