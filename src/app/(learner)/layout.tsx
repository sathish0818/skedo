import { LearnerHeader, SiteFooter } from '@/components/shell'

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <LearnerHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}
