import { createFileRoute } from '@tanstack/react-router'
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
  AlertCircle, Package, Utensils, Receipt, ChevronDown,
  ArrowUpRight, ArrowDownRight, Clock, Plus
} from 'lucide-react'

export const Route = createFileRoute('/business/restaurant/dashboard')({
  component: DashboardPage,
})

function MetricCard({ title, value, trend, isPositive, prefix = "" }: { title: string, value: string, trend: string, isPositive: boolean, prefix?: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900">{prefix}{value}</span>
        <span className={`flex items-center text-xs font-medium mb-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          {trend}
        </span>
      </div>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Today's Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time performance and alerts for Oct 10, 2026</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50">
            Today <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm">
            <Plus size={14} /> New Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Today's Revenue" value="12,450" prefix="MAD " trend="+14.2%" isPositive={true} />
        <MetricCard title="Order Volume" value="142" trend="+5.4%" isPositive={true} />
        <MetricCard title="Average Order Value" value="87.6" prefix="MAD " trend="-1.2%" isPositive={false} />
        <MetricCard title="Est. Gross Margin" value="68.4" prefix="%" trend="+2.1%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Sales Trends</h3>
            <button className="text-sm text-brand-600 font-medium hover:text-brand-700">View Full Report</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 55, 45, 70, 65, 85, 90, 75, 60, 50, 45, 65].map((h, i) => (
              <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all group-hover:bg-green-600" 
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-slate-400 px-2">
            <span>8 AM</span>
            <span>12 PM</span>
            <span>4 PM</span>
            <span>8 PM</span>
            <span>12 AM</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-4">Operational Alerts</h3>
          <div className="flex-1 space-y-3">
            <div className="flex gap-3 p-3 bg-red-50 text-red-900 rounded-lg border border-red-100">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Low Stock Warning</p>
                <p className="text-xs text-red-700 mt-1">Fresh Salmon is below minimum threshold (2kg remaining).</p>
              </div>
            </div>
            
            <div className="flex gap-3 p-3 bg-amber-50 text-amber-900 rounded-lg border border-amber-100">
              <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Delayed Orders</p>
                <p className="text-xs text-amber-700 mt-1">Table 12 has been waiting for mains &gt; 25 mins.</p>
              </div>
            </div>
            
            <div className="flex gap-3 p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
              <Utensils size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Menu Intelligence</p>
                <p className="text-xs text-blue-700 mt-1">Truffle Risotto margin dropped to 62% due to supplier price increase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Best-Selling Products</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-right">Sold</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: "Classic Burger", cat: "Mains", sold: 42, rev: "3,360" },
                { name: "Margherita Pizza", cat: "Mains", sold: 38, rev: "2,660" },
                { name: "Caesar Salad", cat: "Starters", sold: 29, rev: "1,740" },
                { name: "Draft Beer", cat: "Drinks", sold: 65, rev: "2,600" }
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-5 py-3 text-slate-500">{item.cat}</td>
                  <td className="px-5 py-3 text-slate-900 text-right">{item.sold}</td>
                  <td className="px-5 py-3 text-slate-900 text-right font-medium">{item.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent Orders</h3>
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order #</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: "#2455", status: "Preparing", type: "Dine-in (T12)", total: "450" },
                { id: "#2454", status: "Completed", type: "Takeaway", total: "220" },
                { id: "#2453", status: "Completed", type: "Dine-in (T04)", total: "890" },
                { id: "#2452", status: "Completed", type: "Delivery", total: "310" }
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">{item.id}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{item.type}</td>
                  <td className="px-5 py-3 text-slate-900 text-right font-medium">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
