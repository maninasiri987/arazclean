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
  getAllBrands,
  getHeroSlides,
  setCatalogData,
} from "../services/catalog.js";
import productsSeed from "../data/products.json";
import brandsSeed from "../data/brands.json";

/**
 * اثرانگشت سادهٔ دادهٔ نمونه — اگر محصولات/برندها در JSON تغییر کنند،
 * کلید کش عوض می‌شود و دادهٔ قدیمی localStorage دیگر روی دادهٔ جدید
 * نمی‌نشیند (دیگر نیازی به شماره‌گذاری دستی نسخه نیست).
 */
const fingerprint = (data) => {
  let h = 0;
  const str = JSON.stringify(data);
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
};

const STORAGE_KEY = `arazclean-admin-store-${fingerprint(productsSeed)}-${fingerprint(brandsSeed)}`;

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

// دادهٔ نمایشیِ کاربران (آفلااین؛ در نسخهٔ نهایی از ووکامرس/وردپرس می‌آید)
const genUsers = () =>
  [
    { name: "مریم احمدی", identifier: "09121112233", role: "مشتری", status: "active", orders: 12, lastActive: "چند دقیقه پیش" },
    { name: "علی رستمی", identifier: "ali.r@email.com", role: "مشتری", status: "active", orders: 7, lastActive: "۱ ساعت پیش" },
    { name: "سارا موسوی", identifier: "09123334455", role: "مشتری", status: "active", orders: 15, lastActive: "۳ ساعت پیش" },
    { name: "رضا کریمی", identifier: "reza.k@email.com", role: "مشتری", status: "inactive", orders: 3, lastActive: "۲ روز پیش" },
    { name: "نگار صادقی", identifier: "09125556677", role: "مشتری", status: "active", orders: 9, lastActive: "دیروز" },
    { name: "حسین محمدی", identifier: "hosein.m@email.com", role: "مشتری", status: "active", orders: 5, lastActive: "۴ روز پیش" },
    { name: "زهرا نوری", identifier: "09127778899", role: "مشتری", status: "inactive", orders: 1, lastActive: "۱ هفته پیش" },
    { name: "امیر قاسمی", identifier: "amir.g@email.com", role: "مشتری", status: "active", orders: 11, lastActive: "۲ ساعت پیش" },
  ].map((u, i) => ({ id: 1001 + i, ...u }));

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
    // همهٔ برندهای تعریف‌شده (برندهای.json) را پایه می‌گیریم — نه فقط برندهایی
    // که محصول دارند؛ تا پنل مدیریت همهٔ برندها را ببیند و ویرایش کند.
    const defined = getAllBrands();
    const map = new Map(defined.map((b) => [b.slug, b]));
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.brands) {
          // برندهای ذخیره‌شده (مثلاً ویرایش‌شده یا افزوده‌شده در ادمین) روی
          // برندهای تعریف‌شده می‌نشینند؛ برندهای تعریف‌شده‌ای که در localStorage
          // نیستند هم حفظ می‌شوند تا هیچ برندی از پنل ناپدید نشود.
          saved.brands.forEach((b) => map.set(b.slug, { ...(map.get(b.slug) || {}), ...b }));
        }
      }
    } catch {
      /* ignore */
    }
    return Array.from(map.values());
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

  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.users) return saved.users;
      }
    } catch {
      /* ignore */
    }
    return genUsers();
  });

  // همگام‌سازی با localStorage + لایهٔ داده
  useEffect(() => {
    const payload = { products, brands, slides, orders, users };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    setCatalogData({ products, brands, hero: slides });
  }, [products, brands, slides, orders, users]);

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

  // ---------- کاربران ----------
  /** ثبت کاربر جدید (یا به‌روزرسانی فعالیت کاربر موجود) هنگام ورود/ثبت‌نام */
  const addUser = useCallback(({ name = "", identifier = "", role = "مشتری" }) => {
    setUsers((prev) => {
      const id = (identifier || name || "").trim().toLowerCase();
      const existing = prev.find(
        (u) => (u.identifier || "").trim().toLowerCase() === id
      );
      if (existing) {
        return prev.map((u) =>
          u.id === existing.id ? { ...u, name: name || u.name, status: "active", lastActive: "همین الان" } : u
        );
      }
      return [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((u) => u.id)) + 1 : 1001,
          name: name || "کاربر",
          identifier,
          role,
          status: "active",
          orders: 0,
          lastActive: "همین الان",
        },
      ];
    });
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
      users,
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
      addUser,
      resetDemoData,
    }),
    [
      products,
      brands,
      slides,
      orders,
      users,
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
      addUser,
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