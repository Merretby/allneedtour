import React, { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import {
  KEYS,
  PURCHASE_ORDER_SEED,
  RECEPTION_SEED,
  SUPPLIER_SEED,
  useStore,
  type PurchaseOrder,
  type Reception,
  type Supplier,
} from "./store";

export type { PurchaseOrder };

export const PurchasesPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useStore<PurchaseOrder[]>(
    KEYS.purchaseOrders,
    PURCHASE_ORDER_SEED
  );
  const [, setReceptions] = useStore<Reception[]>(
    KEYS.receptions,
    RECEPTION_SEED
  );
  const [suppliers] = useStore<Supplier[]>(KEYS.suppliers, SUPPLIER_SEED);
  const [activeTab, setActiveTab] = useState<"Orders" | "Drafts" | "Approvals">(
    "Orders"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseOrder | null>(null);

  // Form State
  const [formSupplier, setFormSupplier] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formStatus, setFormStatus] =
    useState<PurchaseOrder["status"]>("Draft");

  const filtered = orders.filter((item) => {
    const matchesSearch =
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Drafts") return matchesSearch && item.status === "Draft";
    if (activeTab === "Approvals")
      return matchesSearch && item.status === "Approval";
    return matchesSearch;
  });

  const purchaseTabs: readonly ("Orders" | "Drafts" | "Approvals")[] = [
    "Orders",
    "Drafts",
    "Approvals",
  ];

  const openCount = orders.filter((o) =>
    ["Draft", "Approval", "Sent"].includes(o.status)
  ).length;
  const approvalCount = orders.filter((o) => o.status === "Approval").length;
  const totalAmount = orders.reduce((acc, o) => acc + o.amount, 0);

  const getStatusColor = (status: string) => {
    if (status === "Received")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (status === "Sent")
      return { bg: "var(--brand-surface)", color: "var(--brand-blue)" };
    if (status === "Approval")
      return { bg: "var(--warning-bg)", color: "var(--warning)" };
    if (status === "Cancelled")
      return { bg: "var(--error-bg)", color: "var(--error)" };
    return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
  };

  const openModal = (order?: PurchaseOrder) => {
    if (order) {
      setSelectedItem(order);
      setFormSupplier(order.supplier);
      setFormAmount(order.amount.toString());
      setFormStatus(order.status);
    } else {
      setSelectedItem(null);
      setFormSupplier("");
      setFormAmount("");
      setFormStatus("Draft");
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formAmount);
    if (!formSupplier || !formAmount || Number.isNaN(amount) || amount <= 0) {
      showToast({
        type: "error",
        title: "Supplier and a positive amount are required",
      });
      return;
    }
    const highestId = orders.reduce((max, o) => {
      const n = Number(o.id.replace(/\D/g, ""));
      return Number.isFinite(n) && n > max ? n : max;
    }, 1050);
    const newItem: PurchaseOrder = {
      id: selectedItem ? selectedItem.id : `PO-${highestId + 1}`,
      supplier: formSupplier,
      amount,
      status: formStatus,
      date: selectedItem ? selectedItem.date : new Date().toISOString(),
    };
    setOrders((prev) =>
      selectedItem
        ? prev.map((o) => (o.id === selectedItem.id ? newItem : o))
        : [newItem, ...prev]
    );

    // Business rule: a Sent purchase order becomes receivable.
    if (newItem.status === "Sent") {
      setReceptions((prev) =>
        prev.some((r) => r.poRef === newItem.id)
          ? prev
          : [
              {
                id: newItem.id.replace("PO-", "MR-"),
                poRef: newItem.id,
                supplier: newItem.supplier,
                status: "Pending",
                date: new Date().toISOString(),
                amount: newItem.amount,
              },
              ...prev,
            ]
      );
    }

    showToast({
      type: "success",
      title: selectedItem
        ? "Purchase order updated"
        : "Purchase order created",
      message:
        newItem.status === "Sent"
          ? `${newItem.id} is now waiting in Merchandise Reception`
          : newItem.id,
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this purchase order?")) return;
    setOrders(orders.filter((o) => o.id !== id));
    showToast({ type: "success", title: "Purchase order deleted" });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Procurement</span>
        <h2 className="an-page-title">Purchases</h2>
        <p className="an-page-desc">
          Create purchase orders, compare suppliers and track approvals.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Open Orders</span>
          <span className="an-metric-value">{openCount}</span>
          <span className="an-metric-sub">draft, approval, sent</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Awaiting Approval</span>
          <span className="an-metric-value" style={{ color: "var(--warning)" }}>
            {approvalCount}
          </span>
          <span className="an-metric-sub">orders pending review</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">MAD This Week</span>
          <span className="an-metric-value">
            {totalAmount.toLocaleString()}
          </span>
          <span className="an-metric-sub">total order value</span>
        </div>
        <button className="an-btn an-btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> Create PO
        </button>
      </div>

      <div className="an-table-toolbar">
        <div className="an-tabs">
          {purchaseTabs.map((tab) => (
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
            placeholder="Search purchases..."
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
                  Date: {new Date(item.date).toLocaleDateString()}
                </p>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--brand-navy)",
                  }}
                >
                  {item.amount.toLocaleString()} MAD
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
            <strong>No purchase orders found</strong>
            <span>Try a different search, or create a new order.</span>
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
              {selectedItem ? "Edit Purchase Order" : "New Purchase Order"}
            </span>
            <h2>
              {selectedItem ? "Edit Purchase Order" : "New Purchase Order"}
            </h2>
            <p>Enter the purchase order details below.</p>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="an-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="an-label">Supplier</label>
                  <select
                    required
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="an-select"
                  >
                    <option value="">Select a supplier…</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    {formSupplier &&
                      !suppliers.some((s) => s.name === formSupplier) && (
                        <option value={formSupplier}>{formSupplier}</option>
                      )}
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Amount (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Approval">Approval</option>
                    <option value="Sent">Sent</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
                  Save PO
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
