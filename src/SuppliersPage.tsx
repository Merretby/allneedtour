import React, { useState } from 'react';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  performance: number;
  status: 'Preferred' | 'Active' | 'Inactive';
}

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Fresh Market', category: 'Produce', contactName: 'Ahmed B.', phone: '+212 600 112233', email: 'orders@freshmarket.ma', performance: 98, status: 'Preferred' },
  { id: '2', name: 'Ocean Foods', category: 'Seafood', contactName: 'Sara K.', phone: '+212 600 445566', email: 'sales@oceanfoods.ma', performance: 96, status: 'Preferred' },
  { id: '3', name: 'Atlas Drinks', category: 'Beverage', contactName: 'Youssef M.', phone: '+212 600 778899', email: 'contact@atlasdrinks.ma', performance: 92, status: 'Active' },
  { id: '4', name: 'Maison Pro', category: 'Dry Goods', contactName: 'Nadia R.', phone: '+212 600 111222', email: 'pro@maison.ma', performance: 89, status: 'Active' },
];

const CATEGORIES = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Dry Goods', 'Beverage', 'Packaging', 'Chemicals'];

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [activeTab, setActiveTab] = useState<'All suppliers' | 'Preferred' | 'Performance'>('All suppliers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Supplier | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formContact, setFormContact] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Preferred' | 'Active' | 'Inactive'>('Active');

  const filtered = suppliers.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Preferred') return matchesSearch && item.status === 'Preferred';
    return matchesSearch;
  });

  const preferredCount = suppliers.filter(s => s.status === 'Preferred').length;
  const avgPerformance = suppliers.reduce((acc, s) => acc + s.performance, 0) / (suppliers.length || 1);

  const getStatusColor = (status: string) => {
    if (status === 'Preferred') return { bg: '#ecfdf5', color: '#10b981' };
    if (status === 'Active') return { bg: '#eff6ff', color: '#3b82f6' };
    return { bg: '#f1f5f9', color: '#64748b' };
  };

  const openModal = (supplier?: Supplier) => {
    if (supplier) {
      setSelectedItem(supplier);
      setFormName(supplier.name);
      setFormCategory(supplier.category);
      setFormContact(supplier.contactName);
      setFormPhone(supplier.phone);
      setFormEmail(supplier.email);
      setFormStatus(supplier.status);
    } else {
      setSelectedItem(null);
      setFormName('');
      setFormCategory(CATEGORIES[0]);
      setFormContact('');
      setFormPhone('');
      setFormEmail('');
      setFormStatus('Active');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Supplier = {
      id: selectedItem ? selectedItem.id : Date.now().toString(),
      name: formName,
      category: formCategory,
      contactName: formContact,
      phone: formPhone,
      email: formEmail,
      performance: selectedItem ? selectedItem.performance : 100, // New suppliers start at 100%
      status: formStatus
    };
    if (selectedItem) {
      setSuppliers(suppliers.map(s => s.id === selectedItem.id ? newItem : s));
    } else {
      setSuppliers([...suppliers, newItem]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Supplier Directory</p>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>Suppliers</h1>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>Centralize contacts, terms, performance and purchasing history.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SUPPLIERS</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{suppliers.length}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PREFERRED</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{preferredCount}</strong>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ON TIME</p>
          <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{avgPerformance.toFixed(1)}%</strong>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', gap: '2rem' }}>
        {(['All suppliers', 'Preferred', 'Performance'] as const).map(tab => (
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
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px' }}
        />
        <button onClick={() => openModal()} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          + Create
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {filtered.map((item, index) => {
          const status = getStatusColor(item.status);
          return (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1rem', fontWeight: 600 }}>{item.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b' }}>{item.category} • {item.performance}% on time</p>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    <div>👤 {item.contactName}</div>
                    <div>📞 {item.phone}</div>
                    <div>✉️ {item.email}</div>
                  </div>
                </div>
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
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>{selectedItem ? 'Edit Supplier' : 'New Supplier'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Supplier Name</label>
                  <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Category</label>
                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Status</label>
                    <select value={formStatus} onChange={e => setFormStatus(e.target.value as any)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                      <option value="Active">Active</option>
                      <option value="Preferred">Preferred</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Contact Name</label>
                  <input type="text" value={formContact} onChange={e => setFormContact(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Phone</label>
                    <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email</label>
                    <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
