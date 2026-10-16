import React, { useRef, useState } from "react";
import { Search, Download, Trash2, Eye, X, Upload, Plus } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import {
  DOCUMENT_SEED,
  KEYS,
  useEscape,
  useStore,
  type DocumentRecord,
} from "./store";

export type { DocumentRecord };

export const DocumentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [docs, setDocs] = useStore<DocumentRecord[]>(
    KEYS.documents,
    DOCUMENT_SEED
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Certificates");
  const [formExpiry, setFormExpiry] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formFile, setFormFile] = useState<{
    name: string;
    size: string;
    type: string;
    url?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeUpload = () => {
    setIsUploadOpen(false);
    setFormName("");
    setFormCategory("Certificates");
    setFormExpiry("");
    setFormNotes("");
    setFormFile(null);
  };

  useEscape(isUploadOpen, closeUpload);
  useEscape(selectedDoc !== null, () => setSelectedDoc(null));

  const filtered = docs.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter !== "All" && doc.category !== filter) return false;
    if (statusFilter !== "Any" && doc.status !== statusFilter) return false;
    return matchesSearch;
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
    return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
  };

  const onPickFile = (file: File | null) => {
    if (!file) {
      setFormFile(null);
      return;
    }
    const sizeKb = file.size / 1024;
    const size =
      sizeKb > 1024
        ? `${(sizeKb / 1024).toFixed(1)} MB`
        : `${Math.max(1, Math.round(sizeKb))} KB`;
    const ext = (file.name.split(".").pop() || "file").toUpperCase();
    const reader = new FileReader();
    reader.onload = () =>
      setFormFile({
        name: file.name,
        size,
        type: ext,
        url: typeof reader.result === "string" ? reader.result : undefined,
      });
    reader.readAsDataURL(file);
    if (!formName) setFormName(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast({ type: "error", title: "Document name is required" });
      return;
    }
    const newDoc: DocumentRecord = {
      id: crypto.randomUUID(),
      name: formName.trim(),
      type: formFile?.type || "PDF",
      category: formCategory,
      size: formFile?.size || "0 KB",
      uploadedBy: "Current User",
      date: new Date().toISOString().split("T")[0],
      expiryDate: formExpiry || undefined,
      status: formExpiry ? "Valid" : "No Expiry",
      notes: formNotes || undefined,
      fileUrl: formFile?.url,
    };
    setDocs((prev) => [newDoc, ...prev]);
    closeUpload();
    showToast({
      type: "success",
      title: "Document uploaded",
      message: newDoc.name,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this document?")) return;
    setDocs((prev) => prev.filter((d) => d.id !== id));
    showToast({ type: "success", title: "Document deleted" });
  };

  const handleDownload = (doc: DocumentRecord) => {
    if (!doc.fileUrl) {
      showToast({
        type: "info",
        title: "Demo record",
        message: `${doc.name} is a sample record with no file attached.`,
      });
      return;
    }
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: "success", title: "Download started", message: doc.name });
  };

  const handleView = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
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
          <select
            className="an-select"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Any">Any Status</option>
            <option value="Valid">Valid</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
            <option value="No Expiry">No Expiry</option>
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
                          onClick={() => handleView(doc)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="View"
                          aria-label={`View ${doc.name}`}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleDownload(doc)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="Download"
                          aria-label={`Download ${doc.name}`}
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
        <div className="modal-backdrop" onClick={closeUpload}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={closeUpload}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="eyebrow">Upload New Document</span>
            <h2>Upload Document</h2>
            <p>Upload a new document to the document center.</p>
            <form onSubmit={handleUpload}>
              <div
                onClick={() => fileInputRef.current?.click()}
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
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".pdf,.zip,.docx,.doc,.jpg,.jpeg,.png,.csv,.xlsx"
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                />
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
                  {formFile ? formFile.name : "Click to upload a file"}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--brand-text-muted)",
                  }}
                >
                  {formFile
                    ? `${formFile.size} · ${formFile.type}`
                    : "PDF, ZIP, DOCX, JPG (Max 50MB) — optional for demo"}
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
                <button type="button" className="secondary" onClick={closeUpload}>
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

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="modal-backdrop" onClick={() => setSelectedDoc(null)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={() => setSelectedDoc(null)}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="eyebrow">{selectedDoc.category}</span>
            <h2>{selectedDoc.name}</h2>
            <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
              <div className="an-metric">
                <span className="an-metric-label">Size / type</span>
                <span className="an-metric-value">{selectedDoc.size}</span>
                <span className="an-metric-sub">{selectedDoc.type}</span>
              </div>
              <div className="an-metric">
                <span className="an-metric-label">Uploaded by</span>
                <span className="an-metric-value">
                  {selectedDoc.uploadedBy}
                </span>
                <span className="an-metric-sub">{selectedDoc.date}</span>
              </div>
              <p style={{ margin: 0, color: "var(--brand-text-muted)" }}>
                Expiry: {selectedDoc.expiryDate || "N/A"} · Status:{" "}
                {selectedDoc.status}
              </p>
              {selectedDoc.notes && <p>{selectedDoc.notes}</p>}
              {selectedDoc.fileUrl && selectedDoc.type.startsWith("PNG") && (
                <img
                  src={selectedDoc.fileUrl}
                  alt={selectedDoc.name}
                  style={{ maxWidth: "100%", borderRadius: 8 }}
                />
              )}
              {!selectedDoc.fileUrl && (
                <p style={{ color: "var(--brand-text-muted)", fontSize: 12 }}>
                  This is a sample record with no file attached.
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setSelectedDoc(null)}
              >
                Close
              </button>
              <button
                className="primary"
                onClick={() => handleDownload(selectedDoc)}
              >
                <Download size={14} /> Download
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
