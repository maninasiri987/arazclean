import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUp,
  Package,
  PackageX,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { formatPrice, toFaDigits } from "../../utils/format.js";

const ORDER_STATUS = {
  completed: "تکمیل‌شده",
  processing: "در حال پردازش",
  pending: "در انتظار",
  cancelled: "لغو شده",
};

const STATUS_CLS = {
  completed: "bg-success-50 text-success-600",
  processing: "bg-trust-50 text-trust-600",
  pending: "bg-brand-50 text-brand-600",
  cancelled: "bg-red-50 text-red-500",
};

const USER_STATUS = {
  active: "فعال",
  inactive: "غیرفعال",
};

const USER_STATUS_CLS = {
  active: "bg-success-50 text-success-600",
  inactive: "bg-background text-muted border border-line",
};

/**
 * داشبورد مدیریت — آمار کلی، نمودار فروش و وضعیت موجودی + سفارش‌های اخیر.
 */
export default function AdminDashboard() {
  const store = useStore();
  const {
    products,
    orders,
    users,
    sales,
    totalRevenue,
    lowStockProducts,
    outOfStockProducts,
  } = store;

  const maxSale = Math.max(...sales.map((s) => s.value), 1);

  // ---------- نقاط نمودار خطی (SVG) ----------
  const [hovered, setHovered] = useState(null);

  const W = 100;
  const H = 100;
  const PAD = 8;
  const { points, linePath, areaPath } = useMemo(() => {
    if (!sales.length) return { points: [], linePath: "", areaPath: "" };
    const n = sales.length;
    const pts = sales.map((s, i) => {
      const x = PAD + (i / (n - 1)) * (W - PAD * 2);
      const y = H - PAD - (s.value / maxSale) * (H - PAD * 2);
      return { ...s, x, y };
    });
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${line} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;
    return { points: pts, linePath: line, areaPath: area };
  }, [sales, maxSale]);

  const cards = [
    {
      label: "مجموع فروش",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      tint: "bg-brand-50 text-brand-600",
    },
    {
      label: "تعداد سفارش",
      value: toFaDigits(orders.length),
      icon: ShoppingCart,
      tint: "bg-trust-50 text-trust-600",
    },
    {
      label: "محصولات",
      value: toFaDigits(products.length),
      icon: Package,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "موجودی کم",
      value: toFaDigits(lowStockProducts.length),
      icon: AlertTriangle,
      tint: "bg-red-50 text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-line bg-card p-4 shadow-card sm:p-5">
            <div className={`flex size-11 items-center justify-center rounded-xl ${c.tint}`}>
              <c.icon className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-3 text-lg font-black text-ink sm:text-2xl">{c.value}</p>
            <p className="mt-0.5 text-xs text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      {/* کاربران سایت */}
      <section className="rounded-card border border-line bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-black text-ink">
            <Users className="size-4 text-brand-500" aria-hidden="true" />
            کاربران و حساب‌ها
          </h2>
          <span className="text-[11px] text-muted">
            {toFaDigits(users.length)} حساب ثبت‌شده
          </span>
        </div>

        {/* آمار کاربران */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-background/50 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Users className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black text-ink">{toFaDigits(users.length)}</p>
              <p className="truncate text-[11px] text-muted">کل حساب‌ها</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-background/50 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-50 text-success-600">
              <UserCheck className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black text-ink">
                {toFaDigits(users.filter((u) => u.status === "active").length)}
              </p>
              <p className="truncate text-[11px] text-muted">حساب فعال</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-background/50 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-trust-50 text-trust-600">
              <UserPlus className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black text-ink">
                {toFaDigits(users.filter((u) => u.orders > 0).length)}
              </p>
              <p className="truncate text-[11px] text-muted">خریدار</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-background/50 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ShoppingCart className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black text-ink">
                {toFaDigits(users.reduce((s, u) => s + u.orders, 0))}
              </p>
              <p className="truncate text-[11px] text-muted">کل سفارش‌ها</p>
            </div>
          </div>
        </div>

        {/* فهرست کاربران و فعالیت */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase text-muted/60">
                <th className="px-2 py-2 font-bold">نام</th>
                <th className="px-2 py-2 font-bold">شناسه / موبایل</th>
                <th className="px-2 py-2 font-bold">نقش</th>
                <th className="px-2 py-2 font-bold">سفارش‌ها</th>
                <th className="px-2 py-2 font-bold">آخرین فعالیت</th>
                <th className="px-2 py-2 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 8).map((u) => (
                <tr key={u.id} className="border-b border-line/60 last:border-0">
                  <td className="px-2 py-2.5 font-bold text-ink">{u.name}</td>
                  <td className="px-2 py-2.5 text-muted" dir="ltr">{u.identifier}</td>
                  <td className="px-2 py-2.5 text-muted">{u.role}</td>
                  <td className="px-2 py-2.5 font-bold text-ink">{toFaDigits(u.orders)}</td>
                  <td className="px-2 py-2.5 text-muted">{u.lastActive}</td>
                  <td className="px-2 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${USER_STATUS_CLS[u.status]}`}>
                      {USER_STATUS[u.status] || u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-muted">
          کاربرانی که در سایت وارد/ثبت‌نام می‌شوند به‌صورت خودکار اینجا ثبت می‌شوند؛
          در نسخهٔ وردپرس، کاربران از خود ووکامرس خوانده می‌شوند.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* نمودار فروش */}
        <div className="rounded-card border border-line bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <TrendingUp className="size-4 text-brand-500" aria-hidden="true" />
              روند فروش (میلیون تومان)
            </h2>
            <span className="text-[11px] text-muted">۱۴ روز اخیر</span>
          </div>
          <div className="relative h-48">
            {/* نمودار خطی SVG — با گرادیان زیر خط و نقطه‌های هاور */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label="نمودار خطی روند فروش ۱۴ روز اخیر"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="sales-line-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* خطوط شبکهٔ افقی */}
              {[0.25, 0.5, 0.75, 1].map((f) => (
                <line
                  key={f}
                  x1={PAD}
                  x2={W - PAD}
                  y1={PAD + (1 - f) * (H - PAD * 2)}
                  y2={PAD + (1 - f) * (H - PAD * 2)}
                  stroke="var(--color-line)"
                  strokeWidth="0.4"
                  strokeDasharray="2 2"
                />
              ))}

              {/* ناحیهٔ زیر خط (گرادیان) */}
              {areaPath && (
                <path d={areaPath} fill="url(#sales-line-fill)" />
              )}

              {/* خود خط فروش */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--color-brand-500)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* نقاط داده — با هاور نمایش مقدار */}
              {points.map((p, i) => (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* ناحیهٔ لمس بزرگ‌تر برای هاور راحت‌تر */}
                  <circle cx={p.x} cy={p.y} r="6" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hovered === i ? 2.2 : 1.4}
                    fill="var(--color-card)"
                    stroke="var(--color-brand-500)"
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>

            {/* مقدار نقطهٔ هاورشده */}
            {hovered !== null && points[hovered] && (
              <span
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-bold text-card shadow-pop"
                style={{
                  left: `${points[hovered].x}%`,
                  top: `${points[hovered].y}%`,
                }}
              >
                {toFaDigits(points[hovered].value)} میلیون
              </span>
            )}
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-[10px] text-muted/70">
            <span>تازه</span>
            <span>قدیمی‌تر</span>
          </div>
        </div>

        {/* موجودی */}
        <div className="space-y-6">
          {/* کم‌موجودی */}
          <div className="rounded-card border border-line bg-card p-5 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
              <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />
              موجودی رو به اتمام
            </h2>
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">همه‌چیز موجود است 👍</p>
            ) : (
              <ul className="space-y-2">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <PackageX className={`size-4 shrink-0 ${p.stock <= 0 ? "text-red-500" : "text-amber-500"}`} aria-hidden="true" />
                      <span className="truncate text-ink">{p.title}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${p.stock <= 0 ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
                      {p.stock <= 0 ? "ناموجود" : `${toFaDigits(p.stock)} عدد`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* سفارش‌های اخیر */}
          <div className="rounded-card border border-line bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black text-ink">
                <ShoppingCart className="size-4 text-brand-500" aria-hidden="true" />
                آخرین سفارش‌ها
              </h2>
              <Link to="/admin/products" className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
                همهٔ سفارش‌ها
                <ArrowUp className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-line text-[10px] uppercase text-muted/60">
                    <th className="px-2 py-2 font-bold">شناسه</th>
                    <th className="px-2 py-2 font-bold">محصول</th>
                    <th className="px-2 py-2 font-bold">تاریخ</th>
                    <th className="px-2 py-2 font-bold">وضعیت</th>
                    <th className="px-2 py-2 font-bold">مبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o.id} className="border-b border-line/60 last:border-0">
                      <td className="px-2 py-2 font-bold text-muted">{toFaDigits(o.id)}</td>
                      <td className="max-w-[140px] truncate px-2 py-2 font-bold text-ink">{o.product}</td>
                      <td className="px-2 py-2 text-muted">{toFaDigits(o.date)}</td>
                      <td className="px-2 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_CLS[o.status]}`}>
                          {ORDER_STATUS[o.status]}
                        </span>
                      </td>
                      <td className="px-2 py-2 font-bold text-ink">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}