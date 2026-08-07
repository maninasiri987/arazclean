import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

/**
 * مسیر صفحه — آرایهٔ آیتم‌ها: [{ label, to? }]
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="مسیر صفحه" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 transition-colors hover:text-brand-600"
          >
            <Home className="size-4" aria-hidden="true" />
            خانه
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronLeft className="size-4 text-muted/50" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link to={item.to} className="transition-colors hover:text-brand-600">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="font-bold text-ink">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
