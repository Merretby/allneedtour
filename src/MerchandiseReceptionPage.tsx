import React, { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import {
  KEYS,
  PURCHASE_ORDER_SEED,
  RECEPTION_SEED,
  useStore,
  type PurchaseOrder,
  type Reception,
} from "./store";

export type { Reception };

export const MerchandiseReceptionPage: React.FC = () => {
  const { showToast } = useToast();
  const [receptions, setReceptions] = useStore<Reception[]>(
    KEYS.receptions,
    RECEPTION_SEED
  );
  const [orders, setOrders] = useStore<PurchaseOrder[]>(
    KEYS.purchaseOrders,
    PURCHASE_ORDER_SEED
  );
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Discrepancies"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Reception | null>(null);

  // Validation Form State
  const [formStatus, setFormStatus] = useState<Reception["status"]>("Pending");
  const [notes, setNotes] = useState("");

  const filtered = receptions.filter((item) => {
    const matchesSearch =
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poRef.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Pending")
      return matchesSearch && item.status === "Pending";
    if (activeTab === "Discrepancies")
      return matchesSearch && item.status === "Discrepancy";
    return matchesSearch;
  });

  const pendingCount = receptions.filter((r) => r.status === "Pending").length;
  const validatedCount = receptions.filter(
    (r) => r.status === "Validated"
  ).length;
  const totalAmountReceived = receptions
    .filter((r) => r.status === "Validated")
    .reduce((acc, r) => acc + r.amount, 0);

  const receptionTabs: readonly ("All" | "Pending" | "Discrepancies")[] = [
    "All",
    "Pending",
    "Discrepancies",
  ];

  const getStatusColor = (status: string) => {
    if (status === "Validated")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (status === "Pending")
      return { bg: "var(--warning-bg)", color: "var(--warning)" };
    if (status === "Discrepancy")
      return { bg: "var(--error-bg)", color: "var(--error)" };
    return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
  };

  const openValidateModal = (reception: Reception) => {
    setSelectedItem(reception);
    setFormStatus(reception.status);
    setNotes("");
    setIsModalOpen(true);
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const updated: Reception = { ...selectedItem, status: formStatus, notes };
    setReceptions((prev) =>
      prev.map((r) => (r.id === selectedItem.id ? updated : r))
    );

    if (formStatus === "Validated") {
      // Business rule: a validated reception closes its linked purchase order.
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedItem.poRef ? { ...o, status: "Received" } : o
        )
      );
      showToast({
        type: "success",
        title: "Reception validated",
        message: `${selectedItem.id} — order ${selectedItem.poRef} marked as received`,
      });
    } else if (formStatus === "Discrepancy") {
      showToast({
        type: "warning",
        title: "Discrepancy recorded",
        message: notes || "No notes provided",
      });
    } else {
      showToast({ type: "info", title: "Reception status updated" });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Goods In</span>
        <h2 className="an-page-title">Merchandise Reception</h2>
        <p className="an-page-desc">
          Receive deliveries, verify quantities and validate discrepancies.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Pending Receptions</span>
          <span className="an-metric-value" style={{ color: "var(--warning)" }}>
            {pendingCount}
          </span>
          <span className="an-metric-sub">awaiting validation</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Validated Today</span>
          <span className="an-metric-value" style={{ color: "var(--success)" }}>
            {validatedCount}
          </span>
          <span className="an-metric-sub">receptions validated</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">MAD Received</span>
          <span className="an-metric-value">
            {totalAmountReceived.toLocaleString()}
          </span>
          <span className="an-metric-sub">total validated value</span>
        </div>
      </div>

      <div className="an-table-toolbar">
        <div className="an-tabs">
          {receptionTabs.map((tab) => (
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
            placeholder="Search by PO or Supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="an-grid-2">
        {filtered.map((item) => {
          const status = getStatusColor(item.status);
          return (
            <div
              key={item.id}
              className="an-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: "0 0 0.25rem 0",
                    color: "var(--brand-navy)",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {item.id} - {item.supplier}
                </h4>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.75rem",
                    color: "var(--brand-text-muted)",
                  }}
                >
                  PO Ref: {item.poRef} • Date:{" "}
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--brand-navy)",
                  }}
                >
                  {item.amount.toLocaleString()} MAD Expected
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
                <button
                  onClick={() => openValidateModal(item)}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--brand-border)",
                    background: "var(--brand-white)",
                    color: "var(--brand-navy)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: "auto",
                  }}
                >
                  {item.status === "Pending"
                    ? "Process Reception"
                    : "View / Edit"}
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="an-empty">
            <strong>No receptions found</strong>
            <span>Try a different search, or send a purchase order.</span>
          </div>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15,23,42,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "var(--brand-white)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "500px",
                padding: "2rem",
                position: "relative",
              }}
            >
              <button
                className="close"
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={17} />
              </button>
              <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>
                Process Reception: {selectedItem.id}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--brand-text-muted)",
                  marginBottom: "1.5rem",
                }}
              >
                Verify quantities received for PO:{" "}
                <strong>{selectedItem.poRef}</strong> from{" "}
                <strong>{selectedItem.supplier}</strong>.
              </p>

              <form onSubmit={handleValidate}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Reception Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        borderRadius: "6px",
                        border: "1px solid var(--brand-border)",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Pending">Pending Validation</option>
                      <option value="Validated">Fully Validated</option>
                      <option value="Discrepancy">
                        Has Discrepancy (Missing/Damaged)
                      </option>
                    </select>
                  </div>
                  {formStatus === "Discrepancy" && (
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          marginBottom: "0.25rem",
                        }}
                      >
                        Discrepancy Notes
                      </label>
                      <textarea
                        required
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Explain the missing items or damages..."
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "6px",
                          border: "1px solid var(--brand-border)",
                          boxSizing: "border-box",
                          minHeight: "80px",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: "8px",
                      border: "1px solid var(--brand-border)",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "var(--brand-navy)",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
