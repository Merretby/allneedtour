import React, { useState } from 'react';
import { Search, FileText, Download } from 'lucide-react';

interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

const MOCK_DOCS: DocumentRecord[] = [
  { id: '1', name: 'Hygiene_Certificate_2023.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Sofia Renali', date: '2023-01-15' },
  { id: '2', name: 'Supplier_Contracts_Q4.zip', type: 'ZIP', size: '14.1 MB', uploadedBy: 'Karim T.', date: '2023-10-01' },
  { id: '3', name: 'Employee_Handbook.docx', type: 'DOCX', size: '845 KB', uploadedBy: 'HR Dept', date: '2022-11-20' },
];

export const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <div className="search">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="secondary" onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Upload dialog opened" }))}>
          + Upload File
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded By</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DOCS.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className="user-cell">
                    <span className="avatar" style={{ background: '#f0f2f1', color: '#879592' }}>
                      <FileText size={14} />
                    </span>
                    <span>
                      <strong>{doc.name}</strong>
                    </span>
                  </div>
                </td>
                <td>{doc.type}</td>
                <td>{doc.size}</td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.date}</td>
                <td>
                  <div className="row-actions">
                    <button><Download size={14} /></button>
                    <button style={{ color: '#ef4444' }}>Delete</button>
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
