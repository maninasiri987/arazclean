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
 * q, category, brand, inStock, priceMin, priceMax, sort, page
 */
export default function useProducts({ perPage = 12, forceCategory } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      // وقتی صفحهٔ دسته‌بندی است، دسته از مسیر گرفته می‌شود و قابل تغییر نیست
      category: forceCategory || searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      inStock: searchParams.get("inStock") === "1",
      priceMin: Number(searchParams.get("priceMin") || 0),
      priceMax: Number(searchParams.get("priceMax") || Infinity),
      sort: searchParams.get("sort") || "newest",
    }),
    [searchParams, forceCategory]
  );

  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const filtered = useMemo(() => {
    const { q, category, brand, inStock, priceMin, priceMax, sort } = params;

    let list = getProducts();

    if (category) list = list.filter((p) => p.categorySlug === category);
    if (brand) list = list.filter((p) => p.brandSlug === brand);
    if (inStock) list = list.filter((p) => p.stock > 0);

    if (q) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle) ||
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

  /** تنظیم یک پارامتر فیلتر (تغییر فیلتر → بازگشت به صفحهٔ ۱) */
  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (forceCategory && key === "category") return; // دسته در صفحهٔ دسته‌بندی قفل است
    if (value === "" || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: false });
  };

  const clearAll = () => setSearchParams(new URLSearchParams());

  const hasActiveFilters =
    Boolean(params.q || params.category || params.brand || params.inStock) ||
    params.priceMin > 0 ||
    params.priceMax !== Infinity;

  return {
    products,
    total,
    page: safePage,
    totalPages,
    params,
    setParam,
    clearAll,
    hasActiveFilters,
    searchParams,
  };
}
