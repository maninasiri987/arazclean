import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AdminThemeContext = createContext(null);

const THEME_KEY = "arazclean-admin-theme";

/**
 * پوستهٔ پنل مدیریت (روشن/تاریک).
 *
 * این کانتکست فقط مقدار پوسته را نگه می‌دارد؛ اعمال کلاس `dark` روی <html>
 * در App.jsx انجام می‌شود و فقط در مسیرهای /admin فعال است تا فروشگاه
 * (بخش فروش) همیشه روشن بماند.
 */
export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  });

  // همگام‌سازی با localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* بی‌صدا — استوریج در دسترس نیست */
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx)
    throw new Error("useAdminTheme باید داخل AdminThemeProvider استفاده شود");
  return ctx;
}
