import React, { useState } from "react";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { useToast } from "./components/ToastProvider";
import {
  KEYS,
  STOCK_MOVEMENT_SEED,
  STOCK_SEED,
  SUPPLIER_SEED,
  WASTE_SEED,
  useStore,
  type StockItem,
  type StockMovement,
  type Supplier,
  type WasteLog,
} from "./store";

export type { StockItem };

const CATEGORIES = [
  "Produce",
  "Meat",
  "Seafood",
  "Dairy",
  "Dry Goods",
  "Beverages",
  "Packaging",
  "Chemicals",
];
const UNITS = ["kg", "g", "L", "ml", "pc", "box"];

export const StockIngredientsPage: React.FC = () => {
  const { showToast } = useToast();
  const [stock, setStock] = useStore<StockItem[]>(KEYS.stockItems, STOCK_SEED);
  const [suppliers] = useStore<Supplier[]>(KEYS.suppliers, SUPPLIER_SEED);
  const [movements, setMovements] = useStore<StockMovement[]>(
    KEYS.stockMovements,
    STOCK_MOVEMENT_SEED
  );
  const [, setWasteLogs] = useStore<WasteLog[]>(KEYS.wasteLogs, WASTE_SEED);
  const [activeTab, setActiveTab] = useState<
    "Current stock" | "Low stock" | "Movements"
  >("Current stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Form State for Create/Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formQuantity, setFormQuantity] = useState(0);
  const [formUnit, setFormUnit] = useState(UNITS[0]);
  const [formMinThreshold, setFormMinThreshold] = useState(0);
  const [formUnitCost, setFormUnitCost] = useState(0);
  const [formSupplier, setFormSupplier] = useState("");

  // Form State for Adjust
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustType, setAdjustType] = useState<"add" | "remove" | "waste">(
    "add"
  );

  // Computed
  const totalValue = stock.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );
  const lowStockItems = stock.filter(
    (item) => item.quantity <= item.minThreshold
  );
  const totalItems = stock.length;

  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Low stock") {
      return matchesSearch && item.quantity <= item.minThreshold;
    }
    return matchesSearch;
  });

  const movementRows = movements
    .filter((m) =>
      `${m.itemName} ${m.type}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .slice(0, 60);

  const getStatus = (quantity: number, minThreshold: number) => {
    if (quantity === 0)
      return {
        label: "Out of Stock",
        color: "var(--error)",
        bg: "var(--error-bg)",
      };
    if (quantity <= minThreshold)
      return {
        label: "Low Stock",
        color: "var(--warning)",
        bg: "var(--warning-bg)",
      };
    return { label: "Healthy", color: "var(--success)", bg: "var(--success-bg)" };
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setFormName("");
    setFormCategory(CATEGORIES[0]);
    setFormQuantity(0);
    setFormUnit(UNITS[0]);
    setFormMinThreshold(0);
    setFormUnitCost(0);
    setFormSupplier("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: StockItem) => {
    setSelectedItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormUnit(item.unit);
    setFormMinThreshold(item.minThreshold);
    setFormUnitCost(item.unitCost);
    setFormSupplier(item.supplier);
    setIsModalOpen(true);
  };

  const openAdjustModal = (item: StockItem) => {
    setSelectedItem(item);
    setAdjustAmount(0);
    setAdjustType("add");
    setIsAdjustModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast({ type: "error", title: "Ingredient name is required" });
      return;
    }

    const quantity = Math.max(0, formQuantity || 0);
    const minThreshold = Math.max(0, formMinThreshold || 0);
    const unitCost = Math.max(0, formUnitCost || 0);

    const newItem: StockItem = {
      id: selectedItem ? selectedItem.id : crypto.randomUUID(),
      name: formName.trim(),
      category: formCategory,
      quantity,
      unit: formUnit,
      minThreshold,
      unitCost,
      supplier: formSupplier,
      lastUpdated: new Date().toISOString(),
    };

    if (selectedItem) {
      setStock((prev) =>
        prev.map((s) => (s.id === selectedItem.id ? newItem : s))
      );
      showToast({ type: "success", title: "Ingredient updated" });
    } else {
      setStock((prev) => [...prev, newItem]);
      setMovements((prev) => [
        {
          id: crypto.randomUUID(),
          itemId: newItem.id,
          itemName: newItem.name,
          type: "create",
          amount: newItem.quantity,
          unit: newItem.unit,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
      showToast({
        type: "success",
        title: "Ingredient created",
        message: newItem.name,
      });
    }
    setIsModalOpen(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const amount = Math.max(0, adjustAmount || 0);
    if (amount <= 0) {
      showToast({ type: "error", title: "Enter a positive amount" });
      return;
    }

    let newQuantity = selectedItem.quantity;
    if (adjustType === "add") newQuantity += amount;
    if (adjustType === "remove" || adjustType === "waste")
      newQuantity -= amount;

    if (newQuantity < 0) newQuantity = 0;

    const updatedItem = {
      ...selectedItem,
      quantity: newQuantity,
      lastUpdated: new Date().toISOString(),
    };

    setStock((prev) =>
      prev.map((s) => (s.id === selectedItem.id ? updatedItem : s))
    );

    const movementType =
      adjustType === "add" ? "receive" : adjustType === "waste" ? "waste" : "use";
    setMovements((prev) => [
      {
        id: crypto.randomUUID(),
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        type: movementType,
        amount,
        unit: selectedItem.unit,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);

    // Business rule: recording waste also creates a Losses & Waste entry.
    if (adjustType === "waste") {
      const estimatedCost = Math.round(amount * selectedItem.unitCost * 100) / 100;
      setWasteLogs((prev) => [
        {
          id: `WST-${Math.floor(200 + Math.random() * 800)}`,
          date: new Date().toISOString(),
          itemName: selectedItem.name,
          quantity: amount,
          unit: selectedItem.unit,
          cost: estimatedCost,
          reason: "Prep Waste",
          loggedBy: "Stock adjustment",
        },
        ...prev,
      ]);
    }

    setIsAdjustModalOpen(false);

    const actionLabels = { add: "Received", remove: "Used", waste: "Wasted" };
    showToast({
      type: adjustType === "waste" ? "warning" : "success",
      title: "Stock adjusted",
      message: `${selectedItem.name}: ${actionLabels[adjustType]} ${amount} ${selectedItem.unit}${
        adjustType === "waste" ? " — waste log created" : ""
      }`,
    });
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return;
    setStock((prev) => prev.filter((s) => s.id !== id));
    setIsModalOpen(false);
    showToast({ type: "success", title: "Ingredient deleted" });
  };

  const stockTabs: readonly ("Current stock" | "Low stock" | "Movements")[] = [
    "Current stock",
    "Low stock",
    "Movements",
  ];

  return (
    <div className="an-card">
      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Total Items</span>
          <span className="an-metric-value">{totalItems}</span>
          <span className="an-metric-sub">stock items</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Low Stock Alerts</span>
          <span
            className="an-metric-value"
            style={{ color: lowStockItems.length > 0 ? "var(--error)" : "var(--brand-navy)" }}
          >
            {lowStockItems.length}
          </span>
          <span className="an-metric-sub">below threshold</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Total Stock Value</span>
          <span className="an-metric-value">
            €
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="an-metric-sub">total inventory value</span>
        </div>
        <button className="an-btn an-btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Create Item
        </button>
      </div>

      {/* Tabs */}
      <div className="an-table-toolbar">
        <div className="an-tabs">
          {stockTabs.map((tab) => (
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
            placeholder="Search stock & ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Movements */}
      {activeTab === "Movements" && (
        <div className="an-list">
          {movementRows.length === 0 ? (
            <div className="an-empty">
              <strong>No stock movements yet</strong>
              <span>Adjust or create an ingredient to record a movement.</span>
            </div>
          ) : (
            movementRows.map((m) => (
              <div
                key={m.id}
                className="an-card"
                style={{
                  padding: "0.9rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span
                    className={`an-badge ${
                      m.type === "receive" || m.type === "create"
                        ? "an-badge-success"
                        : m.type === "waste"
                          ? "an-badge-error"
                          : "an-badge-warning"
                    }`}
                  >
                    <span className="an-badge-dot" />
                    {m.type}
                  </span>
                  <div>
                    <strong style={{ color: "var(--brand-navy)" }}>
                      {m.itemName}
                    </strong>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--brand-text-muted)",
                      }}
                    >
                      {new Date(m.at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <strong
                  style={{
                    color:
                      m.type === "waste"
                        ? "var(--error)"
                        : "var(--success)",
                  }}
                >
                  {m.type === "receive" || m.type === "create" ? "+" : "-"}
                  {m.amount} {m.unit}
                </strong>
              </div>
            ))
          )}
        </div>
      )}

      {/* List */}
      {activeTab !== "Movements" && (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredStock.map((item, index) => {
          const status = getStatus(item.quantity, item.minThreshold);
          const value = item.quantity * item.unitCost;

          return (
            <div
              key={item.id}
              className="an-card"
              style={{
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
              >
                <span
                  style={{
                    color: "var(--brand-text-muted)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div style={{ minWidth: "200px" }}>
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
                    style={{ margin: 0, fontSize: "0.75rem", color: "var(--brand-text-muted)" }}
                  >
                    {item.category} • Supplier: {item.supplier || "N/A"}
                  </p>
                </div>

                <div style={{ minWidth: "120px" }}>
                  <div
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--brand-navy)",
                    }}
                  >
                    {item.quantity.toLocaleString()} {item.unit}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--brand-text-muted)",
                      marginTop: "0.125rem",
                    }}
                  >
                    Min: {item.minThreshold} {item.unit}
                  </div>
                </div>

                <div style={{ minWidth: "100px" }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--brand-navy)",
                    }}
                  >
                    €
                    {value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--brand-text-muted)",
                      marginTop: "0.125rem",
                    }}
                  >
                    {item.unitCost.toFixed(2)} MAD / {item.unit}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: status.color,
                      background: status.bg,
                    }}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => openAdjustModal(item)}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--brand-border)",
                    background: "#fff",
                    color: "var(--brand-navy)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Adjust
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--brand-border)",
                    background: "var(--brand-bg)",
                    color: "var(--brand-navy)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
        {filteredStock.length === 0 && (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--brand-text-muted)",
              background: "var(--brand-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--brand-border)",
            }}
          >
            No inventory items found.
          </div>
        )}
      </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              padding: "2rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--brand-navy)" }}>
                {selectedItem ? "Edit Ingredient" : "New Ingredient"}
              </h2>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--error)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Delete Item
                </button>
              )}
            </div>

            <form onSubmit={handleSaveItem}>
              <div className="form-grid">
                <div className="an-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="an-label">Ingredient Name</label>
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
                  <label className="an-label">Supplier</label>
                  <select
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="an-select"
                  >
                    <option value="">No supplier</option>
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
                  <label className="an-label">Initial Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="an-input"
                  />
                </div>

                <div className="an-form-group">
                  <label className="an-label">Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="an-select"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="an-form-group">
                  <label className="an-label">Min. Threshold (Alert)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formMinThreshold}
                    onChange={(e) =>
                      setFormMinThreshold(Number(e.target.value))
                    }
                    className="an-input"
                  />
                </div>

                <div className="an-form-group">
                  <label className="an-label">Unit Cost (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formUnitCost}
                    onChange={(e) => setFormUnitCost(Number(e.target.value))}
                    className="an-input"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--brand-border)",
                  marginTop: "1.5rem",
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              padding: "2rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: "1.25rem",
                color: "var(--brand-navy)",
              }}
            >
              Adjust Stock: {selectedItem.name}
            </h2>

            <form onSubmit={handleAdjustStock}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--brand-text-muted)",
                  }}
                >
                  Movement Type
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAdjustType("add")}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border:
                        adjustType === "add"
                          ? "2px solid var(--success)"
                          : "1px solid var(--brand-border)",
                      background: adjustType === "add" ? "var(--success-bg)" : "#fff",
                      color: adjustType === "add" ? "var(--success)" : "var(--brand-text-muted)",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    + Receive
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("remove")}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border:
                        adjustType === "remove"
                          ? "2px solid var(--warning)"
                          : "1px solid var(--brand-border)",
                      background: adjustType === "remove" ? "var(--warning-bg)" : "#fff",
                      color: adjustType === "remove" ? "var(--warning)" : "var(--brand-text-muted)",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    - Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("waste")}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border:
                        adjustType === "waste"
                          ? "2px solid var(--error)"
                          : "1px solid var(--brand-border)",
                      background: adjustType === "waste" ? "var(--error-bg)" : "#fff",
                      color: adjustType === "waste" ? "var(--error)" : "var(--brand-text-muted)",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Waste
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                    color: "var(--brand-text-muted)",
                  }}
                >
                  Amount ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid var(--brand-border)",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.75rem",
                    color: "var(--brand-text-muted)",
                  }}
                >
                  Current Stock:{" "}
                  <strong>
                    {selectedItem.quantity} {selectedItem.unit}
                  </strong>
                </p>
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
                  onClick={() => setIsAdjustModalOpen(false)}
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
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
