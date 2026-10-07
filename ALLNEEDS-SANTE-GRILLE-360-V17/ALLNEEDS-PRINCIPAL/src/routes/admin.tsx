import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layouts'

export const Route = createFileRoute('/admin')({
  component: () => (
    <AppShell variant="admin">
      <Outlet />
    </AppShell>
  ),
})
