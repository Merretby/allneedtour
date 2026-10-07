import { Outlet, createFileRoute } from '@tanstack/react-router'
import { LaunchBanner, PublicFooter, PublicHeader } from '@/components/marketing'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <LaunchBanner />
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  )
}
