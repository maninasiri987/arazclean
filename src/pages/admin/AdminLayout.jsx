import { useContext } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  Box,
  ChevronRight,
  Image,
  LayoutDashboard,
  Moon,
  Package,
  Store,
  Sun,
  Tags,
} from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { useAdminTheme } from "../../context/AdminThemeContext.jsx";

/**
 * قاب پنل مدیریت — سایدبار + هدر کوچک + خروجی مسیرهای فرزند.
 */
const NAV = [
  { to: "/admin", end: true, label: "داشبورد", icon: LayoutDashboard },
  { to: "/admin/products", label: "محصولات", icon: Box },
  { to: "/admin/sliders", label: "اسلایدرها", icon: Image },
  { to: "/admin/brands", label: "برندها", icon: Tags },
];

export default function AdminLayout() {
  const store = useStore();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  const statCards = [
    { label: "محصولات", value: store?.products?.length ?? 0, icon: Package, tint: "bg-brand-50 text-brand-600" },
    { label: "برندها", value: store?.brands?.length ?? 0, icon: Tags, tint: "bg-trust-50 text-trust-600" },
    { label: "اسلایدرها", value: store?.slides?.length ?? 0, icon: Image, tint: "bg-success-50 text-success-600" },
    { label: "فروش (میلیون)", value: store?.totalRevenue != null ? Math.round(store.totalRevenue / 1_000_000) : 0, icon: BarChart3, tint: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* هدر پنل */}
      <header className="sticky top-0 z-40 border-b border-line bg-card">
        <div className="mx-auto flex max-w-site items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <Link to="/admin" className="flex shrink-0 items-center gap-2" aria-label="داشبورد آراز کلین">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Store className="size-4.5" aria-hidden="true" />
              </span>
              <span className="truncate text-sm font-black text-ink">
                پنل مدیریت آراز کلین
              </span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-lg bg-background px-3 py-2 text-xs font-bold text-muted sm:flex">
              <span className={`size-2 rounded-full ${pathname.startsWith("/admin") ? "bg-brand-500" : "bg-muted/40"}`} aria-hidden="true" />
              پنل مدیریت
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
              title={isDark ? "حالت روشن" : "حالت تاریک"}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:border-brand-500 hover:text-brand-600"
            >
              {isDark ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </button>
            <Link
              to="/"
              className="flex items-center gap-1 rounded-lg border border-line bg-card px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
              aria-label="بازگشت به فروشگاه"
            >
              <ChevronRight className="size-3.5" aria-hidden="true" />
              فروشگاه
            </Link>
          </div>
        </div>
      </header>

      {/* بدنه */}
      <div className="mx-auto max-w-site px-4 py-6 sm:px-6 lg:px-8">
        {/* آمار */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-card border border-line bg-card p-4 shadow-card">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${s.tint}`}>
                <s.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-black text-ink">{s.value}</p>
                <p className="truncate text-xs text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* سایدبار */}
          <aside className="lg:sticky lg:top-[74px] lg:self-start">
            <nav aria-label="ناوبری پنل مدیریت" className="rounded-card border border-line bg-card p-2 shadow-card">
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${isActive ? "bg-brand-500 text-white shadow-card" : "text-muted hover:bg-brand-50 hover:text-brand-600"}`
                      }
                    >
                      <item.icon className="size-4.5" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="mt-2 border-t border-line pt-2">
                <Link
                  to="/admin/products/new"
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-black text-brand-600 transition-colors hover:bg-brand-100"
                >
                  <Package className="size-4" aria-hidden="true" />
                  افزودن محصول
                </Link>
              </div>

            </nav>
          </aside>

          {/* محتوا */}
          <section className="min-w-0">
            {store?.orders?.length ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-card border border-line bg-card px-4 py-3 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />
                  آخرین سفارش‌ها
                </span>
                <span>
                  {store?.orders?.length} سفارش · {store?.orders?.filter((o) => o.status === "completed").length} تکمیل‌شده
                </span>
              </div>
            ) : null}
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}