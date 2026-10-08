import React, { useState } from 'react';

export interface InventoryCount {
  id: string;
  date: string;
  assignedTo: string;
  status: 'Open' | 'Completed';
  itemsCounted: number;
  varianceValue: number;
}

const INITIAL_COUNTS: InventoryCount[] = [
  { id: 'INV-042', date: new Date().toISOString(), assignedTo: 'Chef Ahmed', status: 'Open', itemsCounted: 45, varianceValue: 0 },
  { id: 'INV-041', date: new Date(Date.now() - 86400000 * 7).toISOString(), assignedTo: 'Sous Chef Sara', status: 'Completed', itemsCounted: 184, varianceValue: -420 },
  { id: 'INV-040', date: new Date(Date.now() - 86400000 * 14).toISOString(), assignedTo: 'Chef Ahmed', status: 'Completed', itemsCounted: 180, varianceValue: 120 },
];

export const InventoriesPage: React.FC = () => {
  const [counts, setCounts] = useState<InventoryCount[]>(INITIAL_COUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = counts.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCount = counts.filter(c => c.status === 'Open').length;
  const completedCount = counts.filter(c => c.status === 'Completed').length;
  const totalVariance = counts.reduce((acc, c) => acc + c.varianceValue, 0);

  const startNewCount = () => {
    const newCount: InventoryCount = {
      id: `INV-0${counts.length + 40}`,
      date: new Date().toISOString(),
      assignedTo: 'Current User',
      status: 'Open',
      itemsCounted: 0,
      varianceValue: 0
    };
    setCounts([newCount, ...counts]);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Stock Auditing</p>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>Inventories</h1>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>Run physical counts to identify variances against system stock.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>OPEN COUNTS</p>
          <strong style={{ fontSize: '1.5rem', color: openCount > 0 ? '#f59e0b' : '#0f172a' }}>{openCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>COMPLETED AUDITS</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{completedCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>HISTORIC VARIANCE</p>
          <strong style={{ fontSize: '1.5rem', color: totalVariance < 0 ? '#ef4444' : '#10b981' }}>
            {totalVariance > 0 ? '+' : ''}{totalVariance.toLocaleString()} MAD
          </strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search by ID or Assignee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px' }}
        />
        <button onClick={startNewCount} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          + Start New Count
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {filtered.map((item) => {
          const isCompleted = item.status === 'Completed';
          return (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 600 }}>{item.id}</h4>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: isCompleted ? '#10b981' : '#f59e0b', background: isCompleted ? '#ecfdf5' : '#fffbeb' }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b' }}>Date: {new Date(item.date).toLocaleDateString()} • Assigned: {item.assignedTo}</p>
                <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>
                  <strong>{item.itemsCounted}</strong> items counted
                  {isCompleted && (
                    <span style={{ marginLeft: '1rem', color: item.varianceValue < 0 ? '#ef4444' : '#10b981' }}>
                      Variance: {item.varianceValue > 0 ? '+' : ''}{item.varianceValue} MAD
                    </span>
                  )}
                </div>
              </div>
              <div>
                <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  {isCompleted ? 'View Report' : 'Resume Count'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
