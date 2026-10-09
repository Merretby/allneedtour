import React, { useState } from 'react';
import { Search, Download, Trash2, Eye } from 'lucide-react';

interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedBy: string;
  date: string;
  expiryDate?: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'No Expiry';
}

const MOCK_DOCS: DocumentRecord[] = [
  { id: '1', name: 'Hygiene_Certificate_2023.pdf', type: 'PDF', category: 'Certificates', size: '2.4 MB', uploadedBy: 'Sofia Renali', date: '2023-01-15', expiryDate: '2024-01-15', status: 'Valid' },
  { id: '2', name: 'Supplier_Contracts_Q4.zip', type: 'ZIP', category: 'Contracts', size: '14.1 MB', uploadedBy: 'Karim T.', date: '2023-10-01', status: 'No Expiry' },
  { id: '3', name: 'Employee_Handbook.docx', type: 'DOCX', category: 'HR', size: '845 KB', uploadedBy: 'HR Dept', date: '2022-11-20', status: 'No Expiry' },
  { id: '4', name: 'Fire_Safety_Inspection.pdf', type: 'PDF', category: 'Certificates', size: '3.1 MB', uploadedBy: 'Sofia Renali', date: '2022-11-05', expiryDate: '2023-11-05', status: 'Expiring Soon' },
  { id: '5', name: 'Liquor_License_Old.pdf', type: 'PDF', category: 'Licenses', size: '1.2 MB', uploadedBy: 'Admin', date: '2021-05-12', expiryDate: '2022-05-12', status: 'Expired' },
];

export const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const getStatusBadge = (status: string) => {
    if (status === 'Valid') {
      return (
        <span className="badge active">
          <i /> Valid
        </span>
      );
    }
    if (status === 'Expiring Soon') {
      return (
        <span className="badge off" style={{ background: '#fff0dc', color: '#bb7e2f' }}>
          <i style={{ background: '#bb7e2f' }} /> Expiring Soon
        </span>
      );
    }
    if (status === 'Expired') {
      return (
        <span className="badge off" style={{ background: '#fee2e2', color: '#b91c1c' }}>
          <i style={{ background: '#b91c1c' }} /> Expired
        </span>
      );
    }
    return (
      <span className="badge off" style={{ background: '#f0f2f1', color: '#879592' }}>
        No Expiry
      </span>
    );
  };

  const expiringDocsCount = MOCK_DOCS.filter(d => d.status === 'Expiring Soon').length;
  const expiredDocsCount = MOCK_DOCS.filter(d => d.status === 'Expired').length;

  return (
    <section className="admin-page">
      <div className="admin-intro">
        <div>
          <span className="eyebrow">PEOPLE & CONTROL</span>
          <h2>Documents & Files.</h2>
          <p>Centralize and manage all critical documentation, contracts, and certificates for the restaurant.</p>
        </div>
        <div className="admin-metrics">
          <strong>
            {MOCK_DOCS.length}
            <small>total documents</small>
          </strong>
          <strong style={{ color: expiredDocsCount > 0 ? '#b91c1c' : 'inherit' }}>
            {expiringDocsCount + expiredDocsCount}
            <small>action required</small>
          </strong>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search documents by name, type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Certificates">Certificates</option>
            <option value="Contracts">Contracts</option>
            <option value="HR">HR</option>
            <option value="Licenses">Licenses</option>
          </select>
          
          <select className="filter">
            <option>Any Status</option>
            <option>Valid</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
          </select>
          
          <button className="secondary" style={{ background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Upload dialog opened" }))}>
            + Upload File
          </button>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Category</th>
                <th>Size / Type</th>
                <th>Uploaded By</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DOCS.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <strong>{doc.name}</strong>
                  </td>
                  <td>{doc.category}</td>
                  <td>
                    <strong>{doc.size}</strong>
                    <small>{doc.type}</small>
                  </td>
                  <td>
                    <strong>{doc.uploadedBy}</strong>
                    <small>{doc.date}</small>
                  </td>
                  <td>{doc.expiryDate || 'N/A'}</td>
                  <td>
                    {getStatusBadge(doc.status)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button title="View"><Eye size={13} style={{ verticalAlign: 'middle' }}/></button>
                      <button title="Download"><Download size={13} style={{ verticalAlign: 'middle' }}/></button>
                      <button title="Delete" style={{ color: '#ef4444' }}><Trash2 size={13} style={{ verticalAlign: 'middle' }}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
