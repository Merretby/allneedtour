import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Payment {
  id: string;
  reference: string;
  date: string;
  amount: number;
  method: 'Cash' | 'Card' | 'Transfer' | 'Check';
  type: 'Collection' | 'Invoice' | 'Settlement';
  status: 'Completed' | 'Pending';
  client?: string;
  notes?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', client: 'Salma R.', reference: 'REC-001', date: '2023-10-08', amount: 450.00, method: 'Card', type: 'Collection', status: 'Completed', notes: 'Settled' },
  { id: '2', client: 'Omar B.', reference: 'REC-002', date: '2023-10-08', amount: 300.00, method: 'Cash', type: 'Collection', status: 'Pending', notes: 'Settled' },
];

export const PaymentsCollectionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace('.', ',') + ' MAD';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') {
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
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
        
        <input 
          type="date" 
          className="filter"
        />
        
        <button className="secondary" onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Add new payment" }))}>
          + Add payment
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Client / Record</th>
              <th>Informations</th>
              <th>Date</th>
              <th>Amount</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYMENTS.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <strong>{payment.client || 'Unknown Client'}</strong>
                  <small>Youssef Idrissi</small>
                </td>
                <td>
                  <strong>Receipt {payment.reference}</strong>
                  <small>{payment.method} · {payment.notes}</small>
                </td>
                <td>{payment.date}</td>
                <td>
                  <strong>{formatCurrency(payment.amount)}</strong>
                </td>
                <td>
                  {getStatusBadge(payment.status)}
                </td>
                <td>
                  <div className="row-actions">
                    <button>Edit</button>
                    {payment.status === 'Pending' && (
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
