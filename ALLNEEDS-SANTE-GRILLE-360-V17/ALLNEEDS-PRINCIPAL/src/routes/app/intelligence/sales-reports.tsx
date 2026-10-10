import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/intelligence/sales-reports')({
  component: SalesReportsPage,
})

function SalesReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Reports</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  )
}
