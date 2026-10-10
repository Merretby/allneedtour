import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business/restaurant/operations/tables')({
  component: TablesandFloorPlanPage,
})

function TablesandFloorPlanPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tables and Floor Plan</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  )
}
