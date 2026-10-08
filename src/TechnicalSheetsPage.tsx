import React, { useState } from "react";

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface TechnicalSheet {
  id: string;
  name: string;
  category: string;
  prepTime: number;
  cookTime: number;
  yieldPortions: number;
  ingredients: Ingredient[];
  method: string;
  allergens: string[];
  imageUrl: string;
  sellingPrice: number;
}

const INITIAL_SHEETS: TechnicalSheet[] = [
  {
    id: "01",
    name: "Truffle Risotto",
    category: "Mains",
    prepTime: 15,
    cookTime: 25,
    yieldPortions: 4,
    ingredients: [
      { id: "i1", name: "Arborio Rice", quantity: 400, unit: "g", unitCost: 0.005 },
      { id: "i2", name: "Black Truffle Paste", quantity: 50, unit: "g", unitCost: 0.15 },
      { id: "i3", name: "Parmesan", quantity: 100, unit: "g", unitCost: 0.02 },
      { id: "i4", name: "Butter", quantity: 50, unit: "g", unitCost: 0.01 },
      { id: "i5", name: "Vegetable Stock", quantity: 1.2, unit: "L", unitCost: 1.5 },
    ],
    method:
      "1. Toast rice in butter.\n2. Gradually add warm stock while stirring.\n3. Fold in truffle paste and parmesan off heat.\n4. Serve immediately.",
    allergens: ["Dairy"],
    imageUrl: "/dishes/truffle.jpg",
    sellingPrice: 28,
  },
  {
    id: "02",
    name: "Sea Bass Fillet",
    category: "Mains",
    prepTime: 10,
    cookTime: 15,
    yieldPortions: 1,
    ingredients: [
      { id: "i1", name: "Sea Bass Fillet", quantity: 180, unit: "g", unitCost: 0.04 },
      { id: "i2", name: "Asparagus", quantity: 100, unit: "g", unitCost: 0.015 },
      { id: "i3", name: "Lemon", quantity: 0.5, unit: "pc", unitCost: 0.4 },
      { id: "i4", name: "Butter", quantity: 20, unit: "g", unitCost: 0.01 },
    ],
    method:
      "1. Score fish skin and season.\n2. Pan-sear skin-side down until crisp.\n3. Flip and baste with butter and lemon.\n4. Blanch and sauté asparagus.",
    allergens: ["Fish", "Dairy"],
    imageUrl: "/dishes/seabass.jpg",
    sellingPrice: 34,
  },
];

const PRESET_PHOTOS = [
  { label: "Truffle", url: "/dishes/truffle.jpg" },
  { label: "Sea Bass", url: "/dishes/seabass.jpg" },
  { label: "Burger", url: "/dishes/burger.jpg" },
  { label: "Tart", url: "/dishes/chocolate_tart.jpg" },
  { label: "Tiramisu", url: "/dishes/tiramisu.jpg" },
];

const ALLERGEN_OPTIONS = [
  "Dairy",
  "Gluten",
  "Nuts",
  "Shellfish",
  "Fish",
  "Eggs",
  "Soy",
  "Mustard",
  "Celery",
];

