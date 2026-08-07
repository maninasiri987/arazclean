import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll.js";

/**
 * مودال دسترس‌پذیر — فوکوس تراپ + بستن با Escape + قفل اسکرول
 */
export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  const closeBtnRef = useRef(null);
  const dialogRef = useRef(null);

  useLockBodyScroll(open);

  // فوکوس اولیه + فوکوس تراپ (محدود به داخل مودال)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => closeBtnRef.current?.focus(), 50);
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter(
          (el) => el.offsetParent !== null && !el.hasAttribute("disabled")
        );
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidth} rounded-t-card bg-card p-6 shadow-pop sm:rounded-card`}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-black text-ink">{title}</h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
