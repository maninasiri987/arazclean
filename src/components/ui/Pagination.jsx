import { ChevronLeft, ChevronRight } from "lucide-react";
import { toFaDigits } from "../../utils/format.js";

/**
 * صفحه‌بندی — بدون وابستگی به روتر؛ از طریق onPageChange کار می‌کند.
 */
export default function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;

  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const pageBtn =
    "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold transition-all duration-200 focus-visible:ring-4 focus-visible:ring-brand-500/20";

  return (
    <nav aria-label="صفحه‌بندی" className="mt-10 flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, current - 1))}
            disabled={current === 1}
            aria-label="صفحهٔ قبلی"
            className={`${pageBtn} text-muted hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40`}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </li>
        {pages.map((page, i) =>
          page === "..." ? (
            <li key={`e${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={page === current ? "page" : undefined}
                className={`${pageBtn} ${
                  page === current
                    ? "bg-brand-500 text-white shadow-card"
                    : "text-muted hover:bg-brand-50 hover:text-brand-600"
                }`}
              >
                {toFaDigits(page)}
              </button>
            </li>
          )
        )}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(total, current + 1))}
            disabled={current === total}
            aria-label="صفحهٔ بعدی"
            className={`${pageBtn} text-muted hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40`}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
