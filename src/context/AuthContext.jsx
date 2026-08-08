import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "arazclean-auth";

/**
 * احراز هویت نمایشی — کاربر در localStorage ذخیره می‌شود تا با رفرش صفحه هم
 * وضعیت ورود باقی بماند. در آینده با اتصال به API واقعی جایگزین می‌شود.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // همگام‌سازی با localStorage
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* در حالت خصوصی ممکن است localStorage در دسترس نباشد */
    }
  }, [user]);

  const login = useCallback((data) => {
    // نام کاربر: از دادهٔ ورود/ثبت‌نام
    const name =
      data.name ||
      (data.identifier ? data.identifier.split("@")[0] : "") ||
      "کاربر";
    setUser({ name, identifier: data.identifier || data.mobile || "" });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  return ctx;
}
