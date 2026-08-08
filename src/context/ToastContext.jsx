import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 lg:bottom-6"
            aria-live="polite"
            role="status"
          >
            {toasts.map((toast) => {
              const Icon = icons[toast.type] || Info;
              return (
                <div
                  key={toast.id}
                  className="pointer-events-auto flex w-full items-center gap-3 rounded-xl bg-ink px-4 py-3 text-white shadow-pop transition-all duration-200"
                  style={{
                    animation: "toast-in 0.22s ease-out both",
                  }}
                >
                  <Icon className="size-5 shrink-0 text-success-500" aria-hidden="true" />
                  <p className="flex-1 text-sm font-medium">{toast.message}</p>
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    aria-label="بستن اعلان"
                    className="flex cursor-pointer items-center rounded-md p-1 text-white/60 transition-colors hover:text-white"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast باید داخل ToastProvider استفاده شود");
  return ctx;
}
