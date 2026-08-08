import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/catalog.js";

const SORTS = {
  newest: (a, b) => b.id - a.id,
  popular: (a, b) => b.rating - a.rating || b.stock - a.stock,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

/**
 * موتور فهرست محصولات — همگام با پارامترهای URL:
 * q, category, subcategory, brand, inStock, priceMin, priceMax, sort, page
 *
 * `forceCategory` / `forceSubcategory` / `forceBrand` دسته/زیردسته/برند را
 * از مسیر (مثلاً صفحهٔ دسته‌بندی یا برند) قفل می‌کنند.
 */
export default function useProducts({
  perPage = 12,
  forceCategory,
  forceSubcategory,
  forceBrand,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      // وقتی صفحهٔ دسته‌بندی است، دسته از مسیر گرفته می‌شود و قابل تغییر نیست
      category: forceCategory || searchParams.get("category") || "",
      subcategory: forceSubcategory || searchParams.get("subcategory") || "",
      brand: forceBrand || searchParams.get("brand") || "",
      inStock: searchParams.get("inStock") === "1",
      priceMin: Number(searchParams.get("priceMin") || 0),
      priceMax: Number(searchParams.get("priceMax") || Infinity),
      sort: searchParams.get("sort") || "newest",
    }),
    [searchParams, forceCategory, forceSubcategory, forceBrand]
  );

  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const filtered = useMemo(() => {
    const { q, category, subcategory, brand, inStock, priceMin, priceMax, sort } =
      params;

    let list = getProducts();

    if (category) list = list.filter((p) => p.categorySlug === category);
    if (subcategory)
      list = list.filter((p) => p.subcategorySlug === subcategory);
    if (brand) list = list.filter((p) => p.brandSlug === brand);
    if (inStock) list = list.filter((p) => p.stock > 0);

    if (q) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle) ||
          p.subcategory.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle)
      );
    }

    list = list.filter(
      (p) => p.price >= priceMin && (priceMax === Infinity || p.price <= priceMax)
    );

    return [...list].sort(SORTS[sort] || SORTS.newest);
  }, [params]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const products = useMemo(
    () => filtered.slice((safePage - 1) * perPage, safePage * perPage),
    [filtered, safePage, perPage]
  );

  /**
   * تنظیم چند پارامتر به‌صورت یکجا (اتمی) — از ناسازگاری بین چند
   * `setSearchParams` پشت‌سرهم که همه از state قدیمی می‌خوانند جلوگیری می‌کند.
   */
  const setParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    let changed = false;
    Object.entries(patch).forEach(([key, value]) => {
      if (forceCategory && key === "category") return; // دسته در صفحهٔ دسته‌بندی قفل است
      if (forceSubcategory && key === "subcategory") return; // زیردسته در صفحهٔ زیردسته قفل است
      if (forceBrand && key === "brand") return; // برند در صفحهٔ برند قفل است
      if (value === "" || value === null || value === undefined) {
        if (next.has(key)) {
          next.delete(key);
          changed = true;
        }
      } else {
        next.set(key, String(value));
        changed = true;
      }
    });
    if (changed && !("page" in patch)) next.delete("page");
    if (changed) setSearchParams(next, { replace: false });
  };

  /** تنظیم یک پارامتر فیلتر (تغییر فیلتر → بازگشت به صفحهٔ ۱) */
  const setParam = (key, value) => setParams({ [key]: value });

  const clearAll = () => setSearchParams(new URLSearchParams());

  const hasActiveFilters =
    Boolean(params.q || params.category || params.subcategory || params.brand || params.inStock) ||
    params.priceMin > 0 ||
    params.priceMax !== Infinity;

  return {
    products,
    total,
    page: safePage,
    totalPages,
    params,
    setParam,
    setParams,
    clearAll,
    hasActiveFilters,
    searchParams,
  };
}
