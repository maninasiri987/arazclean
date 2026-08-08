import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getProducts,
  getBrands,
  getHeroSlides,
  setCatalogData,
} from "../services/catalog.js";

const STORAGE_KEY = "arazclean-admin-store-v1";

/**
 * مخزن دادهٔ پنل مدیریت — منبع واحد محصولات/برندها/اسلایدرها.
 * هر تغییری هم در localStorage ذخیره می‌شود و هم به لایهٔ داده
 * (`setCatalogData`) منتقل می‌شود تا فروشگاه همان لحظه به‌روز شود.
 */
const StoreContext = createContext(null);

// دادهٔ نمایشیِ فروش (آفلااین؛ در نسخهٔ نهایی از ووکامرس می‌آید)
const genSales = (n = 14) =>
  Array.from({ length: n }, (_, i) => ({
    day: `${i + 1}`,
    label: `روز قبل ${n - i}`, // برچسب نمایشی
    value: 8 + ((i * 37) % 22) + ((i * 13) % 9), // میلیون
  }));

const genOrders = (products) => {
  const statuses = ["completed", "processing", "pending", "cancelled"];
  const items = products.slice(0, 6);
  return items.map((p, i) => ({
    id: 1042 - i,
    product: p.title,
    status: statuses[i % statuses.length],
    total: p.price * (2 + (i % 3)),
    date: `${1404}-0${(i % 9) + 1}-${10 + i}`,
  }));
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.products) return saved.products;
      }
    } catch {
      /* ignore */
    }
    return getProducts();
  });

  const [brands, setBrands] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.brands) return saved.brands;
      }
    } catch {
      /* ignore */
    }
    return getBrands();
  });

  const [slides, setSlides] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.slides) return saved.slides;
      }
    } catch {
      /* ignore */
    }
    return getHeroSlides();
  });

  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.orders) return saved.orders;
      }
    } catch {
      /* ignore */
    }
    return genOrders(getProducts());
  });

  // همگام‌سازی با localStorage + لایهٔ داده
  useEffect(() => {
    const payload = { products, brands, slides, orders };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    setCatalogData({ products, brands, hero: slides });
  }, [products, brands, slides, orders]);

  // ---------- محصولات ----------
  const addProduct = useCallback((product) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1 },
    ]);
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, ...patch } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  }, []);

  // ---------- برندها ----------
  const addBrand = useCallback((brand) => {
    setBrands((prev) => [...prev, brand]);
  }, []);

  const updateBrand = useCallback((slug, patch) => {
    setBrands((prev) =>
      prev.map((b) => (b.slug === slug ? { ...b, ...patch } : b))
    );
  }, []);

  const deleteBrand = useCallback((slug) => {
    setBrands((prev) => prev.filter((b) => b.slug !== slug));
  }, []);

  // ---------- اسلایدرها ----------
  const addSlide = useCallback((slide) => {
    setSlides((prev) => [
      ...prev,
      { ...slide, id: prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1 },
    ]);
  }, []);

  const updateSlide = useCallback((id, patch) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === Number(id) ? { ...s, ...patch } : s))
    );
  }, []);

  const deleteSlide = useCallback((id) => {
    setSlides((prev) => prev.filter((s) => s.id !== Number(id)));
  }, []);

  // ---------- فروش (نمایشی) ----------
  const sales = useMemo(() => genSales(), []);
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status === "cancelled" ? 0 : o.total), 0),
    [orders]
  );

  const resetDemoData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    window.location.reload();
  }, []);

  // ---------- موجودی کم ----------
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock < 10),
    [products]
  );
  const outOfStockProducts = useMemo(
    () => products.filter((p) => p.stock <= 0),
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      brands,
      slides,
      orders,
      sales,
      totalRevenue,
      lowStockProducts,
      outOfStockProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addBrand,
      updateBrand,
      deleteBrand,
      addSlide,
      updateSlide,
      deleteSlide,
      resetDemoData,
    }),
    [
      products,
      brands,
      slides,
      orders,
      sales,
      totalRevenue,
      lowStockProducts,
      outOfStockProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addBrand,
      updateBrand,
      deleteBrand,
      addSlide,
      updateSlide,
      deleteSlide,
      resetDemoData,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore باید داخل StoreProvider استفاده شود");
  return ctx;
}