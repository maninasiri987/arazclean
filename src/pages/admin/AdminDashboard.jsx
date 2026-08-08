import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUp,
  Package,
  PackageX,
  ShoppingCart,
  TrendingUp,
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

/**
 * داشبورد مدیریت — آمار کلی، نمودار فروش و وضعیت موجودی + سفارش‌های اخیر.
 */
export default function AdminDashboard() {
  const store = useStore();
  const { products, orders, sales, totalRevenue, lowStockProducts, outOfStockProducts } = store;

  const maxSale = Math.max(...sales.map((s) => s.value), 1);

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
          <div className="relative h-48 flex items-end justify-between gap-1.5">
            {sales.map((s, i) => {
              const h = Math.round((s.value / maxSale) * 150); // px height
              return (
                <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div className="relative w-full max-w-6">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        i === sales.length - 1
                          ? "bg-brand-500"
                          : "bg-brand-500/30 group-hover:bg-brand-500/60"
                      }`}
                      style={{ height: `${Math.max(h, 8)}px` }}
                      role="img"
                      aria-label={`روز ${toFaDigits(i + 1)}: ${toFaDigits(s.value)} میلیون`}
                    />
                    {/* text-card: در حالت روشن سفید و در تاریک تیره است — خوانایی در هر دو پوسته */}
                    <span className="pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold text-card opacity-0 transition-opacity group-hover:opacity-100">
                      {toFaDigits(s.value)}
                    </span>
                  </div>
                </div>
              );
            })}
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