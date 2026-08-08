import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, LayoutGrid, Package } from "lucide-react";
import {
  getNavigation,
  getCategories,
  getProducts,
  getProductsByCategory,
  getProductsBySubcategory,
} from "../../services/catalog.js";
import { prefetchPage } from "../../utils/prefetch.js";
import { formatNumber } from "../../utils/format.js";

function isActive(match, pathname) {
  if (match === "categories") return pathname.startsWith("/category");
  if (match === "/") return pathname === "/";
  return pathname.startsWith(match);
}

/** آیکون‌های دسته‌ها در منوی کشویی — مطابق ساختار رسمی مشتری */
const catEmoji = {
  laundry: "🧴",
  dishwashing: "🍽️",
  "home-cleaning": "🏠",
  "personal-care": "🧴",
  "baby-care": "👶",
  tissue: "🧻",
  "cleaning-tools": "🧹",
  disinfectants: "🦠",
  special: "⭐",
};

/**
 * نوار ناوبری اصلی (دسکتاپ).
 * آیتم «دسته‌بندی‌ها» یک منوی تمام‌عرض دوپنجره‌ای دارد:
 * لیست دسته‌ها در یک ستون و زیردسته‌های دستهٔ هاورشده در ستون دیگر.
 */
export default function Navbar({ onNavigate }) {
  const { mainNav } = getNavigation();
  const categories = getCategories();
  const { pathname } = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCatSlug, setActiveCatSlug] = useState(categories[0]?.slug || "");
  const closeTimerRef = useRef(null);
  const menuRef = useRef(null);

  // بستن منو هنگام تغییر مسیر + انتخاب دستهٔ بازشده از مسیر فعلی
  useEffect(() => {
    setMenuOpen(false);
    const m = pathname.match(/^\/category\/([^/]+)/);
    if (m && categories.some((c) => c.slug === m[1])) {
      setActiveCatSlug(m[1]);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // بستن با Escape یا کلیک بیرون از منو
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  const openMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    closeTimerRef.current = setTimeout(() => setMenuOpen(false), 150);
  };

  const activeCat =
    categories.find((c) => c.slug === activeCatSlug) || categories[0];
  const totalProducts = getProducts().length;

  return (
    <nav aria-label="ناوبری اصلی">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const active = isActive(item.match, pathname);

          // آیتم «دسته‌بندی‌ها» — با منوی کشویی دوپنجره‌ای
          if (item.match === "categories") {
            return (
              <li
                key={item.label}
                ref={menuRef}
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
              >
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  onMouseEnter={() => prefetchPage("/products")}
                  onFocus={() => prefetchPage("/products")}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={menuOpen}
                  className={`relative flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-200 ${
                    active
                      ? "text-brand-600"
                      : "text-muted hover:text-brand-600"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-3.5 transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500 transition-opacity duration-200 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>

                {/* منوی کشویی تمام‌عرض — از هدر بیرون می‌زند (fixed) */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed inset-x-0 top-[var(--header-offset,122px)] z-[60] border-b border-line bg-card shadow-pop"
                    >
                      <div className="max-w-site mx-auto px-4 py-6 sm:px-6 lg:px-10">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[290px_1fr]">
                          {/* ---------- ستون ۱: لیست دسته‌ها ---------- */}
                          <div>
                            <p className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
                              <LayoutGrid
                                className="size-4 text-brand-500"
                                aria-hidden="true"
                              />
                              دسته‌بندی‌های محصولات
                            </p>
                            <ul className="space-y-1">
                              {categories.map((cat) => {
                                const isActiveCat = cat.slug === activeCat?.slug;
                                const count = getProductsByCategory(cat.slug).length;
                                return (
                                  <li key={cat.slug}>
                                    <Link
                                      to={`/category/${cat.slug}`}
                                      onClick={onNavigate}
                                      onMouseEnter={() => {
                                        setActiveCatSlug(cat.slug);
                                        prefetchPage("/category");
                                      }}
                                      onFocus={() => setActiveCatSlug(cat.slug)}
                                      className={`group relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors duration-150 ${
                                        isActiveCat
                                          ? "bg-brand-50 text-brand-600"
                                          : "text-muted hover:bg-background hover:text-ink"
                                      }`}
                                    >
                                      <span className="flex min-w-0 items-center gap-2.5">
                                        <span className="text-base leading-none" aria-hidden="true">
                                          {catEmoji[cat.slug] || "🧴"}
                                        </span>
                                        <span className="truncate">{cat.title}</span>
                                      </span>
                                      <span className="flex shrink-0 items-center gap-1.5">
                                        {count > 0 && (
                                          <span className="text-[11px] font-medium text-muted/70">
                                            {formatNumber(count)}
                                          </span>
                                        )}
                                        <ChevronLeft
                                          aria-hidden="true"
                                          className={`size-3.5 transition-all duration-200 ${
                                            isActiveCat
                                              ? "-translate-x-0.5 text-brand-500"
                                              : "opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                          }`}
                                        />
                                      </span>
                                      {isActiveCat && (
                                        <span
                                          aria-hidden="true"
                                          className="absolute start-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-brand-500"
                                        />
                                      )}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {/* ---------- ستون ۲: پنل دستهٔ فعال ---------- */}
                          <div className="border-s border-line ps-8">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.div
                                key={activeCat?.slug}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <header className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <span
                                      aria-hidden="true"
                                      className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-xl"
                                    >
                                      {catEmoji[activeCat?.slug] || "🧴"}
                                    </span>
                                    <div>
                                      <h3 className="text-lg font-black text-ink">
                                        {activeCat?.title}
                                      </h3>
                                      <p className="mt-0.5 max-w-md text-xs leading-5 text-muted">
                                        {activeCat?.description}
                                      </p>
                                    </div>
                                  </div>
                                  <Link
                                    to={`/category/${activeCat?.slug}`}
                                    onClick={onNavigate}
                                    onMouseEnter={() => prefetchPage("/category")}
                                    onFocus={() => prefetchPage("/category")}
                                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-brand-500/40 bg-brand-50/50 px-3 py-2 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50"
                                  >
                                    مشاهده همه
                                    <ChevronLeft className="size-3.5" aria-hidden="true" />
                                  </Link>
                                </header>

                                <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
                                  {activeCat?.subcategories?.map((sub) => {
                                    const subCount = getProductsBySubcategory(
                                      activeCat.slug,
                                      sub.slug
                                    ).length;
                                    return (
                                      <Link
                                        key={sub.slug}
                                        to={`/category/${activeCat.slug}/${sub.slug}`}
                                        onClick={onNavigate}
                                        onMouseEnter={() => prefetchPage("/category")}
                                        onFocus={() => prefetchPage("/category")}
                                        className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-background/50 px-4 py-3 transition-[border-color,background-color,transform] duration-150 hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-50/40"
                                      >
                                        <span className="min-w-0 truncate text-sm font-bold text-ink transition-colors group-hover:text-brand-600">
                                          {sub.title}
                                        </span>
                                        <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-muted/70">
                                          {subCount > 0 && formatNumber(subCount)}
                                          <ChevronLeft
                                            aria-hidden="true"
                                            className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                                          />
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* ---------- نوار پایین ---------- */}
                      <div className="border-t border-line bg-background/60">
                        <div className="max-w-site mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                            <Package className="size-3.5 text-brand-500" aria-hidden="true" />
                            {formatNumber(totalProducts)} محصول در فروشگاه آراز کلین
                          </p>
                          <div className="flex items-center gap-4">
                            <Link
                              to="/products"
                              onClick={onNavigate}
                              onMouseEnter={() => prefetchPage("/products")}
                              onFocus={() => prefetchPage("/products")}
                              className="flex cursor-pointer items-center gap-1 text-xs font-bold text-brand-600 transition-colors hover:text-brand-700"
                            >
                              همهٔ محصولات
                              <ChevronLeft className="size-3.5" aria-hidden="true" />
                            </Link>
                            <Link
                              to="/brands"
                              onClick={onNavigate}
                              onMouseEnter={() => prefetchPage("/brands")}
                              onFocus={() => prefetchPage("/brands")}
                              className="text-xs font-bold text-muted transition-colors hover:text-brand-600"
                            >
                              برندها
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          }

          return (
            <li key={item.label}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                onMouseEnter={() => prefetchPage(item.to)}
                onFocus={() => prefetchPage(item.to)}
                aria-current={active ? "page" : undefined}
                className={`relative block cursor-pointer rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-200 ${
                  active
                    ? "text-brand-600"
                    : "text-muted hover:text-brand-600"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500 transition-opacity duration-200 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
