import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business/restaurant/intelligence/product-performance')({
  component: ProductPerformancePage,
})

function ProductPerformancePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Performance</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  )
}
