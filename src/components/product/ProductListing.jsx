import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import useProducts from "../../hooks/useProducts.js";
import SidebarFilter from "./SidebarFilter.jsx";
import ProductGrid from "./ProductGrid.jsx";
import Pagination from "../ui/Pagination.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import { formatNumber } from "../../utils/format.js";

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

/**
 * چیدمان کامل فهرست محصولات — برای صفحهٔ محصولات و دسته‌بندی.
 */
export default function ProductListing({ forceCategory, perPage = 12 }) {
  const hook = useProducts({ perPage, forceCategory });
  const { products, total, page, totalPages, params, setParam } = hook;
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="max-w-site mx-auto grid grid-cols-1 gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      {/* فیلتر — دسکتاپ */}
      <div className="hidden lg:block">
        <div className="sticky top-36">
          <SidebarFilter hook={hook} hideCategory={Boolean(forceCategory)} />
        </div>
      </div>

      <div>
        {/* نوار ابزار */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-black text-ink">{formatNumber(total)}</span> محصول یافت شد
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand-500 hover:text-brand-600 lg:hidden"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              فیلترها
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="hidden sm:inline">مرتب‌سازی:</span>
              <select
                value={params.sort}
                onChange={(e) => setParam("sort", e.target.value)}
                aria-label="مرتب‌سازی محصولات"
                className="cursor-pointer rounded-xl border border-line bg-card px-3 py-2.5 text-sm font-bold text-ink transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* نتایج */}
        {total === 0 ? (
          <EmptyState
            title={params.q ? `نتیجه‌ای برای «${params.q}» یافت نشد` : "محصولی یافت نشد"}
            description="عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید."
            action={
              <Button variant="outline" onClick={hook.clearAll}>
                حذف فیلترها
              </Button>
            }
          />
        ) : (
          <ProductGrid products={products} />
        )}

        <Pagination
          current={page}
          total={totalPages}
          onPageChange={(p) => setParam("page", p === 1 ? "" : p)}
        />
      </div>

      {/* فیلتر — موبایل (مودال) */}
      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="فیلتر محصولات"
        maxWidth="max-w-sm"
      >
        <SidebarFilter hook={hook} hideCategory={Boolean(forceCategory)} />
      </Modal>
    </div>
  );
}
