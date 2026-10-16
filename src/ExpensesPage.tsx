import React, { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import {
  EXPENSE_SEED,
  KEYS,
  useEscape,
  useStore,
  type Expense,
} from "./store";

const MOCK_EXPENSES: Expense[] = EXPENSE_SEED;

export const ExpensesPage: React.FC = () => {
  const { showToast } = useToast();
  const [expenses, setExpenses] = useStore<Expense[]>(KEYS.expenses, EXPENSE_SEED);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Paid" | "Pending">("All");
  const [dateFilter, setDateFilter] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formSupplier, setFormSupplier] = useState("");
  const [formReference, setFormReference] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] =
    useState<Expense["category"]>("Utilities");
  const [formStatus, setFormStatus] = useState<Expense["status"]>("Pending");
  const [formPaymentMethod, setFormPaymentMethod] =
    useState<Expense["paymentMethod"]>("Transfer");
  const [formNotes, setFormNotes] = useState("");

  const closeModal = () => {
    setIsAddOpen(false);
    setEditingId(null);
    setFormSupplier("");
    setFormReference("");
    setFormAmount("");
    setFormNotes("");
  };

  useEscape(isAddOpen, closeModal);

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reference.toLowerCase().includes(searchQuery.toLowerCase());
    if (dateFilter && e.date !== dateFilter) return false;
    if (filter === "Paid") return matchesSearch && e.status === "Paid";
    if (filter === "Pending") return matchesSearch && e.status === "Pending";
    return matchesSearch;
  });

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const pendingExpenses = expenses.filter((e) => e.status === "Pending").length;

  const formatCurrency = (amount: number) =>
    amount.toFixed(2).replace(".", ",") + " MAD";

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSupplier || !formReference || !formAmount) {
      showToast({ type: "error", title: "Missing required fields" });
      return;
    }
    const newExpense: Expense = {
      id: Date.now().toString(),
      supplier: formSupplier,
      reference: formReference,
      date: new Date().toISOString().split("T")[0],
      amount: parseFloat(formAmount) || 0,
      category: formCategory,
      status: formStatus,
      paymentMethod: formPaymentMethod,
      notes: formNotes,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setIsAddOpen(false);
    setFormSupplier("");
    setFormReference("");
    setFormAmount("");
    setFormNotes("");
    showToast({
      type: "success",
      title: "Expense recorded",
      message: `${formReference} — ${formatCurrency(newExpense.amount)}`,
    });
  };

  const handleValidate = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Paid" } : e))
    );
    showToast({ type: "success", title: "Expense validated" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this expense record?")) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast({ type: "success", title: "Expense deleted" });
  };

  const handleEdit = (id: string) => {
    const e = expenses.find((x) => x.id === id);
    if (!e) return;
    setEditingId(id);
    setFormSupplier(e.supplier);
    setFormReference(e.reference);
    setFormAmount(e.amount.toString());
    setFormCategory(e.category);
    setFormStatus(e.status);
    setFormPaymentMethod(e.paymentMethod);
    setFormNotes(e.notes || "");
    setIsAddOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === editingId
          ? {
              ...e,
              supplier: formSupplier,
              reference: formReference,
              amount: parseFloat(formAmount) || 0,
              category: formCategory,
              status: formStatus,
              paymentMethod: formPaymentMethod,
              notes: formNotes,
            }
          : e
      )
    );
    setEditingId(null);
    setIsAddOpen(false);
    setFormSupplier("");
    setFormReference("");
    setFormAmount("");
    setFormNotes("");
    showToast({ type: "success", title: "Expense updated" });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Financial Control</span>
        <h2 className="an-page-title">Expenses</h2>
        <p className="an-page-desc">
          Capture operating expenses and keep approvals traceable.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Total Expenses</span>
          <span className="an-metric-value">
            {formatCurrency(totalExpenses)}
          </span>
          <span className="an-metric-sub">all recorded expenses</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Pending</span>
          <span className="an-metric-value" style={{ color: "var(--warning)" }}>
            {pendingExpenses}
          </span>
          <span className="an-metric-sub">expenses awaiting approval</span>
        </div>
        <button
          className="an-btn an-btn-primary"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="an-table-wrap">
        <div className="an-table-toolbar">
          <div className="an-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search supplier, reference..."
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
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="date"
            className="an-input"
            style={{ width: 160 }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by date"
          />
        </div>

        <div className="table-scroll">
          <table className="an-table">
            <thead>
              <tr>
                <th>Supplier / Record</th>
                <th>Informations</th>
                <th>Date</th>
                <th>Amount</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div className="user-cell">
                      <span className="avatar">
                        {expense.supplier
                          .split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <span>
                        <strong>{expense.supplier}</strong>
                        <small>{expense.category}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>Expense {expense.reference}</strong>
                    <br />
                    <small>{expense.paymentMethod}</small>
                  </td>
                  <td>{expense.date}</td>
                  <td>
                    <strong>{formatCurrency(expense.amount)}</strong>
                  </td>
                  <td>
                    <span
                      className={`an-badge ${
                        expense.status === "Paid"
                          ? "an-badge-success"
                          : "an-badge-warning"
                      }`}
                    >
                      <span className="an-badge-dot" />
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {expense.status === "Pending" ? (
                        <>
                          <button
                            className="an-btn an-btn-sm an-btn-secondary"
                            onClick={() => handleValidate(expense.id)}
                            style={{ padding: "6px 10px", fontSize: 11 }}
                          >
                            Validate
                          </button>
                          <button
                            className="an-btn an-btn-sm an-btn-destructive"
                            onClick={() => handleDelete(expense.id)}
                            style={{ padding: "6px 10px", fontSize: 11 }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="an-btn an-btn-sm an-btn-secondary"
                            onClick={() => handleEdit(expense.id)}
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
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {isAddOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" onClick={closeModal} aria-label="Close">
              <X size={17} />
            </button>
            <span className="eyebrow">
              {editingId ? "Edit Expense" : "New Expense"}
            </span>
            <h2>
              {editingId ? "Edit Expense Record" : "Record a New Expense"}
            </h2>
            <p>Enter the expense details below.</p>
            <form onSubmit={editingId ? handleSaveEdit : handleAddExpense}>
              <div className="form-grid">
                <div className="an-form-group">
                  <label className="an-label">Supplier</label>
                  <input
                    type="text"
                    required
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="e.g. Redal"
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
                    placeholder="e.g. EXP-23-1105"
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
                  <label className="an-label">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="an-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Payment Method</label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) =>
                      setFormPaymentMethod(e.target.value as any)
                    }
                    className="an-select"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="an-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="an-label">Notes</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Additional details..."
                    className="an-textarea"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  {editingId ? "Save Changes" : "Record Expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
