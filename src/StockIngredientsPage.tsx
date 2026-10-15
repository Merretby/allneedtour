import React, { useState, useEffect } from "react";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { useToast } from "./components/ToastProvider";

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
  supplier: string;
  lastUpdated: string;
}

const STORAGE_KEY = "allneeds.stock_items";

const INITIAL_STOCK: StockItem[] = [
  {
    id: "1",
    name: "Truffle (Black)",
    category: "Produce",
    quantity: 2.4,
    unit: "kg",
    minThreshold: 3.0,
    unitCost: 150.0,
    supplier: "Tartufi Bros",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Extra Virgin Olive Oil",
    category: "Dry Goods",
    quantity: 18,
    unit: "L",
    minThreshold: 10,
    unitCost: 12.5,
    supplier: "Olio Roma",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Sea Bass Fillet",
    category: "Seafood",
    quantity: 14,
    unit: "kg",
    minThreshold: 10,
    unitCost: 28.0,
    supplier: "Ocean Catch",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Heavy Cream 35%",
    category: "Dairy",
    quantity: 4,
    unit: "L",
    minThreshold: 5,
    unitCost: 4.2,
    supplier: "Laiterie Locale",
    lastUpdated: new Date().toISOString(),
  },
];

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
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStock(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stock));
    } catch {}
  }, [stock]);

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

  const getStatus = (quantity: number, minThreshold: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", color: "#EF4444", bg: "#FEF2F2" };
    if (quantity <= minThreshold)
      return { label: "Low Stock", color: "#F59E0B", bg: "#FFFBEB" };
    return { label: "Healthy", color: "#10B981", bg: "#ECFDF5" };
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

    const newItem: StockItem = {
      id: selectedItem ? selectedItem.id : Date.now().toString(),
      name: formName,
      category: formCategory,
      quantity: formQuantity,
      unit: formUnit,
      minThreshold: formMinThreshold,
      unitCost: formUnitCost,
      supplier: formSupplier,
      lastUpdated: new Date().toISOString(),
    };

    if (selectedItem) {
      setStock(stock.map((s) => (s.id === selectedItem.id ? newItem : s)));
      showToast({ type: "success", title: "Ingredient updated" });
    } else {
      setStock([...stock, newItem]);
      showToast({
        type: "success",
        title: "Ingredient created",
        message: formName,
      });
    }
    setIsModalOpen(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    let newQuantity = selectedItem.quantity;
    if (adjustType === "add") newQuantity += adjustAmount;
    if (adjustType === "remove" || adjustType === "waste")
      newQuantity -= adjustAmount;

    if (newQuantity < 0) newQuantity = 0;

    const updatedItem = {
      ...selectedItem,
      quantity: newQuantity,
      lastUpdated: new Date().toISOString(),
    };

    setStock(stock.map((s) => (s.id === selectedItem.id ? updatedItem : s)));
    setIsAdjustModalOpen(false);

    const actionLabels = { add: "Received", remove: "Used", waste: "Wasted" };
    showToast({
      type: "success",
      title: "Stock adjusted",
      message: `${selectedItem.name}: ${actionLabels[adjustType]} ${adjustAmount} ${selectedItem.unit}`,
    });
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return;
    setStock(stock.filter((s) => s.id !== id));
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
      {/* Header & Metrics */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#64748b",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Inventory Control
        </p>
        <h1
          style={{
            margin: "0 0 0.5rem 0",
            fontSize: "1.75rem",
            color: "#0B1739",
            fontWeight: 700,
          }}
        >
          Stock & Ingredients
        </h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: "0.875rem" }}>
          Monitor ingredients, thresholds, movements and stock value.
        </p>
      </div>

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
            style={{ color: lowStockItems.length > 0 ? "#EF4444" : "#0B1739" }}
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

      {/* List */}
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
                    color: "#94a3b8",
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
                      color: "#0B1739",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}
                  >
                    {item.category} • Supplier: {item.supplier || "N/A"}
                  </p>
                </div>

                <div style={{ minWidth: "120px" }}>
                  <div
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#0B1739",
                    }}
                  >
                    {item.quantity.toLocaleString()} {item.unit}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748B",
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
                      color: "#0B1739",
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
                      color: "#64748B",
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
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#0B1739",
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
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#0B1739",
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
              color: "#64748B",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px dashed #cbd5e1",
            }}
          >
            No inventory items found.
          </div>
        )}
      </div>

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
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0B1739" }}>
                {selectedItem ? "Edit Ingredient" : "New Ingredient"}
              </h2>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EF4444",
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
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="e.g. Local Farms"
                    className="an-input"
                  />
                </div>

                <div className="an-form-group">
                  <label className="an-label">Initial Quantity</label>
                  <input
                    type="number"
                    step="0.01"
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
                  borderTop: "1px solid #e2e8f0",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
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
                    background: "#0B1739",
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
                color: "#0B1739",
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
                    color: "#475569",
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
                          ? "2px solid #10B981"
                          : "1px solid #cbd5e1",
                      background: adjustType === "add" ? "#ECFDF5" : "#fff",
                      color: adjustType === "add" ? "#047857" : "#475569",
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
                          ? "2px solid #F59E0B"
                          : "1px solid #cbd5e1",
                      background: adjustType === "remove" ? "#FFFBEB" : "#fff",
                      color: adjustType === "remove" ? "#B45309" : "#475569",
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
                          ? "2px solid #EF4444"
                          : "1px solid #cbd5e1",
                      background: adjustType === "waste" ? "#FEF2F2" : "#fff",
                      color: adjustType === "waste" ? "#B91C1C" : "#475569",
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
                    color: "#475569",
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
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.75rem",
                    color: "#64748B",
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
                    border: "1px solid #cbd5e1",
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
                    background: "#0B1739",
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
