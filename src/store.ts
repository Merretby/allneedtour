import { useCallback, useEffect, useState } from "react";

/**
 * Shared demo-data layer.
 *
 * The whole front-end demo runs against localStorage-backed collections so that
 * records survive navigation and page refreshes and stay consistent between
 * related modules (suppliers -> purchases -> reception -> stock, payments and
 * expenses -> dashboard, reservations -> dashboard, ...).
 *
 * It is intentionally lightweight: a tiny observable store + a typed React hook.
 * When a real API is added, only this module needs to change.
 */

/** localStorage keys used by the demo data layer. */
export const KEYS = {
  suppliers: "allneeds.suppliers",
  purchaseOrders: "allneeds.purchase_orders",
  receptions: "allneeds.receptions",
  stockItems: "allneeds.stock_items",
  stockMovements: "allneeds.stock_movements",
  wasteLogs: "allneeds.waste_logs",
  payments: "allneeds.payments",
  expenses: "allneeds.expenses",
  reservations: "allneeds.reservations",
  inventories: "allneeds.inventories",
  documents: "allneeds.documents",
  team: "allneeds.team",
} as const;

const EVENT = "allneeds:store-change";

/* -------------------------------------------------------------------------- */
/* Low-level store                                                            */
/* -------------------------------------------------------------------------- */

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — keep working in memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

/**
 * React hook backed by localStorage. Seeds storage on first use so that a
 * module can be opened directly and still see the shared records.
 */
