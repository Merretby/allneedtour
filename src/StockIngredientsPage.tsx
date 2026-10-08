import React, { useState } from "react";

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
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [activeTab, setActiveTab] = useState<"Current stock" | "Low stock" | "Movements">(
    "Current stock",
  );
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
  const [adjustType, setAdjustType] = useState<"add" | "remove" | "waste">("add");

  // Computed
  const totalValue = stock.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const lowStockItems = stock.filter((item) => item.quantity <= item.minThreshold);
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
    if (quantity === 0) return { label: "Out of Stock", color: "#ef4444", bg: "#fef2f2" };
    if (quantity <= minThreshold) return { label: "Low Stock", color: "#f59e0b", bg: "#fffbeb" };
    return { label: "Healthy", color: "#10b981", bg: "#ecfdf5" };
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
    if (!formName.trim()) return;

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
    } else {
      setStock([...stock, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    let newQuantity = selectedItem.quantity;
    if (adjustType === "add") newQuantity += adjustAmount;
    if (adjustType === "remove" || adjustType === "waste") newQuantity -= adjustAmount;

    // Prevent negative stock for standard removals, but maybe allow it if strictly necessary? Let's bound to 0 for now.
    if (newQuantity < 0) newQuantity = 0;

    const updatedItem = {
      ...selectedItem,
      quantity: newQuantity,
      lastUpdated: new Date().toISOString(),
    };

    setStock(stock.map((s) => (s.id === selectedItem.id ? updatedItem : s)));
    setIsAdjustModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      setStock(stock.filter((s) => s.id !== id));
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Inter, system-ui, sans-serif" }}>
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
          style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", color: "#0f172a", fontWeight: 700 }}
        >
          Stock & Ingredients
        </h1>
        <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem" }}>
          Monitor ingredients, thresholds, movements and stock value.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "0.75rem",
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Total Items
          </p>
          <strong style={{ fontSize: "1.5rem", color: "#0f172a" }}>{totalItems}</strong>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "0.75rem",
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Low Stock Alerts
          </p>
          <strong
            style={{ fontSize: "1.5rem", color: lowStockItems.length > 0 ? "#ef4444" : "#0f172a" }}
          >
            {lowStockItems.length}
          </strong>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "0.75rem",
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Total Stock Value
          </p>
          <strong style={{ fontSize: "1.5rem", color: "#0f172a" }}>
            €
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "1.5rem",
          gap: "2rem",
        }}
      >
        {(["Current stock", "Low stock", "Movements"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "0.75rem 0",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: activeTab === tab ? "#0f172a" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #0f172a" : "2px solid transparent",
              cursor: "pointer",
              marginBottom: "-1px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search stock & ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            width: "300px",
            fontSize: "0.875rem",
          }}
        />
        <button
          onClick={openCreateModal}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            background: "#0f172a",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          + Create Item
        </button>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredStock.map((item, index) => {
          const status = getStatus(item.quantity, item.minThreshold);
          const value = item.quantity * item.unitCost;

          return (
            <div
              key={item.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500 }}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div style={{ minWidth: "200px" }}>
                  <h4
                    style={{
                      margin: "0 0 0.25rem 0",
                      color: "#0f172a",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                    {item.category} • Supplier: {item.supplier || "N/A"}
                  </p>
                </div>

                <div style={{ minWidth: "120px" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f172a" }}>
                    {item.quantity.toLocaleString()} {item.unit}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>
                    Min: {item.minThreshold} {item.unit}
                  </div>
                </div>

                <div style={{ minWidth: "100px" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                    €
                    {value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>
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
                    color: "#0f172a",
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
                    color: "#0f172a",
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
              color: "#64748b",
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
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                {selectedItem ? "Edit Ingredient" : "New Ingredient"}
              </h2>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Ingredient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="e.g. Local Farms"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Unit
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Min. Threshold (Alert)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formMinThreshold}
                    onChange={(e) => setFormMinThreshold(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#475569",
                    }}
                  >
                    Unit Cost (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formUnitCost}
                    onChange={(e) => setFormUnitCost(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
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
                    background: "#0f172a",
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
            <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", color: "#0f172a" }}>
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setAdjustType("add")}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: adjustType === "add" ? "2px solid #10b981" : "1px solid #cbd5e1",
                      background: adjustType === "add" ? "#ecfdf5" : "#fff",
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
                      border: adjustType === "remove" ? "2px solid #f59e0b" : "1px solid #cbd5e1",
                      background: adjustType === "remove" ? "#fffbeb" : "#fff",
                      color: adjustType === "remove" ? "#b45309" : "#475569",
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
                      border: adjustType === "waste" ? "2px solid #ef4444" : "1px solid #cbd5e1",
                      background: adjustType === "waste" ? "#fef2f2" : "#fff",
                      color: adjustType === "waste" ? "#b91c1c" : "#475569",
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
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Current Stock:{" "}
                  <strong>
                    {selectedItem.quantity} {selectedItem.unit}
                  </strong>
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
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
                    background: "#0f172a",
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
