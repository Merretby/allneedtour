import React, { useState } from 'react';

export interface WasteLog {
  id: string;
  date: string;
  itemName: string;
  quantity: number;
  unit: string;
  cost: number;
  reason: 'Expired' | 'Prep Waste' | 'Service Error' | 'Dropped/Spilled';
  loggedBy: string;
}

const INITIAL_WASTE: WasteLog[] = [
  { id: 'WST-101', date: new Date().toISOString(), itemName: 'Sea Bass Fillet', quantity: 0.5, unit: 'kg', cost: 140, reason: 'Prep Waste', loggedBy: 'Chef Ahmed' },
  { id: 'WST-102', date: new Date().toISOString(), itemName: 'Heavy Cream', quantity: 1, unit: 'L', cost: 42, reason: 'Expired', loggedBy: 'Sous Chef Sara' },
  { id: 'WST-103', date: new Date(Date.now() - 86400000).toISOString(), itemName: 'Truffle', quantity: 0.1, unit: 'kg', cost: 1500, reason: 'Dropped/Spilled', loggedBy: 'Commis Ali' },
];

export const LossesWastePage: React.FC = () => {
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(INITIAL_WASTE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formItem, setFormItem] = useState('');
  const [formQuantity, setFormQuantity] = useState(0);
  const [formUnit, setFormUnit] = useState('kg');
  const [formCost, setFormCost] = useState(0);
  const [formReason, setFormReason] = useState<WasteLog['reason']>('Prep Waste');

  const filtered = wasteLogs.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayCount = wasteLogs.filter(w => new Date(w.date).toDateString() === new Date().toDateString()).length;
  const totalCost = wasteLogs.reduce((acc, w) => acc + w.cost, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: WasteLog = {
      id: `WST-${Math.floor(200 + Math.random() * 800)}`,
      date: new Date().toISOString(),
      itemName: formItem,
      quantity: formQuantity,
      unit: formUnit,
      cost: formCost,
      reason: formReason,
      loggedBy: 'Current User'
    };
    setWasteLogs([newLog, ...wasteLogs]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cost Control</p>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>Losses & Waste</h1>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>Track food waste, spoilage, and service errors to protect margins.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>LOGS TODAY</p>
          <strong style={{ fontSize: '1.5rem', color: todayCount > 0 ? '#ef4444' : '#0f172a' }}>{todayCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TOTAL INCIDENTS</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{wasteLogs.length}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TOTAL WASTE COST</p>
          <strong style={{ fontSize: '1.5rem', color: '#ef4444' }}>{totalCost.toLocaleString()} MAD</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search by item or reason..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px' }}
        />
        <button onClick={() => setIsModalOpen(true)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          + Log Waste
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {filtered.map((item) => (
          <div key={item.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 600 }}>{item.itemName}</h4>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', background: '#fef2f2' }}>
                  {item.reason}
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b' }}>{new Date(item.date).toLocaleString()} • Logged by: {item.loggedBy}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.quantity} {item.unit}</div>
              <div style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 600 }}>- {item.cost} MAD</div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#ef4444' }}>Log New Waste</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Item Name</label>
                  <input type="text" required value={formItem} onChange={e => setFormItem(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Quantity</label>
                    <input type="number" step="0.01" required value={formQuantity} onChange={e => setFormQuantity(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Unit</label>
                    <input type="text" required value={formUnit} onChange={e => setFormUnit(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Estimated Cost (MAD)</label>
                  <input type="number" step="0.01" required value={formCost} onChange={e => setFormCost(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Reason</label>
                  <select value={formReason} onChange={e => setFormReason(e.target.value as any)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                    <option value="Prep Waste">Prep Waste</option>
                    <option value="Expired">Expired</option>
                    <option value="Service Error">Service Error</option>
                    <option value="Dropped/Spilled">Dropped/Spilled</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Confirm Loss</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
