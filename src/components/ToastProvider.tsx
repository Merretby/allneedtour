import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  const typeIcons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  const typeColors: Record<ToastType, string> = {
    success: "var(--success)",
    error: "var(--error)",
    warning: "var(--warning)",
    info: "var(--brand-blue)",
  };

  return (
    <div className="an-toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`an-toast ${toast.type}`}
          style={{ borderLeftColor: typeColors[toast.type] }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: typeColors[toast.type] + "15",
              color: typeColors[toast.type],
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {typeIcons[toast.type]}
          </span>
          <div>
            <strong
              style={{
                display: "block",
                fontSize: 13,
                color: "var(--brand-navy)",
              }}
            >
              {toast.title}
            </strong>
            {toast.message && (
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "var(--brand-text-muted)",
                }}
              >
                {toast.message}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
