import React, { useState } from 'react';

export interface PurchaseOrder {
  id: string;
  supplier: string;
  amount: number;
  status: 'Draft' | 'Approval' | 'Sent' | 'Received' | 'Cancelled';
  date: string;
}

const INITIAL_POS: PurchaseOrder[] = [
  { id: 'PO-1048', supplier: 'Fresh Market', amount: 2480, status: 'Sent', date: new Date().toISOString() },
  { id: 'PO-1047', supplier: 'Ocean Foods', amount: 1920, status: 'Received', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'PO-1049', supplier: 'Maison Pro', amount: 740, status: 'Draft', date: new Date().toISOString() },
  { id: 'PO-1050', supplier: 'Atlas Drinks', amount: 1140, status: 'Approval', date: new Date().toISOString() },
];

export const PurchasesPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [activeTab, setActiveTab] = useState<'Orders' | 'Drafts' | 'Approvals'>('Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseOrder | null>(null);

  // Form State
  const [formSupplier, setFormSupplier] = useState('');
  const [formAmount, setFormAmount] = useState(0);
  const [formStatus, setFormStatus] = useState<PurchaseOrder['status']>('Draft');

  const filtered = orders.filter(item => {
    const matchesSearch = item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Drafts') return matchesSearch && item.status === 'Draft';
    if (activeTab === 'Approvals') return matchesSearch && item.status === 'Approval';
    return matchesSearch;
  });

  const openCount = orders.filter(o => ['Draft', 'Approval', 'Sent'].includes(o.status)).length;
  const approvalCount = orders.filter(o => o.status === 'Approval').length;
  const totalAmount = orders.reduce((acc, o) => acc + o.amount, 0);

  const getStatusColor = (status: string) => {
    if (status === 'Received') return { bg: '#ecfdf5', color: '#10b981' };
    if (status === 'Sent') return { bg: '#eff6ff', color: '#3b82f6' };
    if (status === 'Approval') return { bg: '#fffbeb', color: '#f59e0b' };
    if (status === 'Cancelled') return { bg: '#fef2f2', color: '#ef4444' };
    return { bg: '#f1f5f9', color: '#64748b' };
  };

  const openModal = (order?: PurchaseOrder) => {
    if (order) {
      setSelectedItem(order);
      setFormSupplier(order.supplier);
      setFormAmount(order.amount);
      setFormStatus(order.status);
    } else {
      setSelectedItem(null);
      setFormSupplier('');
      setFormAmount(0);
      setFormStatus('Draft');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: PurchaseOrder = {
      id: selectedItem ? selectedItem.id : `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: formSupplier,
      amount: formAmount,
      status: formStatus,
      date: selectedItem ? selectedItem.date : new Date().toISOString()
    };
    if (selectedItem) {
      setOrders(orders.map(o => o.id === selectedItem.id ? newItem : o));
    } else {
      setOrders([newItem, ...orders]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Procurement</p>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>Purchases</h1>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>Create purchase orders, compare suppliers and track approvals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>OPEN ORDERS</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{openCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AWAITING APPROVAL</p>
          <strong style={{ fontSize: '1.5rem', color: approvalCount > 0 ? '#f59e0b' : '#0f172a' }}>{approvalCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MAD THIS WEEK</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{totalAmount.toLocaleString()}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', gap: '2rem' }}>
        {(['Orders', 'Drafts', 'Approvals'] as const).map(tab => (
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
          placeholder="Search purchases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px' }}
        />
        <button onClick={() => openModal()} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          + Create PO
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {filtered.map((item) => {
          const status = getStatusColor(item.status);
          return (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1rem', fontWeight: 600 }}>{item.id} - {item.supplier}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b' }}>Date: {new Date(item.date).toLocaleDateString()}</p>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.amount.toLocaleString()} MAD</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: status.color, background: status.bg }}>{item.status}</span>
                <button onClick={() => openModal(item)} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>{selectedItem ? 'Edit Purchase Order' : 'New Purchase Order'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Supplier Name</label>
                  <input type="text" required value={formSupplier} onChange={e => setFormSupplier(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Amount (MAD)</label>
                    <input type="number" required value={formAmount} onChange={e => setFormAmount(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Status</label>
                    <select value={formStatus} onChange={e => setFormStatus(e.target.value as any)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                      <option value="Draft">Draft</option>
                      <option value="Approval">Approval</option>
                      <option value="Sent">Sent</option>
                      <option value="Received">Received</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
