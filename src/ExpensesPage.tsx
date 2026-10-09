import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

interface Expense {
  id: string;
  supplier: string;
  reference: string;
  date: string;
  amount: number;
  category: 'Utilities' | 'Payroll' | 'Maintenance' | 'Marketing' | 'Supplies' | 'Other';
  status: 'Paid' | 'Pending';
  paymentMethod: 'Transfer' | 'Card' | 'Check' | 'Cash';
  notes?: string;
}

const MOCK_EXPENSES: Expense[] = [
  { id: '1', supplier: 'Redal', reference: 'EXP-23-1104', date: '2023-10-08', amount: 3500.00, category: 'Utilities', status: 'Paid', paymentMethod: 'Transfer', notes: 'Monthly bill' },
  { id: '2', supplier: 'FixIt Co.', reference: 'EXP-23-1103', date: '2023-10-08', amount: 1200.00, category: 'Maintenance', status: 'Pending', paymentMethod: 'Check', notes: 'AC Repair' },
];

export const ExpensesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace('.', ',') + ' MAD';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          Validé
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
        À vérifier
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-blue-600 text-xs font-bold tracking-wider mb-2 uppercase">ALLNEEDS / TOURISM</div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Expenses</h1>
          <p className="text-slate-500 text-sm">Organize, find and track information for your structure.</p>
        </div>
        <button className="px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Top Controls */}
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search a name, a record..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 appearance-none pr-8 cursor-pointer relative"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            
            <div className="relative">
              <input 
                type="date" 
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            
            <div className="text-sm text-slate-500 font-medium px-2">
              {MOCK_EXPENSES.length} results
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">SUPPLIER / RECORD</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">INFORMATIONS</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">DATE</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">AMOUNT</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">STATE</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {MOCK_EXPENSES.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{expense.supplier}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{expense.category}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    Expense {expense.reference} · {expense.paymentMethod}
                  </td>
                  <td className="px-4 py-4 text-slate-500">{expense.date}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(expense.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        Edit
                      </button>
                      {expense.status === 'Pending' && (
                        <>
                          <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
                            Validate
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                            To correct
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center mt-8 text-xs text-slate-400">
        <div>ALLNEEDS Tourism</div>
        <div>Independent demo · Administrative & organization management</div>
      </div>
    </div>
  );
};
