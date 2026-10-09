import React, { useState } from 'react';
import { Plus, Search, Filter, Download, DollarSign, CreditCard, Receipt, FileText, CheckCircle, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

interface Payment {
  id: string;
  reference: string;
  date: string;
  amount: number;
  method: 'Cash' | 'Card' | 'Transfer' | 'Check';
  type: 'Collection' | 'Invoice' | 'Settlement';
  status: 'Completed' | 'Pending' | 'Overdue';
  client?: string;
  notes?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', reference: 'POS-Z-1042', date: 'Today, 23:15', amount: 8420, method: 'Card', type: 'Collection', status: 'Completed', notes: 'Daily POS Settlement' },
  { id: '2', reference: 'INV-2023-089', date: 'Today, 14:30', amount: 1240, method: 'Transfer', type: 'Invoice', status: 'Pending', client: 'Acme Corp', notes: 'Corporate Lunch Event' },
  { id: '3', reference: 'CHK-9921', date: 'Yesterday, 11:00', amount: 450, method: 'Check', type: 'Settlement', status: 'Completed', client: 'John Doe', notes: 'Settlement for INV-2023-085' },
  { id: '4', reference: 'INV-2023-082', date: 'Oct 01, 2023', amount: 3200, method: 'Transfer', type: 'Invoice', status: 'Overdue', client: 'TechStart Inc', notes: 'Team Dinner' },
  { id: '5', reference: 'POS-Z-1041', date: 'Yesterday, 23:20', amount: 7850, method: 'Cash', type: 'Collection', status: 'Completed', notes: 'Daily Cash Drawer' },
];

export const PaymentsCollectionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Collections' | 'Invoices'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = MOCK_PAYMENTS.filter(p => {
    const matchesSearch = p.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Collections') return matchesSearch && (p.type === 'Collection' || p.type === 'Settlement');
    if (activeTab === 'Invoices') return matchesSearch && p.type === 'Invoice';
    return matchesSearch;
  });

  const totalCollected = MOCK_PAYMENTS.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = MOCK_PAYMENTS.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US') + ' MAD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Overdue': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash': return <DollarSign size={16} className="text-emerald-500" />;
      case 'Card': return <CreditCard size={16} className="text-blue-500" />;
      case 'Transfer': return <ArrowUpRight size={16} className="text-indigo-500" />;
      case 'Check': return <FileText size={16} className="text-slate-500" />;
      default: return <Receipt size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Collections</h1>
          <p className="text-slate-500">Track daily revenue, corporate invoices, and cash settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Download size={18} />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={18} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Collected (Recent)</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalCollected)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Outstanding</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Overdue Invoices</p>
            <p className="text-2xl font-bold text-slate-900">
              {MOCK_PAYMENTS.filter(p => p.status === 'Overdue').length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              {['All', 'Collections', 'Invoices'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search reference or client..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                />
              </div>
              <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{payment.reference}</div>
                    {payment.client && <div className="text-xs text-slate-500 mt-0.5">{payment.client}</div>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      {getMethodIcon(payment.method)}
                      <span>{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status === 'Completed' && <CheckCircle size={14} />}
                      {payment.status === 'Pending' && <Clock size={14} />}
                      {payment.status === 'Overdue' && <AlertTriangle size={14} />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Receipt size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900 mb-1">No transactions found</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>Showing {filteredPayments.length} of {MOCK_PAYMENTS.length} transactions</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
