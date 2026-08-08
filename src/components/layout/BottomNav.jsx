import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Phone, ShoppingCart, Tags } from "lucide-react";
import { useCartState } from "../../context/CartContext.jsx";
import { formatNumber } from "../../utils/format.js";

/**
 * نوار پایین موبایل — جایگزین منوی همبرگری.
 * فقط در موبایل نمایش داده می‌شود؛ دسکتاپ/تبلت بدون تغییر می‌ماند.
 */
const TABS = [
  { to: "/", label: "خانه", icon: Home, isActive: (p) => p === "/" },
  {
    to: "/products",
    label: "دسته‌بندی‌ها",
    icon: LayoutGrid,
    isActive: (p) =>
      p.startsWith("/products") ||
      p.startsWith("/category") ||
      p.startsWith("/product"),
  },
  {
    to: "/cart",
    label: "سبد خرید",
    icon: ShoppingCart,
    isActive: (p) => p.startsWith("/cart"),
    badge: true,
  },
  { to: "/brands", label: "برندها", icon: Tags, isActive: (p) => p.startsWith("/brands") },
  { to: "/contact", label: "تماس با ما", icon: Phone, isActive: (p) => p.startsWith("/contact") },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { count } = useCartState();

  return (
    <nav
      aria-label="ناوبری پایین موبایل"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-8px_rgb(15_23_42/0.15)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive(pathname);
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className={`flex cursor-pointer flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors duration-200 ${
                  active ? "text-brand-600" : "text-muted hover:text-brand-600"
                }`}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {tab.badge && count > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -left-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
                    >
                      {formatNumber(count)}
                    </span>
                  )}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
