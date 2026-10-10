import { createFileRoute } from '@tanstack/react-router'
import { Star, Gift, Users, QrCode, Settings2, Plus, Search, ChevronRight, Copy } from 'lucide-react'

export const Route = createFileRoute('/business/restaurant/growth/loyalty')({
  component: LoyaltyPage,
})

function LoyaltyPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Loyalty Program</h1>
          <p className="text-sm text-slate-500 mt-1">Manage rewards, track customer retention, and configure QR loyalty</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">
            <QrCode size={16} /> QR Materials
          </button>
          <button className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-brand-700">
            <Plus size={16} /> Create Reward
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Enrolled Customers</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">1,432</p>
          <p className="text-sm text-slate-500 mt-1"><span className="text-green-600 font-medium">+142</span> this month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
              <Star size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Repeat Rate</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">42.5%</p>
          <p className="text-sm text-slate-500 mt-1"><span className="text-green-600 font-medium">+2.1%</span> vs last month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Gift size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Rewards Redeemed</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">384</p>
          <p className="text-sm text-slate-500 mt-1">Free Coffee (Most popular)</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Settings2 size={16} />
            </div>
            <h3 className="font-semibold text-slate-900">Earning Rate</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">1 pt</p>
          <p className="text-sm text-slate-500 mt-1">per 10 MAD spent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Active Rewards</h3>
              <button className="text-sm text-brand-600 font-medium hover:text-brand-700">Manage Rules</button>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 font-medium">Reward Name</th>
                    <th className="px-5 py-3 font-medium">Cost</th>
                    <th className="px-5 py-3 font-medium">Redemptions</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Free Coffee or Espresso", cost: "50 pts", red: 245, status: "Active" },
                    { name: "15% Off Total Bill", cost: "200 pts", red: 89, status: "Active" },
                    { name: "Free Dessert", cost: "150 pts", red: 42, status: "Active" },
                    { name: "Birthday Special (20% Off)", cost: "Trigger: Birthday", red: 18, status: "Active" },
                  ].map((reward, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <Gift size={14} className="text-brand-500" />
                        {reward.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{reward.cost}</td>
                      <td className="px-5 py-4 text-slate-500">{reward.red}</td>
                      <td className="px-5 py-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {reward.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Recent Customer Activity</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search customer..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                    <th className="px-5 py-3 font-medium">Points Change</th>
                    <th className="px-5 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Youssef T.", action: "Purchase (Order #2455)", pts: "+45", time: "10 mins ago" },
                    { name: "Sarah M.", action: "Redeemed: Free Coffee", pts: "-50", time: "45 mins ago" },
                    { name: "Amine B.", action: "Signed up via QR", pts: "+10 (Bonus)", time: "2 hours ago" },
                    { name: "Kenza R.", action: "Purchase (Order #2441)", pts: "+12", time: "3 hours ago" },
                  ].map((act, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-900">{act.name}</td>
                      <td className="px-5 py-3 text-slate-600">{act.action}</td>
                      <td className="px-5 py-3">
                        <span className={`font-medium ${act.pts.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {act.pts}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-xs">{act.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-md">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <QrCode size={20} />
              QR Loyalty System
            </h3>
            <p className="text-brand-100 text-sm mb-6">
              Customers can scan this code at their table or the counter to earn points and view the digital menu.
            </p>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restoos.com/demo/loyalty" 
                alt="QR Code" 
                className="w-32 h-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value="restoos.com/demo/loyalty"
                className="bg-brand-900/50 border border-brand-500/50 rounded-lg px-3 py-2 text-xs flex-1 text-brand-100 outline-none"
              />
              <button className="bg-brand-500 hover:bg-brand-400 p-2 rounded-lg transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Top Customers</h3>
            <div className="space-y-4">
              {[
                { name: "Youssef T.", visits: 24, total: "8,450 MAD", pts: 845 },
                { name: "Sarah M.", visits: 18, total: "6,200 MAD", pts: 420 },
                { name: "Kenza R.", visits: 15, total: "5,890 MAD", pts: 350 },
              ].map((cust, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-xs">
                      {cust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{cust.name}</p>
                      <p className="text-xs text-slate-500">{cust.visits} visits • {cust.total}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-600">{cust.pts}</p>
                    <p className="text-xs text-slate-400">pts</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              View All Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