export const TechnicalSheetsPage: React.FC = () => {
  const [sheets, setSheets] = useState<TechnicalSheet[]>(INITIAL_SHEETS);
  const [activeTab, setActiveTab] = useState<"Recipes" | "Costing" | "Allergens">("Recipes");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSheet, setEditingSheet] = useState<TechnicalSheet | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Mains");
  const [formPrepTime, setFormPrepTime] = useState<number>(15);
  const [formCookTime, setFormCookTime] = useState<number>(20);
  const [formYield, setFormYield] = useState<number>(4);
  const [formIngredients, setFormIngredients] = useState<Ingredient[]>([]);
  const [formMethod, setFormMethod] = useState("");
  const [formAllergens, setFormAllergens] = useState<string[]>([]);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSellingPrice, setFormSellingPrice] = useState<number>(20);

  const calculateTotalCost = (ingredients: Ingredient[]) => {
    return ingredients.reduce((sum, ing) => sum + ing.quantity * ing.unitCost, 0);
  };

  const calculateCostPerPortion = (ingredients: Ingredient[], portions: number) => {
    if (portions <= 0) return 0;
    return calculateTotalCost(ingredients) / portions;
  };

  const calculateFoodCostPct = (ingredients: Ingredient[], portions: number, price: number) => {
    if (price <= 0) return 0;
    const costPerPortion = calculateCostPerPortion(ingredients, portions);
    return (costPerPortion / price) * 100;
  };

  const filteredSheets = sheets.filter((sheet) =>
    sheet.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenCreateModal = () => {
    setEditingSheet(null);
    setFormName("");
    setFormCategory("Mains");
    setFormPrepTime(15);
    setFormCookTime(20);
    setFormYield(4);
    setFormIngredients([]);
    setFormMethod("");
    setFormAllergens([]);
    setFormImageUrl(PRESET_PHOTOS[0].url);
    setFormSellingPrice(20);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sheet: TechnicalSheet) => {
    setEditingSheet(sheet);
    setFormName(sheet.name);
    setFormCategory(sheet.category);
    setFormPrepTime(sheet.prepTime);
    setFormCookTime(sheet.cookTime);
    setFormYield(sheet.yieldPortions);
    setFormIngredients([...sheet.ingredients]);
    setFormMethod(sheet.method);
    setFormAllergens([...sheet.allergens]);
    setFormImageUrl(sheet.imageUrl);
    setFormSellingPrice(sheet.sellingPrice);
    setIsModalOpen(true);
  };

  const handleAddIngredient = () => {
    setFormIngredients([
      ...formIngredients,
      { id: Date.now().toString(), name: "", quantity: 0, unit: "g", unitCost: 0 },
    ]);
  };

  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setFormIngredients(
      formIngredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)),
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setFormIngredients(formIngredients.filter((ing) => ing.id !== id));
  };

  const handleToggleAllergen = (allergen: string) => {
    if (formAllergens.includes(allergen)) {
      setFormAllergens(formAllergens.filter((a) => a !== allergen));
    } else {
      setFormAllergens([...formAllergens, allergen]);
    }
  };

  const handleSaveSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newSheet: TechnicalSheet = {
      id: editingSheet ? editingSheet.id : Date.now().toString(),
      name: formName,
      category: formCategory,
      prepTime: formPrepTime,
      cookTime: formCookTime,
      yieldPortions: formYield,
      ingredients: formIngredients,
      method: formMethod,
      allergens: formAllergens,
      imageUrl: formImageUrl,
      sellingPrice: formSellingPrice,
    };

    if (editingSheet) {
      setSheets(sheets.map((s) => (s.id === editingSheet.id ? newSheet : s)));
    } else {
      setSheets([...sheets, newSheet]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSheet = (id: string) => {
    if (confirm("Delete this technical sheet?")) {
      setSheets(sheets.filter((s) => s.id !== id));
    }
  };

  // Metrics
  const avgCostPct =
    sheets.length > 0
      ? sheets.reduce(
          (sum, s) => sum + calculateFoodCostPct(s.ingredients, s.yieldPortions, s.sellingPrice),
          0,
        ) / sheets.length
      : 0;

  const totalAllergens = new Set(sheets.flatMap((s) => s.allergens)).size;

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
          Kitchen Control
        </p>
        <h1
          style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", color: "#0f172a", fontWeight: 700 }}
        >
          Technical Sheets
        </h1>
        <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem" }}>
          Recipes, yields, allergens and food-cost details for every item.
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
            Recipes
          </p>
          <strong style={{ fontSize: "1.5rem", color: "#0f172a" }}>{sheets.length}</strong>
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
            Avg Food Cost
          </p>
          <strong style={{ fontSize: "1.5rem", color: "#0f172a" }}>{avgCostPct.toFixed(1)}%</strong>
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
            Tracked Allergens
          </p>
          <strong style={{ fontSize: "1.5rem", color: "#0f172a" }}>{totalAllergens}</strong>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "1.5rem",
          gap: "2rem",
        }}
      >
        {["Recipes", "Costing", "Allergens"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
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
          placeholder="Search technical sheets..."
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
          onClick={handleOpenCreateModal}
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
          + Create
        </button>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredSheets.map((sheet, index) => {
          const costPct = calculateFoodCostPct(
            sheet.ingredients,
            sheet.yieldPortions,
            sheet.sellingPrice,
          );
          const costPerPortion = calculateCostPerPortion(sheet.ingredients, sheet.yieldPortions);

          return (
            <div
              key={sheet.id}
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
                {sheet.imageUrl && (
                  <img
                    src={sheet.imageUrl}
                    alt={sheet.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div>
                  <h4
                    style={{
                      margin: "0 0 0.25rem 0",
                      color: "#0f172a",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {sheet.name}{" "}
                    <span style={{ color: "#475569", fontWeight: 500, marginLeft: "0.5rem" }}>
                      - {costPct.toFixed(1)}% cost
                    </span>
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                    {activeTab === "Recipes" &&
                      `Yield: ${sheet.yieldPortions} portions • Prep: ${sheet.prepTime}m • Cook: ${sheet.cookTime}m`}
                    {activeTab === "Costing" &&
                      `Cost/Portion: ${costPerPortion.toFixed(2)} MAD • Sell Price: ${sheet.sellingPrice.toFixed(2)} MAD`}
                    {activeTab === "Allergens" &&
                      (sheet.allergens.length > 0
                        ? `Allergens: ${sheet.allergens.join(", ")}`
                        : "No tracked allergens")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleOpenEditModal(sheet)}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#0f172a",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          );
        })}
        {filteredSheets.length === 0 && (
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
            No technical sheets found.
          </div>
        )}
      </div>

      {/* Modal */}
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
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
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
                {editingSheet ? "Edit Technical Sheet" : "New Technical Sheet"}
              </h2>
              {editingSheet && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteSheet(editingSheet.id);
                    setIsModalOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Delete Recipe
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSheet}>
              {/* Basic Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
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
                    Recipe Name *
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
                    <option value="Prep">Prep / Base</option>
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Sauce">Sauce</option>
                  </select>
                </div>
              </div>

              {/* Time & Yield */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
                      color: "#475569",
                    }}
                  >
                    Prep Time (m)
                  </label>
                  <input
                    type="number"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(Number(e.target.value))}
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
                    Cook Time (m)
                  </label>
                  <input
                    type="number"
                    value={formCookTime}
                    onChange={(e) => setFormCookTime(Number(e.target.value))}
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
                    Yield (Portions)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formYield}
                    onChange={(e) => setFormYield(Number(e.target.value))}
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
                    Sell Price (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(Number(e.target.value))}
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

              {/* Ingredients */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                    Ingredients & Costing
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                    Cost/Portion (MAD): 
                    {calculateCostPerPortion(formIngredients, formYield).toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    <span>Ingredient</span>
                    <span>Qty</span>
                    <span>Unit</span>
                    <span>Unit Cost (MAD)</span>
                    <span style={{ width: "24px" }}></span>
                  </div>

                  {formIngredients.map((ing, idx) => (
                    <div
                      key={ing.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="e.g. Flour"
                        value={ing.name}
                        onChange={(e) => handleUpdateIngredient(ing.id, "name", e.target.value)}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                        }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={ing.quantity}
                        onChange={(e) =>
                          handleUpdateIngredient(ing.id, "quantity", Number(e.target.value))
                        }
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                        }}
                      />
                      <select
                        value={ing.unit}
                        onChange={(e) => handleUpdateIngredient(ing.id, "unit", e.target.value)}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                        }}
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                        <option value="pc">piece</option>
                      </select>
                      <input
                        type="number"
                        step="0.001"
                        value={ing.unitCost}
                        onChange={(e) =>
                          handleUpdateIngredient(ing.id, "unitCost", Number(e.target.value))
                        }
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "0.4rem",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    style={{
                      marginTop: "0.5rem",
                      background: "none",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      width: "100%",
                      color: "#475569",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    + Add Ingredient
                  </button>
                </div>
              </div>

              {/* Method & Allergens */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#0f172a",
                    }}
                  >
                    Preparation Method
                  </label>
                  <textarea
                    rows={6}
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value)}
                    placeholder="Step by step instructions..."
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#0f172a",
                    }}
                  >
                    Allergens
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {ALLERGEN_OPTIONS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => handleToggleAllergen(a)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "20px",
                          border: formAllergens.includes(a)
                            ? "1px solid #0f172a"
                            : "1px solid #cbd5e1",
                          background: formAllergens.includes(a) ? "#0f172a" : "#fff",
                          color: formAllergens.includes(a) ? "#fff" : "#475569",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        color: "#0f172a",
                      }}
                    >
                      Finished Photo
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {PRESET_PHOTOS.map((p) => (
                        <button
                          type="button"
                          key={p.url}
                          onClick={() => setFormImageUrl(p.url)}
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            border:
                              formImageUrl === p.url ? "2px solid #0f172a" : "1px solid #cbd5e1",
                            background: formImageUrl === p.url ? "#f1f5f9" : "#fff",
                            fontSize: "0.65rem",
                            cursor: "pointer",
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e2e8f0",
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
                  Save Technical Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
