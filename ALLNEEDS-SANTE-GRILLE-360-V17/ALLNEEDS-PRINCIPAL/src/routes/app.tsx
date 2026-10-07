import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layouts'

export const Route = createFileRoute('/app')({
  component: () => (
    <AppShell variant="client">
      <Outlet />
    </AppShell>
  ),
})
