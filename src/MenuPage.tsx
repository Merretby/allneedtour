import React, { useState } from "react";

export interface MenuItem {
  id: string;
  name: string;
  category: "Starters" | "Mains" | "Dessert" | "Drinks" | "Side Dishes";
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "01",
    name: "Truffle Risotto",
    category: "Mains",
    price: 28,
    description: "Creamy Arborio rice with black truffle paste, shaved parmesan, and fresh herbs.",
    imageUrl: "/dishes/truffle.jpg",
    available: true,
  },
  {
    id: "02",
    name: "Sea Bass Fillet",
    category: "Mains",
    price: 34,
    description:
      "Pan-seared Mediterranean sea bass with lemon butter sauce and seasonal asparagus.",
    imageUrl: "/dishes/seabass.jpg",
    available: true,
  },
  {
    id: "03",
    name: "Atlas Gourmet Burger",
    category: "Mains",
    price: 22,
    description:
      "Prime wagyu beef patty, caramelized onions, aged cheddar, served with truffle fries.",
    imageUrl: "/dishes/burger.jpg",
    available: true,
  },
  {
    id: "04",
    name: "Decadent Chocolate Tart",
    category: "Dessert",
    price: 12,
    description:
      "Rich dark chocolate ganache, hazelnut praline dust, served with vanilla bean gelato.",
    imageUrl: "/dishes/chocolate_tart.jpg",
    available: true,
  },
  {
    id: "05",
    name: "Classic Tiramisu",
    category: "Dessert",
    price: 10,
    description:
      "Traditional Italian dessert with espresso-soaked ladyfingers and whipped mascarpone cream.",
    imageUrl: "/dishes/tiramisu.jpg",
    available: true,
  },
];

const PRESET_PHOTOS = [
  { label: "Truffle Risotto", url: "/dishes/truffle.jpg" },
  { label: "Sea Bass", url: "/dishes/seabass.jpg" },
  { label: "Atlas Burger", url: "/dishes/burger.jpg" },
  { label: "Chocolate Tart", url: "/dishes/chocolate_tart.jpg" },
  { label: "Classic Tiramisu", url: "/dishes/tiramisu.jpg" },
];

export const MenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<MenuItem["category"]>("Mains");
  const [formPrice, setFormPrice] = useState<string>("15");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState<string>("/dishes/truffle.jpg");

  const categories = ["All", "Starters", "Mains", "Dessert", "Drinks", "Side Dishes"];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Mains");
    setFormPrice("15");
    setFormDescription("");
    setFormImageUrl("/dishes/truffle.jpg");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormDescription(item.description);
    setFormImageUrl(item.imageUrl);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseFloat(formPrice) || 0;

    if (editingItem) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                name: formName,
                category: formCategory,
                price: parsedPrice,
                description: formDescription,
                imageUrl: formImageUrl || "/dishes/truffle.jpg",
              }
            : it,
        ),
      );
    } else {
      const newItem: MenuItem = {
        id: String(items.length + 1).padStart(2, "0"),
        name: formName,
        category: formCategory,
        price: parsedPrice,
        description: formDescription,
        imageUrl: formImageUrl || "/dishes/truffle.jpg",
        available: true,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const handleToggleAvailability = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, available: !it.available } : it)));
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: "1px solid #e0e0e0",
                background: activeCategory === cat ? "#0f172a" : "#ffffff",
                color: activeCategory === cat ? "#ffffff" : "#475569",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search menu & prices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              minWidth: "240px",
              fontSize: "0.875rem",
            }}
          />
          <button
            onClick={handleOpenCreateModal}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            + Create Dish
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "180px" }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: item.available ? "none" : "grayscale(80%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(15, 23, 42, 0.85)",
                  color: "#38bdf8",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {item.price} MAD
              </span>
              <span
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#0f172a",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                {item.category}
              </span>
            </div>

            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#64748b",
                  flex: 1,
                  lineHeight: "1.4",
                }}
              >
                {item.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1.25rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  onClick={() => handleToggleAvailability(item.id)}
                  style={{
                    border: "none",
                    background: item.available ? "#dcfce7" : "#fee2e2",
                    color: item.available ? "#166534" : "#991b1b",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {item.available ? "In Stock" : "Sold Out"}
                </button>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#334155",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{
                      border: "none",
                      background: "#fef2f2",
                      color: "#dc2626",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
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
              background: "#ffffff",
              borderRadius: "16px",
              padding: "2rem",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "1.25rem",
                fontSize: "1.25rem",
                color: "#0f172a",
              }}
            >
              {editingItem ? "Edit Menu Dish" : "Add New Dish to Menu"}
            </h2>

            <form onSubmit={handleSaveItem}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Truffle Pasta"
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.35rem",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Side Dishes">Side Dishes</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.35rem",
                    }}
                  >
                    Price (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 18.5"
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

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ingredients, preparation, allergens..."
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Dish Photo
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
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: formImageUrl === p.url ? "2px solid #0f172a" : "1px solid #cbd5e1",
                        background: formImageUrl === p.url ? "#f1f5f9" : "#fff",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="Or enter image URL"
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
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
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {editingItem ? "Save Changes" : "Add Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