export function useStore<T>(
  key: string,
  seed: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStore(key, seed));

  useEffect(() => {
    if (localStorage.getItem(key) == null) {
      writeStore(key, seed);
    } else {
      setValue(readStore(key, seed));
    }

    const sync = (event: Event) => {
      if (event.type === "storage") {
        const storageEvent = event as StorageEvent;
        if (storageEvent.key && storageEvent.key !== key) return;
      } else if (
        event instanceof CustomEvent &&
        event.detail &&
        event.detail !== key
      ) {
        return;
      }
      setValue(readStore(key, seed));
    };

    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // `seed` is a stable module-level constant in every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (action) => {
      setValue((prev) => {
        const next =
          typeof action === "function" ? (action as (p: T) => T)(prev) : action;
        writeStore(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, set];
}

/** Close a dialog/menu on Escape while `active` is true. */
export function useEscape(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}

/* -------------------------------------------------------------------------- */
/* Entities                                                                   */
/* -------------------------------------------------------------------------- */

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  performance: number;
  status: "Preferred" | "Active" | "Inactive";
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  amount: number;
  status: "Draft" | "Approval" | "Sent" | "Received" | "Cancelled";
  date: string;
}

export interface Reception {
  id: string;
  poRef: string;
  supplier: string;
  status: "Pending" | "Validated" | "Discrepancy";
  date: string;
  amount: number;
  notes?: string;
}

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

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: "receive" | "use" | "waste" | "create" | "adjust";
  amount: number;
  unit: string;
  at: string;
}

export interface WasteLog {  id: string;
  date: string;
  itemName: string;
  quantity: number;
  unit: string;
  cost: number;
  reason: "Expired" | "Prep Waste" | "Service Error" | "Dropped/Spilled";
  loggedBy: string;
}

export interface Payment {
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

export type ExpenseCategory =
  | "Utilities"
  | "Payroll"
  | "Maintenance"
  | "Marketing"
  | "Supplies"
  | "Other";

export interface Expense {
  id: string;
  supplier: string;
  reference: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  status: "Paid" | "Pending";
  paymentMethod: "Transfer" | "Card" | "Check" | "Cash";
  notes?: string;
}

export type ReservationStatus = "Confirmed" | "Seated" | "Late" | "Finished";
export interface Reservation {
  id: string;
  name: string;
  table: string;
  time: string;
  party: number;
  status: ReservationStatus;
  tags: string[];
  note: string;
}

/* -------------------------------------------------------------------------- */
/* Seed data                                                                  */
/* -------------------------------------------------------------------------- */

const today = () => new Date().toISOString();
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

export const SUPPLIER_SEED: Supplier[] = [
  {
    id: "1",
    name: "Fresh Market",
    category: "Produce",
    contactName: "Ahmed B.",
    phone: "+212 600 112233",
    email: "orders@freshmarket.ma",
    performance: 98,
    status: "Preferred",
  },
  {
    id: "2",
    name: "Ocean Foods",
    category: "Seafood",
    contactName: "Sara K.",
    phone: "+212 600 445566",
    email: "sales@oceanfoods.ma",
    performance: 96,
    status: "Preferred",
  },
  {
    id: "3",
    name: "Atlas Drinks",
    category: "Beverage",
    contactName: "Youssef M.",
    phone: "+212 600 778899",
    email: "contact@atlasdrinks.ma",
    performance: 92,
    status: "Active",
  },
  {
    id: "4",
    name: "Maison Pro",
    category: "Dry Goods",
    contactName: "Nadia R.",
    phone: "+212 600 111222",
    email: "pro@maison.ma",
    performance: 89,
    status: "Active",
  },
];

export const PURCHASE_ORDER_SEED: PurchaseOrder[] = [
  { id: "PO-1048", supplier: "Fresh Market", amount: 2480, status: "Sent", date: today() },
  { id: "PO-1047", supplier: "Ocean Foods", amount: 1920, status: "Received", date: daysAgo(1) },
  { id: "PO-1049", supplier: "Maison Pro", amount: 740, status: "Draft", date: today() },
  { id: "PO-1050", supplier: "Atlas Drinks", amount: 1140, status: "Approval", date: today() },
];

export const RECEPTION_SEED: Reception[] = [
  { id: "MR-1048", poRef: "PO-1048", supplier: "Fresh Market", status: "Pending", date: today(), amount: 2480 },
  { id: "MR-1047", poRef: "PO-1047", supplier: "Ocean Foods", status: "Validated", date: daysAgo(1), amount: 1920 },
  { id: "MR-1045", poRef: "PO-1045", supplier: "Atlas Drinks", status: "Validated", date: daysAgo(2), amount: 950 },
  { id: "MR-1042", poRef: "PO-1042", supplier: "Maison Pro", status: "Discrepancy", date: daysAgo(3), amount: 3100 },
];

export const STOCK_SEED: StockItem[] = [
  { id: "1", name: "Truffle (Black)", category: "Produce", quantity: 2.4, unit: "kg", minThreshold: 3.0, unitCost: 150.0, supplier: "Fresh Market", lastUpdated: today() },
  { id: "2", name: "Extra Virgin Olive Oil", category: "Dry Goods", quantity: 18, unit: "L", minThreshold: 10, unitCost: 12.5, supplier: "Maison Pro", lastUpdated: today() },
  { id: "3", name: "Sea Bass Fillet", category: "Seafood", quantity: 14, unit: "kg", minThreshold: 10, unitCost: 28.0, supplier: "Ocean Foods", lastUpdated: today() },
  { id: "4", name: "Heavy Cream 35%", category: "Dairy", quantity: 4, unit: "L", minThreshold: 5, unitCost: 4.2, supplier: "Fresh Market", lastUpdated: today() },
];

export const STOCK_MOVEMENT_SEED: StockMovement[] = [];

export const WASTE_SEED: WasteLog[] = [  { id: "WST-101", date: today(), itemName: "Sea Bass Fillet", quantity: 0.5, unit: "kg", cost: 140, reason: "Prep Waste", loggedBy: "Chef Ahmed" },
  { id: "WST-102", date: today(), itemName: "Heavy Cream 35%", quantity: 1, unit: "L", cost: 42, reason: "Expired", loggedBy: "Sous Chef Sara" },
  { id: "WST-103", date: daysAgo(1), itemName: "Truffle (Black)", quantity: 0.1, unit: "kg", cost: 1500, reason: "Dropped/Spilled", loggedBy: "Commis Ali" },
];

export const PAYMENT_SEED: Payment[] = [
  { id: "1", client: "Salma R.", reference: "REC-001", date: "2026-10-08", amount: 450.0, method: "Card", type: "Collection", status: "Completed", notes: "Settled" },
  { id: "2", client: "Omar B.", reference: "REC-002", date: "2026-10-08", amount: 300.0, method: "Cash", type: "Collection", status: "Pending", notes: "Awaiting validation" },
];

export const EXPENSE_SEED: Expense[] = [
  { id: "1", supplier: "Redal", reference: "EXP-23-1104", date: "2026-10-08", amount: 3500.0, category: "Utilities", status: "Paid", paymentMethod: "Transfer", notes: "Monthly bill" },
  { id: "2", supplier: "FixIt Co.", reference: "EXP-23-1103", date: "2026-10-08", amount: 1200.0, category: "Maintenance", status: "Pending", paymentMethod: "Check", notes: "AC Repair" },
];

export interface InventoryCount {  id: string;
  date: string;
  assignedTo: string;
  status: "Open" | "Completed";
  itemsCounted: number;
  varianceValue: number;
}

export const RESERVATION_SEED: Reservation[] = [
  { id: "r-1", name: "Camille Martin", table: "T12", time: "18:00", party: 4, status: "Confirmed", tags: ["VIP", "Birthday"], note: "Window seat requested." },
  { id: "r-2", name: "Karim Haddad", table: "T04", time: "18:15", party: 2, status: "Seated", tags: ["First Visit"], note: "Prefers sparkling water." },
  { id: "r-3", name: "Sarah Benali", table: "T08", time: "18:30", party: 3, status: "Late", tags: ["Nut Allergy", "High Priority"], note: "Allergy confirmed with kitchen." },
  { id: "r-4", name: "Thomas Laurent", table: "T16", time: "19:00", party: 6, status: "Confirmed", tags: ["Anniversary"], note: "Anniversary dessert requested." },
  { id: "r-5", name: "Nora Martin", table: "T03", time: "19:15", party: 2, status: "Finished", tags: ["Special Request"], note: "Receipt emailed to guest." },
  { id: "r-6", name: "Elena Rossi", table: "T21", time: "19:45", party: 4, status: "Confirmed", tags: ["VIP"], note: "Returning guest." },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  shift: string;
  nextShift: string;
  status: "On Shift" | "Off Shift" | "Leave";
  hoursThisWeek: number;
}

export const TEAM_SEED: TeamMember[] = [
  { id: "1", name: "Karim Haddad", email: "karim@allneeds.com", role: "Head Chef", department: "Kitchen", shift: "Morning (06:00 - 15:00)", nextShift: "Tomorrow 06:00", status: "On Shift", hoursThisWeek: 42 },
  { id: "2", name: "Sara Majid", email: "sara.m@allneeds.com", role: "Waitress", department: "Service", shift: "Evening (16:00 - 00:00)", nextShift: "Today 16:00", status: "Off Shift", hoursThisWeek: 28 },
  { id: "3", name: "Youssef Bennani", email: "youssef.b@allneeds.com", role: "Bartender", department: "Bar", shift: "Night (18:00 - 02:00)", nextShift: "Tomorrow 18:00", status: "On Shift", hoursThisWeek: 35 },
  { id: "4", name: "Lina Farah", email: "lina@allneeds.com", role: "Sous Chef", department: "Kitchen", shift: "Off", nextShift: "Monday 08:00", status: "Leave", hoursThisWeek: 0 },
  { id: "5", name: "Thomas Roy", email: "thomas@allneeds.com", role: "Cashier", department: "Front of house", shift: "Morning (08:00 - 16:00)", nextShift: "Tomorrow 08:00", status: "On Shift", hoursThisWeek: 38 },
];

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedBy: string;
  date: string;
  expiryDate?: string;
  status: "Valid" | "Expiring Soon" | "Expired" | "No Expiry";
  notes?: string;
  fileUrl?: string;
}

export const DOCUMENT_SEED: DocumentRecord[] = [
  {
    id: "1",
    name: "Hygiene_Certificate_2023.pdf",
    type: "PDF",
    category: "Certificates",
    size: "2.4 MB",
    uploadedBy: "Sofia Benali",
    date: "2023-01-15",
    expiryDate: "2024-01-15",
    status: "Valid",
  },
  {
    id: "2",
    name: "Supplier_Contracts_Q4.zip",
    type: "ZIP",
    category: "Contracts",
    size: "14.1 MB",
    uploadedBy: "Karim Haddad",
    date: "2023-10-01",
    status: "No Expiry",
  },
  {
    id: "3",
    name: "Employee_Handbook.docx",
    type: "DOCX",
    category: "HR",
    size: "845 KB",
    uploadedBy: "HR Dept",
    date: "2022-11-20",
    status: "No Expiry",
  },
  {
    id: "4",
    name: "Fire_Safety_Inspection.pdf",
    type: "PDF",
    category: "Certificates",
    size: "3.1 MB",
    uploadedBy: "Sofia Benali",
    date: "2022-11-05",
    expiryDate: "2023-11-05",
    status: "Expiring Soon",
  },
  {
    id: "5",
    name: "Liquor_License_Old.pdf",
    type: "PDF",
    category: "Licenses",
    size: "1.2 MB",
    uploadedBy: "Admin",
    date: "2021-05-12",
    expiryDate: "2022-05-12",
    status: "Expired",
  },
];

export const INVENTORY_SEED: InventoryCount[] = [
  {
    id: "INV-042",
    date: today(),
    assignedTo: "Chef Ahmed",
    status: "Open",
    itemsCounted: 45,
    varianceValue: 0,
  },
  {
    id: "INV-041",
    date: daysAgo(7),
    assignedTo: "Sous Chef Sara",
    status: "Completed",
    itemsCounted: 184,
    varianceValue: -420,
  },
  {
    id: "INV-040",
    date: daysAgo(14),
    assignedTo: "Chef Ahmed",
    status: "Completed",
    itemsCounted: 180,
    varianceValue: 120,
  },
];

/* -------------------------------------------------------------------------- */
/* Formatting helpers                                                         */
/* -------------------------------------------------------------------------- */

export function formatMAD(value: number, fractionDigits = 0): string {
  const locale =
    typeof document !== "undefined" && document.documentElement.lang === "fr"
      ? "fr-FR"
      : "en-GB";
  return (
    value.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }) + " MAD"
  );
}

/** Trigger a real CSV file download in the browser. */
export function downloadCsv(
  filename: string,
  rows: (string | number)[][]
): void {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
