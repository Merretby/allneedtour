import { createFileRoute } from '@tanstack/react-router'
import { LinkIcon, CheckCircle2, XCircle, ArrowRight, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/app/intelligence/integrations')({
  component: IntegrationsPage,
})

function IntegrationsPage() {
  const integrations = [
    {
      id: 'glovo',
      name: 'Glovo',
      description: 'Import delivery orders automatically and sync menu prices.',
      status: 'connected',
      lastSync: '10 mins ago',
      icon: 'G'
    },
    {
      id: 'deliveroo',
      name: 'Deliveroo',
      description: 'Connect your Deliveroo account to manage all orders in one place.',
      status: 'disconnected',
      lastSync: null,
      icon: 'D'
    },
    {
      id: 'uber',
      name: 'Uber Eats',
      description: 'Sync orders and update availability directly from RestoOS.',
      status: 'error',
      lastSync: '2 hours ago',
      icon: 'U'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Export daily sales and expense data for accounting.',
      status: 'connected',
      lastSync: 'Yesterday',
      icon: 'Q'
    }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations</h1>
        <p className="text-sm text-slate-500 mt-1">Connect RestoOS with your existing tools and platforms. <span className="font-medium text-brand-600">(Demo Mode)</span></p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-semibold text-blue-900">Demo Environment</h3>
          <p className="text-sm text-blue-800 mt-1">
            This is a simulated integrations dashboard. No real data is being synced. In a production environment, you would authenticate with third-party providers here to enable automatic data flow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{integration.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    {integration.status === 'connected' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> Connected
                      </span>
                    )}
                    {integration.status === 'disconnected' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <XCircle size={12} /> Not Connected
                      </span>
                    )}
                    {integration.status === 'error' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={12} /> Auth Error
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 flex-1">
              {integration.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <RefreshCw size={12} className={integration.status === 'connected' ? 'text-green-600' : ''} />
                {integration.lastSync ? `Last sync: ${integration.lastSync}` : 'Never synced'}
              </div>
              
              {integration.status === 'connected' ? (
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                  Configure
                </button>
              ) : (
                <button className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                  Connect <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Import History</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Date & Time</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { date: "Oct 10, 12:30 PM", source: "Glovo", event: "Imported 12 orders", status: "Success" },
              { date: "Oct 10, 11:15 AM", source: "Uber Eats", event: "Token expired", status: "Failed" },
              { date: "Oct 09, 11:59 PM", source: "QuickBooks", event: "Exported daily summary", status: "Success" },
              { date: "Oct 09, 12:30 PM", source: "Glovo", event: "Imported 8 orders", status: "Success" }
            ].map((log, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="px-5 py-3 text-slate-500">{log.date}</td>
                <td className="px-5 py-3 font-medium text-slate-900">{log.source}</td>
                <td className="px-5 py-3 text-slate-600">{log.event}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium ${log.status === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
