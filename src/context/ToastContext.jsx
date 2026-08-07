import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  info: Info,
};

/**
 * نمایش توست — showToast(message, type='success')
 */
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
            className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4"
            aria-live="polite"
            role="status"
          >
            <AnimatePresence>
              {toasts.map((toast) => {
                const Icon = icons[toast.type] || Info;
                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-auto flex w-full items-center gap-3 rounded-xl bg-ink px-4 py-3 text-white shadow-pop"
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast باید داخل ToastProvider استفاده شود");
  return ctx;
}
