import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Search as SearchIcon, X } from "lucide-react";
import useRecentSearches from "../../hooks/useRecentSearches.js";

/**
 * جستجوی سایت — ساده:
 *
 * **موبایل** (`logo` پاس داده شود): یک فیلد ساده و واقعی که با کلیک باز
 *   نمی‌شود و مستقیماً می‌توان در آن تایپ کرد؛ لوگو داخل فیلد قرار دارد.
 * **دسکتاپ** (بدون `logo`): فیلد جستجوی inline + کشوی جستجوهای اخیر که
 *   فقط هنگام فوکوس باز می‌شود و با Escape یا کلیک بیرون بسته می‌شود.
 */
export default function Search({ className = "", logo }) {
  const [query, setQuery] = useState("");
  const [desktopOpen, setDesktopOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const blurTimerRef = useRef(null);
  const navigate = useNavigate();

  const { recent, add: addRecent, remove: removeRecent, clear: clearRecent } =
    useRecentSearches();

  const runSearch = (q) => {
    const trimmed = (q || "").trim();
    if (!trimmed) return;
    addRecent(trimmed);
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  // ── بستن کشوی دسکتاپ ──
  const closeDesktop = () => setDesktopOpen(false);

  // Escape: بستن کشوی دسکتاپ
  useEffect(() => {
    if (!desktopOpen) return;
    const onKey = (e) => e.key === "Escape" && closeDesktop();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopOpen]);

  // بستن کشوی دسکتاپ با کلیک بیرون
  useEffect(() => {
    if (!desktopOpen) return;
    const onPointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDesktop();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopOpen]);

  // پاک‌سازی تایمر blur هنگام unmount
  useEffect(() => () => clearTimeout(blurTimerRef.current), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
    closeDesktop();
    inputRef.current?.blur();
  };

  const handleFocus = () => setDesktopOpen(true);

  const handleBlur = () => {
    // اگر فوکوس به داخل کشو (دکمه‌های حذف و…) نرفته باشد، کشو بسته می‌شود
    clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement)
      ) {
        closeDesktop();
      }
    }, 120);
  };

  const pickRecent = (item) => {
    setQuery(item);
    runSearch(item);
    closeDesktop();
  };

  // ─── کشوی دسکتاپ ─────────────────────────────────────
  const renderDesktopDropdown = () => {
    // فقط هنگام فوکوس و در صورت وجود جستجوی اخیر
    if (!desktopOpen || !recent.length) return null;
    return (
      <motion.div
        key="desktop-search-dropdown"
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top center" }}
        className="absolute inset-x-0 top-full z-[70] mt-2 overflow-hidden rounded-2xl border border-line bg-card shadow-pop"
      >
        <div className="p-2">
          <div className="mb-1 flex items-center justify-between px-3 pt-1">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-muted">
              <Clock className="size-3.5" aria-hidden="true" />
              جستجوهای اخیر
            </h3>
            <button
              type="button"
              onClick={clearRecent}
              className="cursor-pointer text-[11px] font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              پاک کردن
            </button>
          </div>
          <ul className="space-y-0.5">
            {recent.map((item) => (
              <li key={item} className="flex items-center">
                <button
                  type="button"
                  onClick={() => pickRecent(item)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-right transition-colors hover:bg-brand-50"
                >
                  <Clock className="size-3.5 shrink-0 text-muted/50" aria-hidden="true" />
                  <span className="truncate text-sm text-ink">{item}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecent(item);
                  }}
                  aria-label={`حذف «${item}»`}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted/40 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  };

  // ─── رندر اصلی ─────────────────────────────────────────
  return (
    <>
      {logo ? (
        /* ── موبایل: فیلد ساده و واقعی — بدون صفحهٔ تمام‌صفحه و بدون انیمیشن ── */
        <form
          role="search"
          onSubmit={handleSubmit}
          className={`relative ${className}`}
        >
          <div className="flex h-11 items-center gap-1.5 rounded-full border border-line bg-background ps-3 pe-1.5 transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-brand-500 focus-within:bg-card focus-within:shadow-soft">
            {/* آیکون جستجو — سمت راست (شروع در RTL) */}
            <SearchIcon
              aria-hidden="true"
              className="size-4.5 shrink-0 text-muted/60"
            />
            <div className="relative min-w-0 flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="جستجو در محصولات"
                className="w-full bg-transparent py-2 text-sm text-ink focus:outline-none"
              />
              {/* placeholder سفارشی: «جستجو در» + لوگو در سمت چپِ متن — فقط وقتی خالی است */}
              {!query.trim() && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 start-0 flex items-center gap-1.5 text-sm text-muted/50"
                >
                  جستجو در
                  {logo}
                </span>
              )}
            </div>
          </div>
        </form>
      ) : (
        /* ── دسکتاپ: فیلد جستجو + کشوی جستجوهای اخیر ── */
        <div ref={containerRef} className={`relative ${className}`}>
          <form role="search" onSubmit={handleSubmit}>
            <SearchIcon
              aria-hidden="true"
              className={`pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 transition-colors duration-200 ${
                query.trim() ? "text-brand-500" : "text-muted/70"
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label="جستجو در محصولات"
              className={`w-full rounded-full border py-2.5 ps-10 text-sm text-ink transition-[color,background-color,border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 ${
                query.trim() ? "pe-16" : "pe-3"
              } ${
                query.trim()
                  ? "border-brand-500 bg-card shadow-soft"
                  : "border-line bg-background"
              }`}
            />
            {!query.trim() && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-10 flex items-center text-sm text-muted/50"
              >
                جستجو در آراز کلین…
              </span>
            )}
            {query.trim() && (
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-brand-600"
              >
                جستجو
              </button>
            )}
          </form>

          {/* کشوی جستجوهای اخیر — فقط دسکتاپ */}
          <div className="hidden lg:block">
            <AnimatePresence>{renderDesktopDropdown()}</AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
