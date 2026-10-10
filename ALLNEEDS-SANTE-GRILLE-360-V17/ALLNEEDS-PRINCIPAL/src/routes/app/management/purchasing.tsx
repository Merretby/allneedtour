import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search, Filter, ShoppingBag, Truck, Package, ArrowRight, AlertTriangle, ArrowDown } from 'lucide-react'

export const Route = createFileRoute('/app/management/purchasing')({
  component: PurchasingPage,
})

function PurchasingPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchasing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage purchase orders and supplier deliveries</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
            Receive Goods
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors">
            <Plus size={16} /> New Purchase Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingBag size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Pending Orders</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">3</p>
          <p className="text-sm text-slate-500 mt-1">Expected today or tomorrow</p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Suggested Replenishment</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">12</p>
          <p className="text-sm text-slate-500 mt-1">Items below minimum stock level</p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ArrowDown size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Price Drops</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">4</p>
          <p className="text-sm text-slate-500 mt-1">Ingredients cheaper than last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-900">Purchase Order History</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search PO..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <button className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-medium">PO Number</th>
                  <th className="px-5 py-3 font-medium">Supplier</th>
                  <th className="px-5 py-3 font-medium">Expected Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: "PO-1045", supplier: "Fresh Produce Co.", date: "Today", status: "In Transit", amount: "1,250 MAD" },
                  { id: "PO-1044", supplier: "Atlas Meats", date: "Tomorrow", status: "Confirmed", amount: "4,800 MAD" },
                  { id: "PO-1043", supplier: "Baking Supplies Ltd.", date: "Oct 12, 2026", status: "Draft", amount: "850 MAD" },
                  { id: "PO-1042", supplier: "Fresh Produce Co.", date: "Oct 08, 2026", status: "Received", amount: "1,120 MAD" },
                  { id: "PO-1041", supplier: "Beverage Distributors", date: "Oct 07, 2026", status: "Received", amount: "2,300 MAD" },
                ].map((po, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 cursor-pointer">
                    <td className="px-5 py-3 font-medium text-slate-900">{po.id}</td>
                    <td className="px-5 py-3 text-slate-600">{po.supplier}</td>
                    <td className="px-5 py-3 text-slate-500">{po.date}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        po.status === 'Received' ? 'bg-green-100 text-green-700' : 
                        po.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                        po.status === 'Confirmed' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900">{po.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-amber-50/30">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Package size={16} className="text-amber-500" />
              Suggested Orders
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-slate-100">
              {[
                { name: "Fresh Salmon", current: "2kg", min: "5kg", supplier: "Ocean Catch", est: "1,200 MAD" },
                { name: "Avocados", current: "15 units", min: "40 units", supplier: "Fresh Produce Co.", est: "350 MAD" },
                { name: "Pizza Flour (00)", current: "10kg", min: "25kg", supplier: "Baking Supplies Ltd.", est: "180 MAD" },
              ].map((item, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-900">{item.name}</h4>
                    <span className="text-xs font-medium text-slate-500">{item.est}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500 mb-3">
                    <span className="text-red-600 font-medium">Stock: {item.current}</span>
                    <span>Min: {item.min}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Truck size={12} /> {item.supplier}
                    </span>
                    <button className="text-xs font-medium text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-md transition-colors">
                      Add to PO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
              Create POs from Suggestions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
