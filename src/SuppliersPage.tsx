import React, { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import { KEYS, SUPPLIER_SEED, useStore, type Supplier } from "./store";

export type { Supplier };

const CATEGORIES = [
  "Produce",
  "Meat",
  "Seafood",
  "Dairy",
  "Dry Goods",
  "Beverage",
  "Packaging",
  "Chemicals",
];

export const SuppliersPage: React.FC = () => {
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useStore<Supplier[]>(
    KEYS.suppliers,
    SUPPLIER_SEED
  );
  const [activeTab, setActiveTab] = useState<
    "All suppliers" | "Preferred" | "Performance"
  >("All suppliers");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Supplier | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formContact, setFormContact] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<
    "Preferred" | "Active" | "Inactive"
  >("Active");

  const filtered = suppliers
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = `${item.name} ${item.category} ${item.contactName} ${item.email}`
        .toLowerCase()
        .includes(q);
      if (activeTab === "Preferred")
        return matchesSearch && item.status === "Preferred";
      return matchesSearch;
    })
    .sort((a, b) =>
      activeTab === "Performance"
        ? b.performance - a.performance
        : a.name.localeCompare(b.name)
    );

  const preferredCount = suppliers.filter(
    (s) => s.status === "Preferred"
  ).length;
  const avgPerformance =
    suppliers.reduce((acc, s) => acc + s.performance, 0) /
    (suppliers.length || 1);

  const supplierTabs: readonly (
    "All suppliers" | "Preferred" | "Performance"
  )[] = ["All suppliers", "Preferred", "Performance"];

  const getStatusColor = (status: string) => {
    if (status === "Preferred")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (status === "Active")
      return { bg: "var(--brand-surface)", color: "var(--brand-blue)" };
    return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
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
      setFormName("");
      setFormCategory(CATEGORIES[0]);
      setFormContact("");
      setFormPhone("");
      setFormEmail("");
      setFormStatus("Active");
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast({ type: "error", title: "Supplier name is required" });
      return;
    }
    const newItem: Supplier = {
      id: selectedItem ? selectedItem.id : Date.now().toString(),
      name: formName,
      category: formCategory,
      contactName: formContact,
      phone: formPhone,
      email: formEmail,
      performance: selectedItem ? selectedItem.performance : 100,
      status: formStatus,
    };
    if (selectedItem) {
      setSuppliers(
        suppliers.map((s) => (s.id === selectedItem.id ? newItem : s))
      );
      showToast({
        type: "success",
        title: "Supplier updated",
        message: formName,
      });
    } else {
      setSuppliers([...suppliers, newItem]);
      showToast({
        type: "success",
        title: "Supplier created",
        message: `${formName} is now available in Purchasing`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this supplier?")) return;
    setSuppliers(suppliers.filter((s) => s.id !== id));
    showToast({ type: "success", title: "Supplier deleted" });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Supplier Directory</span>
        <h2 className="an-page-title">Suppliers</h2>
        <p className="an-page-desc">
          Centralize contacts, terms, performance and purchasing history.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Suppliers</span>
          <span className="an-metric-value">{suppliers.length}</span>
          <span className="an-metric-sub">total suppliers</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Preferred</span>
          <span className="an-metric-value">{preferredCount}</span>
          <span className="an-metric-sub">preferred suppliers</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">On Time</span>
          <span className="an-metric-value">{avgPerformance.toFixed(1)}%</span>
          <span className="an-metric-sub">average performance</span>
        </div>
        <button className="an-btn an-btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> Create Supplier
        </button>
      </div>

      <div className="an-table-toolbar">
        <div className="an-tabs">
          {supplierTabs.map((tab) => (
            <button
              key={tab}
              className={`an-tab ${activeTab === tab ? "an-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="an-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="an-grid-2">
        {filtered.map((item, index) => {
          const status = getStatusColor(item.status);
          return (
            <div
              key={item.id}
              className="an-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    color: "var(--brand-text-muted)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4
                    style={{
                      margin: "0 0 0.25rem 0",
                      color: "var(--brand-navy)",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.75rem",
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    {item.category} • {item.performance}% on time
                  </p>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    <div>👤 {item.contactName}</div>
                    <div>📞 {item.phone}</div>
                    <div>✉️ {item.email}</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: status.color,
                    background: status.bg,
                  }}
                >
                  {item.status}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => openModal(item)}
                    style={{
                      padding: "0.4rem 0.75rem",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--brand-border)",
                      background: "var(--brand-white)",
                      color: "var(--brand-navy)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "0.4rem 0.75rem",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--error-bg)",
                      background: "var(--error-bg)",
                      color: "var(--error)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="an-empty">
            <strong>No suppliers found</strong>
            <span>Try a different search, or create a new supplier.</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setIsModalOpen(false)}>
              <X size={17} />
            </button>
            <span className="eyebrow">
              {selectedItem ? "Edit Supplier" : "New Supplier"}
            </span>
            <h2>{selectedItem ? "Edit Supplier" : "New Supplier"}</h2>
            <p>Enter the supplier details below.</p>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="an-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="an-label">Supplier Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
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
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Preferred">Preferred</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Contact Name</label>
                  <input
                    type="text"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="an-input"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Save Supplier
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
