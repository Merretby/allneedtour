import React, { useState } from "react";
import { Search, Download, Trash2, Eye, X, Upload, Plus } from "lucide-react";
import { useToast } from "./components/ToastProvider";

interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedBy: string;
  date: string;
  expiryDate?: string;
  status: "Valid" | "Expiring Soon" | "Expired" | "No Expiry";
}

const MOCK_DOCS: DocumentRecord[] = [
  {
    id: "1",
    name: "Hygiene_Certificate_2023.pdf",
    type: "PDF",
    category: "Certificates",
    size: "2.4 MB",
    uploadedBy: "Sofia Benali",
    date: "2023-01-15",
    expiryDate: "2024-01-15",
    status: "Valid",
  },
  {
    id: "2",
    name: "Supplier_Contracts_Q4.zip",
    type: "ZIP",
    category: "Contracts",
    size: "14.1 MB",
    uploadedBy: "Karim Haddad",
    date: "2023-10-01",
    status: "No Expiry",
  },
  {
    id: "3",
    name: "Employee_Handbook.docx",
    type: "DOCX",
    category: "HR",
    size: "845 KB",
    uploadedBy: "HR Dept",
    date: "2022-11-20",
    status: "No Expiry",
  },
  {
    id: "4",
    name: "Fire_Safety_Inspection.pdf",
    type: "PDF",
    category: "Certificates",
    size: "3.1 MB",
    uploadedBy: "Sofia Benali",
    date: "2022-11-05",
    expiryDate: "2023-11-05",
    status: "Expiring Soon",
  },
  {
    id: "5",
    name: "Liquor_License_Old.pdf",
    type: "PDF",
    category: "Licenses",
    size: "1.2 MB",
    uploadedBy: "Admin",
    date: "2021-05-12",
    expiryDate: "2022-05-12",
    status: "Expired",
  },
];

export const DocumentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [docs, setDocs] = useState<DocumentRecord[]>(MOCK_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Certificates");
  const [formExpiry, setFormExpiry] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const filtered = docs.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "All") return matchesSearch;
    return matchesSearch && doc.category === filter;
  });

  const expiringDocsCount = docs.filter(
    (d) => d.status === "Expiring Soon"
  ).length;
  const expiredDocsCount = docs.filter((d) => d.status === "Expired").length;

  const getStatusBadge = (status: string) => {
    if (status === "Valid")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (status === "Expiring Soon")
      return { bg: "var(--warning-bg)", color: "var(--warning)" };
    if (status === "Expired")
      return { bg: "var(--error-bg)", color: "var(--error)" };
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast({ type: "error", title: "Document name is required" });
      return;
    }
    const newDoc: DocumentRecord = {
      id: Date.now().toString(),
      name: formName,
      type: "PDF",
      category: formCategory,
      size: "0 KB",
      uploadedBy: "Current User",
      date: new Date().toISOString().split("T")[0],
      expiryDate: formExpiry || undefined,
      status: formExpiry ? "Valid" : "No Expiry",
    };
    setDocs([newDoc, ...docs]);
    setIsUploadOpen(false);
    setFormName("");
    setFormCategory("Certificates");
    setFormExpiry("");
    setFormNotes("");
    showToast({
      type: "success",
      title: "Document uploaded",
      message: formName,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this document?")) return;
    setDocs((prev) => prev.filter((d) => d.id !== id));
    showToast({ type: "success", title: "Document deleted" });
  };

  const handleDownload = (name: string) => {
    showToast({ type: "info", title: `Downloading ${name}` });
  };

  const handleView = (name: string) => {
    showToast({ type: "info", title: `Viewing ${name}` });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Document Center</span>
        <h2 className="an-page-title">Documents & Files</h2>
        <p className="an-page-desc">
          Centralize and manage all critical documentation, contracts, and
          certificates for the restaurant.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Total Documents</span>
          <span className="an-metric-value">{docs.length}</span>
          <span className="an-metric-sub">stored files</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Action Required</span>
          <span className="an-metric-value" style={{ color: "var(--error)" }}>
            {expiringDocsCount + expiredDocsCount}
          </span>
          <span className="an-metric-sub">expiring or expired</span>
        </div>
        <button
          className="an-btn an-btn-primary"
          onClick={() => setIsUploadOpen(true)}
        >
          <Plus size={16} /> Upload File
        </button>
      </div>

      <div className="an-table-wrap">
        <div className="an-table-toolbar">
          <div className="an-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="an-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Certificates">Certificates</option>
            <option value="Contracts">Contracts</option>
            <option value="HR">HR</option>
            <option value="Licenses">Licenses</option>
          </select>
          <select className="an-select" style={{ width: 150 }}>
            <option>Any Status</option>
            <option>Valid</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="an-table">
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
              {filtered.map((doc) => {
                const badge = getStatusBadge(doc.status);
                return (
                  <tr key={doc.id}>
                    <td>
                      <strong>{doc.name}</strong>
                    </td>
                    <td>{doc.category}</td>
                    <td>
                      <strong>{doc.size}</strong>
                      <br />
                      <small>{doc.type}</small>
                    </td>
                    <td>
                      <strong>{doc.uploadedBy}</strong>
                      <br />
                      <small>{doc.date}</small>
                    </td>
                    <td>{doc.expiryDate || "N/A"}</td>
                    <td>
                      <span
                        className="an-badge"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        <span className="an-badge-dot" />
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleView(doc.name)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleDownload(doc.name)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="Download"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-destructive"
                          onClick={() => handleDelete(doc.id)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    No documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload File Modal */}
      {isUploadOpen && (
        <div className="modal-backdrop" onClick={() => setIsUploadOpen(false)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => {
                setIsUploadOpen(false);
                setFormName("");
                setFormCategory("Certificates");
                setFormExpiry("");
                setFormNotes("");
              }}
            >
              <X size={17} />
            </button>
            <span className="eyebrow">Upload New Document</span>
            <h2>Upload Document</h2>
            <p>Upload a new document to the document center.</p>
            <form onSubmit={handleUpload}>
              <div
                style={{
                  border: "2px dashed var(--brand-border)",
                  borderRadius: "var(--radius)",
                  padding: "32px",
                  textAlign: "center",
                  marginBottom: "20px",
                  background: "var(--brand-surface)",
                  cursor: "pointer",
                }}
              >
                <Upload
                  size={28}
                  style={{ color: "var(--brand-text-muted)", marginBottom: 12 }}
                />
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--brand-navy)",
                  }}
                >
                  Click to upload or drag and drop
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--brand-text-muted)",
                  }}
                >
                  PDF, ZIP, DOCX, JPG (Max 50MB)
                </p>
              </div>

              <div className="form-grid">
                <div className="an-form-group">
                  <label className="an-label">Document Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Hygiene Certificate"
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="an-select"
                  >
                    <option value="Certificates">Certificates</option>
                    <option value="Contracts">Contracts</option>
                    <option value="HR & Payroll">HR & Payroll</option>
                    <option value="Licenses">Licenses</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="an-input"
                  />
                </div>
                <div className="an-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="an-label">Additional Notes</label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Enter any relevant details..."
                    className="an-textarea"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="secondary"
                  onClick={() => {
                    setIsUploadOpen(false);
                    setFormName("");
                    setFormCategory("Certificates");
                    setFormExpiry("");
                    setFormNotes("");
                  }}
                >
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Upload File
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
