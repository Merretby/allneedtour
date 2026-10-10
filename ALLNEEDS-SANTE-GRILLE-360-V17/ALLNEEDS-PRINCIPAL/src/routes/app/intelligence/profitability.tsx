import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, ArrowUpRight } from 'lucide-react'

export const Route = createFileRoute('/app/intelligence/profitability')({
  component: ProfitabilityPage,
})

function ProfitabilityPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profit Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">Analyze your margins and discover profitability opportunities</p>
        </div>
        <select className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
          <option>Last 30 Days</option>
          <option>This Month</option>
          <option>Last Quarter</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Estimated Net Profit</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold text-slate-900">42,850<span className="text-xl text-slate-500 font-medium ml-1">MAD</span></span>
            <span className="flex items-center text-sm font-medium text-green-600 mb-1.5">
              <TrendingUp size={14} className="mr-1" /> +8.4%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
          </div>
          <p className="text-xs text-slate-500">22% Net Profit Margin</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Food Cost (COGS)</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold text-slate-900">31%</span>
            <span className="flex items-center text-sm font-medium text-red-600 mb-1.5">
              <TrendingUp size={14} className="mr-1" /> +2.1%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden flex">
            <div className="bg-brand-500 h-2 rounded-l-full" style={{ width: '31%' }}></div>
            <div className="bg-slate-200 h-2" style={{ width: '69%' }}></div>
          </div>
          <p className="text-xs text-slate-500">Target is 28%. Currently exceeding by 3%.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Labor Cost</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold text-slate-900">24%</span>
            <span className="flex items-center text-sm font-medium text-green-600 mb-1.5">
              <TrendingDown size={14} className="mr-1" /> -1.5%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden flex">
            <div className="bg-blue-500 h-2 rounded-l-full" style={{ width: '24%' }}></div>
            <div className="bg-slate-200 h-2" style={{ width: '76%' }}></div>
          </div>
          <p className="text-xs text-slate-500">Target is 25%. Currently optimal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <AlertCircle size={18} />
              Margin Warnings
            </div>
          </div>
          <div className="p-0 flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-medium">Menu Item</th>
                  <th className="px-5 py-3 font-medium text-right">Old Margin</th>
                  <th className="px-5 py-3 font-medium text-right">New Margin</th>
                  <th className="px-5 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Truffle Risotto", old: "72%", new: "62%", drop: "-10%", reason: "Truffle oil price +25%" },
                  { name: "Beef Tartare", old: "68%", new: "61%", drop: "-7%", reason: "Premium beef price +15%" },
                  { name: "Avocado Toast", old: "81%", new: "75%", drop: "-6%", reason: "Avocado seasonal price" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-red-600 mt-1">{item.reason}</div>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500">{item.old}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-semibold text-red-600">{item.new}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-brand-600 hover:text-brand-800 font-medium text-xs bg-brand-50 px-3 py-1.5 rounded-md hover:bg-brand-100 transition-colors">
                        Review Price
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-green-50/50">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <Activity size={18} />
              AI Recommendations
            </div>
          </div>
          <div className="p-5 flex-1 space-y-4">
            <div className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowUpRight size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Raise price on Classic Burger</h4>
                <p className="text-sm text-slate-600 mt-1 mb-2">
                  Classic Burger is your #1 seller but has a below-average margin (64%). Raising the price by 5 MAD could yield an estimated +2,400 MAD monthly profit with minimal volume impact.
                </p>
                <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-md shadow-sm hover:bg-slate-50">
                  Apply Change
                </button>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Switch supplier for Olive Oil</h4>
                <p className="text-sm text-slate-600 mt-1 mb-2">
                  You are currently paying 85 MAD/L for Extra Virgin Olive Oil. "Atlas Foods" offers a comparable grade at 72 MAD/L. Switching could save ~950 MAD/month.
                </p>
                <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-md shadow-sm hover:bg-slate-50">
                  View Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
