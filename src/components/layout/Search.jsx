import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, TrendingUp } from "lucide-react";
import { getNavigation } from "../../services/catalog.js";

/**
 * جستجوی سایت — با منوی کشویی جستجوهای پرطرفدار.
 * با Enter یا کلیک روی ترند، به /products?q=… هدایت می‌شود.
 * هنگام فوکوس، پس‌زمینهٔ صفحه کم‌رنگ می‌شود و با از دست رفتن فوکوس، منوی کشویی بسته می‌شود.
 */
export default function Search({ className = "" }) {
  const { popularSearches } = getNavigation();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const closeTimerRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // بستن منوی کشویی با کلیک بیرون از جستجو
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const openSearch = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setClosing(false);
    setOpen(true);
    if (window.location.hash !== "#search") {
      history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#search`
      );
    }
  };

  const closeSearch = () => {
    if (!open || closing) return;
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
      closeTimerRef.current = null;
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }, 180);
  };

  const submitSearch = (value) => {
    const q = (value ?? query).trim();
    setOpen(false);
    setClosing(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
    }
  };

  const filteredTrending = popularSearches.filter((item) =>
    item.includes(query.trim())
  );

  return (
    <>
      {/* کم‌رنگ‌شدن پس‌زمینه هنگام فوکوس — پورتال به body تا زیر هدر باشد */}
      {(open || closing) &&
        createPortal(
          <div
            className={`fixed inset-0 z-40 bg-ink/75 backdrop-blur-[2px] ${
              closing ? "fade-out" : "fade-in"
            }`}
            onClick={closeSearch}
            aria-hidden="true"
          />,
          document.body
        )}

      <div ref={containerRef} role="search" className={`relative ${className}`}>
        <div className="relative flex items-center">
          <SearchIcon
            aria-hidden="true"
            className={`pointer-events-none absolute right-3 size-4.5 transition-colors duration-200 ${
              open ? "text-brand-500" : "text-muted/70"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={openSearch}
            onBlur={closeSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
              if (e.key === "Escape") closeSearch();
            }}
            placeholder="جستجو در محصولات…"
            aria-label="جستجو در محصولات"
            aria-expanded={open}
            className={`w-full rounded-full border py-2.5 ps-10 text-sm text-ink transition-[color,background-color,border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 ${
              query.trim() ? "pe-16" : "pe-3"
            } ${
              open
                ? "border-brand-500 bg-card shadow-soft"
                : "border-line bg-background"
            }`}
          />
          {query.trim() && (
            <button
              type="button"
              onClick={() => submitSearch()}
              className="absolute left-2 cursor-pointer rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-brand-600"
            >
              جستجو
            </button>
          )}
        </div>

        {/* منوی کشویی ترندها */}
        {open && (
          <div
            className={`absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-line bg-card p-4 shadow-pop ${
              closing ? "search-dropdown-out pointer-events-none" : "search-dropdown-in"
            }`}
          >
            <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-muted">
              <TrendingUp className="size-4 text-brand-500" aria-hidden="true" />
              جستجوهای پرطرفدار
            </p>
            {filteredTrending.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {filteredTrending.map((item, i) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => submitSearch(item)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="search-chip cursor-pointer rounded-full border border-line bg-background px-3 py-1.5 text-xs text-ink transition-colors duration-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">نتیجه‌ای یافت نشد</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
