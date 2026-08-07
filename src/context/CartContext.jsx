import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "arazclean-cart";

/**
 * جداسازی state از actions — تا کامپوننت‌هایی که فقط افزودن به سبد دارند
 * (مثل ProductCard) هنگام تغییر سبد دوباره رندر نشوند.
 */
const CartStateContext = createContext(null);
const CartActionsContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ذخیره در localStorage (فقط UI)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // بی‌صدا — استوریج در دسترس نیست
    }
  }, [items]);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
            : i
        );
      }
      return [
        ...prev,
        { id: product.id, qty: Math.min(qty, product.stock), price: product.price },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== productId));
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const state = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    // برای سازگاری با سبدهای ذخیره‌شدهٔ قدیمی (بدون price) از مقدار پیش‌فرض استفاده می‌شود
    const subtotal = items.reduce(
      (sum, i) => sum + i.qty * (Number(i.price) || 0),
      0
    );
    return { items, count, subtotal };
  }, [items]);

  return (
    <CartStateContext.Provider value={state}>
      <CartActionsContext.Provider
        value={{ addToCart, removeFromCart, updateQty, clearCart }}
      >
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCartState() {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error("useCartState باید داخل CartProvider استفاده شود");
  return ctx;
}

export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error("useCartActions باید داخل CartProvider استفاده شود");
  return ctx;
}
