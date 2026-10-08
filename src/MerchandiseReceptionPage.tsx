import React, { useState } from 'react';

export interface Reception {
  id: string;
  poRef: string;
  supplier: string;
  status: 'Pending' | 'Validated' | 'Discrepancy';
  date: string;
  amount: number;
}

const INITIAL_RECEPTIONS: Reception[] = [
  { id: 'MR-1048', poRef: 'PO-1048', supplier: 'Fresh Market', status: 'Pending', date: new Date().toISOString(), amount: 2480 },
  { id: 'MR-1047', poRef: 'PO-1047', supplier: 'Ocean Foods', status: 'Validated', date: new Date(Date.now() - 86400000).toISOString(), amount: 1920 },
  { id: 'MR-1045', poRef: 'PO-1045', supplier: 'Atlas Drinks', status: 'Validated', date: new Date(Date.now() - 172800000).toISOString(), amount: 950 },
  { id: 'MR-1042', poRef: 'PO-1042', supplier: 'Maison Pro', status: 'Discrepancy', date: new Date(Date.now() - 259200000).toISOString(), amount: 3100 },
];

export const MerchandiseReceptionPage: React.FC = () => {
  const [receptions, setReceptions] = useState<Reception[]>(INITIAL_RECEPTIONS);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Discrepancies'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Reception | null>(null);

  // Validation Form State
  const [formStatus, setFormStatus] = useState<Reception['status']>('Pending');
  const [notes, setNotes] = useState('');

  const filtered = receptions.filter(item => {
    const matchesSearch = item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.poRef.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Pending') return matchesSearch && item.status === 'Pending';
    if (activeTab === 'Discrepancies') return matchesSearch && item.status === 'Discrepancy';
    return matchesSearch;
  });

  const pendingCount = receptions.filter(r => r.status === 'Pending').length;
  const validatedCount = receptions.filter(r => r.status === 'Validated').length;
  const totalAmountReceived = receptions.filter(r => r.status === 'Validated').reduce((acc, r) => acc + r.amount, 0);

  const getStatusColor = (status: string) => {
    if (status === 'Validated') return { bg: '#ecfdf5', color: '#10b981' };
    if (status === 'Pending') return { bg: '#fffbeb', color: '#f59e0b' };
    if (status === 'Discrepancy') return { bg: '#fef2f2', color: '#ef4444' };
    return { bg: '#f1f5f9', color: '#64748b' };
  };

  const openValidateModal = (reception: Reception) => {
    setSelectedItem(reception);
    setFormStatus(reception.status);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    const updated = {
      ...selectedItem,
      status: formStatus
    };
    
    setReceptions(receptions.map(r => r.id === selectedItem.id ? updated : r));
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Goods In</p>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>Merchandise Reception</h1>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>Receive deliveries, verify quantities and validate discrepancies.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PENDING RECEPTIONS</p>
          <strong style={{ fontSize: '1.5rem', color: pendingCount > 0 ? '#f59e0b' : '#0f172a' }}>{pendingCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>VALIDATED TODAY</p>
          <strong style={{ fontSize: '1.5rem', color: '#10b981' }}>{validatedCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MAD RECEIVED</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{totalAmountReceived.toLocaleString()}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', gap: '2rem' }}>
        {(['All', 'Pending', 'Discrepancies'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: 600, color: activeTab === tab ? '#0f172a' : '#64748b', borderBottom: activeTab === tab ? '2px solid #0f172a' : '2px solid transparent', cursor: 'pointer' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search by PO or Supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {filtered.map((item) => {
          const status = getStatusColor(item.status);
          return (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1rem', fontWeight: 600 }}>{item.id} - {item.supplier}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b' }}>PO Ref: {item.poRef} • Date: {new Date(item.date).toLocaleDateString()}</p>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.amount.toLocaleString()} MAD Expected</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: status.color, background: status.bg }}>{item.status}</span>
                <button onClick={() => openValidateModal(item)} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>
                  {item.status === 'Pending' ? 'Process Reception' : 'View / Edit'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Process Reception: {selectedItem.id}</h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.5rem' }}>Verify quantities received for PO: <strong>{selectedItem.poRef}</strong> from <strong>{selectedItem.supplier}</strong>.</p>
            
            <form onSubmit={handleValidate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Reception Status</label>
                  <select value={formStatus} onChange={e => setFormStatus(e.target.value as any)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                    <option value="Pending">Pending Validation</option>
                    <option value="Validated">Fully Validated</option>
                    <option value="Discrepancy">Has Discrepancy (Missing/Damaged)</option>
                  </select>
                </div>
                {formStatus === 'Discrepancy' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Discrepancy Notes</label>
                    <textarea required value={notes} onChange={e => setNotes(e.target.value)} placeholder="Explain the missing items or damages..." style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', minHeight: '80px' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
