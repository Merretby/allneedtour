import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import {
  INVENTORY_SEED,
  KEYS,
  useEscape,
  useStore,
  type InventoryCount,
} from "./store";

export type { InventoryCount };

export const InventoriesPage: React.FC = () => {
  const { showToast } = useToast();
  const [counts, setCounts] = useStore<InventoryCount[]>(
    KEYS.inventories,
    INVENTORY_SEED
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<InventoryCount | null>(null);
  const [itemsCounted, setItemsCounted] = useState("");
  const [varianceValue, setVarianceValue] = useState("");

  const closeModal = () => {
    setSelected(null);
    setItemsCounted("");
    setVarianceValue("");
  };

  useEscape(selected !== null, closeModal);

  const filtered = counts.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCount = counts.filter((c) => c.status === "Open").length;
  const completedCount = counts.filter((c) => c.status === "Completed").length;
  const totalVariance = counts.reduce((acc, c) => acc + c.varianceValue, 0);

  const startNewCount = () => {
    const highestId = counts.reduce((max, c) => {
      const n = Number(c.id.replace(/\D/g, ""));
      return Number.isFinite(n) && n > max ? n : max;
    }, 42);
    const newCount: InventoryCount = {
      id: `INV-${String(highestId + 1).padStart(3, "0")}`,
      date: new Date().toISOString(),
      assignedTo: "Current User",
      status: "Open",
      itemsCounted: 0,
      varianceValue: 0,
    };
    setCounts((prev) => [newCount, ...prev]);
    showToast({
      type: "success",
      title: "Inventory count started",
      message: newCount.id,
    });
  };

  const openDetails = (item: InventoryCount) => {
    setSelected(item);
    setItemsCounted(item.itemsCounted ? String(item.itemsCounted) : "");
    setVarianceValue(item.varianceValue ? String(item.varianceValue) : "");
  };

  const completeCount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const counted = Math.max(0, parseInt(itemsCounted, 10) || 0);
    const variance = Number(varianceValue) || 0;
    setCounts((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              status: "Completed",
              itemsCounted: counted,
              varianceValue: variance,
            }
          : c
      )
    );
    const id = selected.id;
    closeModal();
    showToast({
      type: variance < 0 ? "warning" : "success",
      title: "Inventory count submitted",
      message: `${id} — ${counted} items${
        variance !== 0
          ? `, variance ${variance > 0 ? "+" : ""}${variance} MAD`
          : ""
      }`,
    });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Stock Auditing</span>
        <h2 className="an-page-title">Inventories</h2>
        <p className="an-page-desc">
          Run physical counts to identify variances against system stock.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 180 }}>
          <span className="an-metric-label">Open Counts</span>
          <span
            className="an-metric-value"
            style={{ color: openCount > 0 ? "var(--warning)" : undefined }}
          >
            {openCount}
          </span>
          <span className="an-metric-sub">in progress</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 180 }}>
          <span className="an-metric-label">Completed Audits</span>
          <span className="an-metric-value">{completedCount}</span>
          <span className="an-metric-sub">closed counts</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 180 }}>
          <span className="an-metric-label">Historic Variance</span>
          <span
            className="an-metric-value"
            style={{
              color: totalVariance < 0 ? "var(--error)" : "var(--success)",
            }}
          >
            {totalVariance > 0 ? "+" : ""}
            {totalVariance.toLocaleString()} MAD
          </span>
          <span className="an-metric-sub">against system stock</span>
        </div>
        <button className="an-btn an-btn-primary" onClick={startNewCount}>
          <Plus size={16} /> Start New Count
        </button>
      </div>

      <div className="an-table-toolbar">
        <div className="an-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search by ID or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="an-list">
        {filtered.map((item) => {
          const isCompleted = item.status === "Completed";
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <h4 style={{ margin: 0, color: "var(--brand-navy)" }}>
                    {item.id}
                  </h4>
                  <span
                    className={`an-badge ${
                      isCompleted ? "an-badge-success" : "an-badge-warning"
                    }`}
                  >
                    <span className="an-badge-dot" />
                    {item.status}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.75rem",
                    color: "var(--brand-text-muted)",
                  }}
                >
                  Date: {new Date(item.date).toLocaleDateString()} • Assigned:{" "}
                  {item.assignedTo}
                </p>
                <div style={{ fontSize: "0.875rem", color: "var(--brand-navy)" }}>
                  <strong>{item.itemsCounted}</strong> items counted
                  {isCompleted && (
                    <span
                      style={{
                        marginLeft: "1rem",
                        color:
                          item.varianceValue < 0
                            ? "var(--error)"
                            : "var(--success)",
                      }}
                    >
                      Variance: {item.varianceValue > 0 ? "+" : ""}
                      {item.varianceValue} MAD
                    </span>
                  )}
                </div>
              </div>
              <div>
                <button
                  className="an-btn an-btn-secondary an-btn-sm"
                  onClick={() => openDetails(item)}
                >
                  {isCompleted ? "View Report" : "Resume Count"}
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="an-empty">
            <strong>No inventory counts found</strong>
            <span>Try a different search, or start a new count.</span>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={closeModal}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="eyebrow">
              {selected.status === "Completed" ? "Count Report" : "Resume Count"}
            </span>
            <h2>{selected.id}</h2>
            <p>
              Assigned to {selected.assignedTo} on{" "}
              {new Date(selected.date).toLocaleDateString()}.
            </p>

            {selected.status === "Completed" ? (
              <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                <div className="an-metric">
                  <span className="an-metric-label">Items counted</span>
                  <span className="an-metric-value">
                    {selected.itemsCounted}
                  </span>
                </div>
                <div className="an-metric">
                  <span className="an-metric-label">Variance value</span>
                  <span
                    className="an-metric-value"
                    style={{
                      color:
                        selected.varianceValue < 0
                          ? "var(--error)"
                          : "var(--success)",
                    }}
                  >
                    {selected.varianceValue > 0 ? "+" : ""}
                    {selected.varianceValue} MAD
                  </span>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="primary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={completeCount}>
                <div className="form-grid">
                  <div className="an-form-group">
                    <label className="an-label">Items counted</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={itemsCounted}
                      onChange={(e) => setItemsCounted(e.target.value)}
                      className="an-input"
                    />
                  </div>
                  <div className="an-form-group">
                    <label className="an-label">Variance value (MAD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={varianceValue}
                      onChange={(e) => setVarianceValue(e.target.value)}
                      className="an-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button className="primary" type="submit">
                    Submit Count
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
