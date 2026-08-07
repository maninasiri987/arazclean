import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Phone, X } from "lucide-react";
import { getNavigation, getSettings } from "../../services/catalog.js";
import useLockBodyScroll from "../../hooks/useLockBodyScroll.js";
import { prefetchPage } from "../../utils/prefetch.js";
import logo from "../../../assets/header.png";

function isActive(match, pathname) {
  if (match === "categories") return pathname.startsWith("/category");
  if (match === "/") return pathname === "/";
  return pathname.startsWith(match);
}

/**
 * منوی کشویی موبایل — از سمت راست (RTL) باز می‌شود.
 */
export default function MobileMenu({ open, onClose }) {
  const { mainNav } = getNavigation();
  const { siteName, phone } = getSettings();
  const { pathname } = useLocation();
  const closeBtnRef = useRef(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 80);
      const onKey = (e) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(t);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open, onClose]);

  // بستن منو هنگام تغییر مسیر
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-card shadow-pop"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <img src={logo} alt={siteName} className="h-10 w-auto object-contain" />
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="بستن منو"
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="ناوبری موبایل" className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {mainNav.map((item) => {
                  const active = isActive(item.match, pathname);
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onMouseEnter={() => prefetchPage(item.to)}
                        onFocus={() => prefetchPage(item.to)}
                        aria-current={active ? "page" : undefined}
                        className={`block cursor-pointer rounded-xl px-4 py-3 text-sm font-bold transition-colors duration-200 ${
                          active
                            ? "bg-brand-50 text-brand-600"
                            : "text-ink hover:bg-background"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-line p-4">
              <Link
                to="/contact"
                className="flex items-center gap-2 text-sm text-muted"
              >
                <Phone className="size-4 text-brand-500" aria-hidden="true" />
                {phone}
              </Link>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
              >
                <LogIn className="size-4" aria-hidden="true" />
                ورود / ثبت‌نام
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
