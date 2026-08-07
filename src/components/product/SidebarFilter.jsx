import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { getCategories, getBrands, getProducts } from "../../services/catalog.js";
import { formatNumber, toFaDigits } from "../../utils/format.js";

const PRICE_PRESETS = [
  { label: "تا ۱۰۰ هزار", min: 0, max: 100000 },
  { label: "۱۰۰ تا ۲۰۰ هزار", min: 100000, max: 200000 },
  { label: "۲۰۰ تا ۴۰۰ هزار", min: 200000, max: 400000 },
  { label: "بالای ۴۰۰ هزار", min: 400000, max: Infinity },
];

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <h3 className="mb-3 text-sm font-black text-ink">{title}</h3>
      {children}
    </div>
  );
}

function countFor(categorySlug) {
  return getProducts().filter((p) => p.categorySlug === categorySlug).length;
}

function countForBrand(brandSlug) {
  return getProducts().filter((p) => p.brandSlug === brandSlug).length;
}

/**
 * فیلتر کناری — دسته‌ها، برندها، بازهٔ قیمت، موجودی.
 * `useProducts` را از طریق props دریافت می‌کند.
 */
export default function SidebarFilter({ hook, hideCategory = false }) {
  const { params, setParam, clearAll, hasActiveFilters } = hook;
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  const categories = getCategories();
  const brands = getBrands();

  const applyCustomPrice = () => {
    setParam("priceMin", customMin ? Number(customMin) : "");
    setParam("priceMax", customMax ? Number(customMax) : "");
    setCustomMin("");
    setCustomMax("");
  };

  return (
    <aside aria-label="فیلتر محصولات" className="rounded-card border border-line bg-card p-5 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-black text-ink">
          <SlidersHorizontal className="size-4 text-brand-500" aria-hidden="true" />
          فیلترها
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex cursor-pointer items-center gap-1 text-xs font-bold text-brand-600 transition-colors hover:text-brand-700"
          >
            <X className="size-3.5" aria-hidden="true" />
            حذف همه
          </button>
        )}
      </div>

      {/* دسته‌بندی‌ها */}
      {!hideCategory && (
      <FilterSection title="دسته‌بندی">
        <ul className="space-y-1">
          {categories.map((cat) => {
            const active = params.category === cat.slug;
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setParam("category", active ? "" : cat.slug)}
                  aria-pressed={active}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                    active
                      ? "bg-brand-50 font-bold text-brand-600"
                      : "text-muted hover:bg-background hover:text-ink"
                  }`}
                >
                  {cat.title}
                  <span className="text-xs text-muted/70">{formatNumber(countFor(cat.slug))}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>
      )}

      {/* برندها */}
      <FilterSection title="برند">
        <ul className="space-y-1">
          {brands.map((brand) => {
            const active = params.brand === brand.slug;
            return (
              <li key={brand.slug}>
                <button
                  type="button"
                  onClick={() => setParam("brand", active ? "" : brand.slug)}
                  aria-pressed={active}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                    active
                      ? "bg-brand-50 font-bold text-brand-600"
                      : "text-muted hover:bg-background hover:text-ink"
                  }`}
                >
                  {brand.name}
                  <span className="text-xs text-muted/70">{formatNumber(countForBrand(brand.slug))}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {/* بازهٔ قیمت */}
      <FilterSection title="بازهٔ قیمت">
        <div className="mb-3 flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              params.priceMin === preset.min &&
              ((preset.max === Infinity && params.priceMax === Infinity) ||
                params.priceMax === preset.max);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  active
                    ? (setParam("priceMin", ""), setParam("priceMax", ""))
                    : (setParam("priceMin", preset.min || ""), setParam("priceMax", preset.max === Infinity ? "" : preset.max))
                }
                aria-pressed={active}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-line text-muted hover:border-brand-500 hover:text-brand-600"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            placeholder="از (تومان)"
            aria-label="حداقل قیمت"
            className="w-full min-w-0 rounded-lg border border-line bg-background px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
          <span className="text-muted/50" aria-hidden="true">—</span>
          <input
            type="number"
            inputMode="numeric"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            placeholder="تا (تومان)"
            aria-label="حداکثر قیمت"
            className="w-full min-w-0 rounded-lg border border-line bg-background px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
          <button
            type="button"
            onClick={applyCustomPrice}
            className="shrink-0 cursor-pointer rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-600"
          >
            اعمال
          </button>
        </div>
        {(params.priceMin > 0 || params.priceMax !== Infinity) && (
          <p className="mt-2 text-[11px] text-muted">
            {params.priceMin > 0 && `از ${toFaDigits(params.priceMin.toLocaleString("en-US"))} `}
            {params.priceMax !== Infinity && `تا ${toFaDigits(params.priceMax.toLocaleString("en-US"))} `}
            تومان
          </p>
        )}
      </FilterSection>

      {/* موجودی */}
      <FilterSection title="وضعیت موجودی">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={params.inStock}
            onChange={(e) => setParam("inStock", e.target.checked ? "1" : "")}
            className="size-4 accent-brand-500"
          />
          فقط کالاهای موجود
        </label>
      </FilterSection>
    </aside>
  );
}
