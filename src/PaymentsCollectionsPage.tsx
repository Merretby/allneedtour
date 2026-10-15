import React, { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import { useToast } from "./components/ToastProvider";

interface Payment {
  id: string;
  reference: string;
  date: string;
  amount: number;
  method: "Cash" | "Card" | "Transfer" | "Check";
  type: "Collection" | "Invoice" | "Settlement";
  status: "Completed" | "Pending";
  client?: string;
  notes?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "1",
    client: "Salma R.",
    reference: "REC-001",
    date: "2026-10-08",
    amount: 450.0,
    method: "Card",
    type: "Collection",
    status: "Completed",
    notes: "Settled",
  },
  {
    id: "2",
    client: "Omar B.",
    reference: "REC-002",
    date: "2026-10-08",
    amount: 300.0,
    method: "Cash",
    type: "Collection",
    status: "Pending",
    notes: "Settled",
  },
];

export const PaymentsCollectionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending">("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formClient, setFormClient] = useState("");
  const [formReference, setFormReference] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formMethod, setFormMethod] = useState<Payment["method"]>("Card");
  const [formType, setFormType] = useState<Payment["type"]>("Collection");
  const [formStatus, setFormStatus] = useState<Payment["status"]>("Completed");

  const filtered = payments.filter((p) => {
    const matchesSearch =
      (p.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "Completed")
      return matchesSearch && p.status === "Completed";
    if (filter === "Pending") return matchesSearch && p.status === "Pending";
    return matchesSearch;
  });

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "Pending").length;

  const formatCurrency = (amount: number) =>
    amount.toFixed(2).replace(".", ",") + " MAD";

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClient || !formReference || !formAmount) {
      showToast({ type: "error", title: "Missing required fields" });
      return;
    }
    const newPayment: Payment = {
      id: Date.now().toString(),
      client: formClient,
      reference: formReference,
      date: new Date().toISOString().split("T")[0],
      amount: parseFloat(formAmount) || 0,
      method: formMethod,
      type: formType,
      status: formStatus,
    };
    setPayments([newPayment, ...payments]);
    setIsAddOpen(false);
    setFormClient("");
    setFormReference("");
    setFormAmount("");
    showToast({
      type: "success",
      title: "Payment recorded",
      message: `${formReference} — ${formatCurrency(newPayment.amount)}`,
    });
  };

  const handleValidate = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Completed" } : p))
    );
    showToast({
      type: "success",
      title: "Payment validated",
      message: "Status updated to Completed",
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    setPayments((prev) => prev.filter((p) => p.id !== id));
    showToast({ type: "success", title: "Payment deleted" });
  };

  const handleEdit = (id: string) => {
    const p = payments.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setFormClient(p.client || "");
    setFormReference(p.reference);
    setFormAmount(p.amount.toString());
    setFormMethod(p.method);
    setFormType(p.type);
    setFormStatus(p.status);
    setIsAddOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setPayments((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? {
              ...p,
              client: formClient,
              reference: formReference,
              amount: parseFloat(formAmount) || 0,
              method: formMethod,
              type: formType,
              status: formStatus,
            }
          : p
      )
    );
    setEditingId(null);
    setIsAddOpen(false);
    setFormClient("");
    setFormReference("");
    setFormAmount("");
    showToast({ type: "success", title: "Payment updated" });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Cash Control</span>
        <h2 className="an-page-title">Payments & Collections</h2>
        <p className="an-page-desc">
          Track payments, collections, settlements and outstanding amounts.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Total Collected</span>
          <span className="an-metric-value">
            {formatCurrency(totalCollected)}
          </span>
          <span className="an-metric-sub">from completed payments</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Pending</span>
          <span className="an-metric-value" style={{ color: "var(--warning)" }}>
            {pendingCount}
          </span>
          <span className="an-metric-sub">payments awaiting validation</span>
        </div>
        <button
          className="an-btn an-btn-primary"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={16} /> Add Payment
        </button>
      </div>

      <div className="an-table-wrap">
        <div className="an-table-toolbar">
          <div className="an-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search client, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="an-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <input type="date" className="an-input" style={{ width: 140 }} />
        </div>

        <div className="table-scroll">
          <table className="an-table">
            <thead>
              <tr>
                <th>Client / Record</th>
                <th>Informations</th>
                <th>Date</th>
                <th>Amount</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="user-cell">
                      <span className="avatar">
                        {payment.client
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2) || "?"}
                      </span>
                      <span>
                        <strong>{payment.client || "Unknown Client"}</strong>
                        <small>{payment.notes}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>Receipt {payment.reference}</strong>
                    <br />
                    <small>
                      {payment.method} · {payment.type}
                    </small>
                  </td>
                  <td>{payment.date}</td>
                  <td>
                    <strong>{formatCurrency(payment.amount)}</strong>
                  </td>
                  <td>
                    <span
                      className={`an-badge ${
                        payment.status === "Completed"
                          ? "an-badge-success"
                          : "an-badge-warning"
                      }`}
                    >
                      <span className="an-badge-dot" />
                      {payment.status === "Completed" ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {payment.status === "Pending" ? (
                        <>
                          <button
                            className="an-btn an-btn-sm an-btn-secondary"
                            onClick={() => handleValidate(payment.id)}
                            style={{ padding: "6px 10px", fontSize: 11 }}
                          >
                            Validate
                          </button>
                          <button
                            className="an-btn an-btn-sm an-btn-destructive"
                            onClick={() => handleDelete(payment.id)}
                            style={{ padding: "6px 10px", fontSize: 11 }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="an-btn an-btn-sm an-btn-secondary"
                            onClick={() => handleEdit(payment.id)}
                            style={{ padding: "6px 10px", fontSize: 11 }}
                          >
                            <Edit3 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Payment Modal */}
      {isAddOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddOpen(false)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => {
                setIsAddOpen(false);
                setEditingId(null);
                setFormClient("");
                setFormReference("");
                setFormAmount("");
              }}
            >
              <X size={17} />
            </button>
            <span className="eyebrow">
              {editingId ? "Edit Payment" : "New Payment"}
            </span>
            <h2>
              {editingId ? "Edit Payment Record" : "Record a New Payment"}
            </h2>
            <p>Enter the payment details below.</p>
            <form onSubmit={editingId ? handleSaveEdit : handleAddPayment}>
              <div className="form-grid">
                <div className="an-form-group">
                  <label className="an-label">Client</label>
                  <input
                    type="text"
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Salma R."
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Reference</label>
                  <input
                    type="text"
                    required
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    placeholder="e.g. REC-003"
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Amount (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0.00"
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Collection">Collection</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Settlement">Settlement</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="secondary"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingId(null);
                    setFormClient("");
                    setFormReference("");
                    setFormAmount("");
                  }}
                >
                  Cancel
                </button>
                <button className="primary" type="submit">
                  {editingId ? "Save Changes" : "Record Payment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
