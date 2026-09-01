import { PageHeader } from '@/components/ui'
import { WorkshopForm } from '@/components/workshop-form'

export default function NewWorkshopPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="New workshop"
        title="Set up your session"
        lead="One hour, twenty seats. You can edit anything until the first seat sells."
      />
      <div className="mt-6">
        <WorkshopForm />
      </div>
    </div>
  )
}
