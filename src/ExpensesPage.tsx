import React, { useState } from 'react';
import { Plus, Search, Filter, Download, ArrowUpRight, FileText, Tag, BarChart3, TrendingUp, AlertTriangle, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';

interface Expense {
  id: string;
  reference: string;
  date: string;
  amount: number;
  category: 'Utilities' | 'Payroll' | 'Maintenance' | 'Marketing' | 'Supplies' | 'Other';
  supplier: string;
  status: 'Paid' | 'Pending' | 'Scheduled';
  paymentMethod: 'Transfer' | 'Card' | 'Check' | 'Cash';
  notes?: string;
}

const MOCK_EXPENSES: Expense[] = [
  { id: '1', reference: 'EXP-23-1104', date: 'Today, 09:30', amount: 3500, category: 'Utilities', supplier: 'Redal', status: 'Paid', paymentMethod: 'Transfer' },
  { id: '2', reference: 'EXP-23-1103', date: 'Yesterday, 14:15', amount: 1200, category: 'Maintenance', supplier: 'FixIt Co.', status: 'Pending', paymentMethod: 'Check', notes: 'AC Repair' },
  { id: '3', reference: 'EXP-23-1102', date: 'Oct 05, 2023', amount: 850, category: 'Marketing', supplier: 'SocialAds', status: 'Paid', paymentMethod: 'Card' },
  { id: '4', reference: 'EXP-23-1101', date: 'Oct 01, 2023', amount: 12500, category: 'Payroll', supplier: 'Internal', status: 'Scheduled', paymentMethod: 'Transfer' },
  { id: '5', reference: 'EXP-23-1100', date: 'Sep 28, 2023', amount: 450, category: 'Supplies', supplier: 'OfficeMax', status: 'Paid', paymentMethod: 'Card' },
];

export const ExpensesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = MOCK_EXPENSES.filter(e => {
    const matchesSearch = e.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Paid') return matchesSearch && e.status === 'Paid';
    if (activeTab === 'Pending') return matchesSearch && (e.status === 'Pending' || e.status === 'Scheduled');
    return matchesSearch;
  });

  const totalPaidThisMonth = MOCK_EXPENSES.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = MOCK_EXPENSES.filter(e => e.status === 'Pending' || e.status === 'Scheduled').reduce((sum, e) => sum + e.amount, 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US') + ' MAD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Utilities': return <ArrowUpRight size={16} className="text-blue-500" />;
      case 'Payroll': return <FileText size={16} className="text-emerald-500" />;
      case 'Maintenance': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'Marketing': return <TrendingUp size={16} className="text-purple-500" />;
      case 'Supplies': return <Tag size={16} className="text-indigo-500" />;
      default: return <FileText size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500">Manage operational costs, bills, and outgoing payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={18} />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Paid (This Month)</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPaidThisMonth)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending/Scheduled</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPending)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Top Category</p>
            <p className="text-2xl font-bold text-slate-900">Payroll</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              {['All', 'Paid', 'Pending'].map((tab) => (
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
                  placeholder="Search reference, supplier..." 
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

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Reference & Supplier</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{expense.reference}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{expense.supplier}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{expense.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      {getCategoryIcon(expense.category)}
                      <span>{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(expense.status)}`}>
                      {expense.status === 'Paid' && <CheckCircle size={14} />}
                      {(expense.status === 'Pending' || expense.status === 'Scheduled') && <Clock size={14} />}
                      {expense.status}
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

          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900 mb-1">No expenses found</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>Showing {filteredExpenses.length} of {MOCK_EXPENSES.length} expenses</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
