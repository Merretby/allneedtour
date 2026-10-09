import React, { useState } from 'react';
import { Search } from 'lucide-react';

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
        <span className="badge active">
          <i /> Validé
        </span>
      );
    }
    return (
      <span className="badge off" style={{ background: '#fff0dc', color: '#bb7e2f' }}>
        <i style={{ background: '#bb7e2f' }} /> À vérifier
      </span>
    );
  };

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <div className="search">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search a name, a record..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
        
        <input 
          type="date" 
          className="filter"
        />
        
        <button className="secondary" onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Add new expense" }))}>
          + Add
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Supplier / Record</th>
              <th>Informations</th>
              <th>Date</th>
              <th>Amount</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EXPENSES.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <strong>{expense.supplier}</strong>
                  <small>{expense.category}</small>
                </td>
                <td>
                  <strong>Expense {expense.reference}</strong>
                  <small>{expense.paymentMethod}</small>
                </td>
                <td>{expense.date}</td>
                <td>
                  <strong>{formatCurrency(expense.amount)}</strong>
                </td>
                <td>
                  {getStatusBadge(expense.status)}
                </td>
                <td>
                  <div className="row-actions">
                    <button>Edit</button>
                    {expense.status === 'Pending' && (
                      <>
                        <button style={{ color: '#338568', borderColor: '#9accc0' }}>Validate</button>
                        <button>To correct</button>
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
  );
};
