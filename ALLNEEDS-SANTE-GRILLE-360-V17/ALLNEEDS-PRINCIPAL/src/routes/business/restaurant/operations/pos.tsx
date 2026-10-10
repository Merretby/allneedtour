import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business/restaurant/operations/pos')({
  component: POSandSalesPage,
})

function POSandSalesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">POS and Sales</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  )
}
