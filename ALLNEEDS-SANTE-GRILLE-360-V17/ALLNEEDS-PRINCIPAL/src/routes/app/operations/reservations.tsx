import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/operations/reservations')({
  component: ReservationsPage,
})

function ReservationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  )
}
