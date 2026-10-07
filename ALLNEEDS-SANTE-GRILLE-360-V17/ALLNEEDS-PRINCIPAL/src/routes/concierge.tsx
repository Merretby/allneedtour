import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layouts'

export const Route = createFileRoute('/concierge')({
  component: () => (
    <AppShell variant="concierge">
      <Outlet />
    </AppShell>
  ),
})
