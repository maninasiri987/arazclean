import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Menu, ShoppingCart } from "lucide-react";
import logo from "../../../assets/header.png";
import { getSettings } from "../../services/catalog.js";
import { useCartState } from "../../context/CartContext.jsx";
import { formatNumber } from "../../utils/format.js";
import Search from "./Search.jsx";
import Navbar from "./Navbar.jsx";
import MobileMenu from "./MobileMenu.jsx";

/**
 * هدر سایت — فیکس در بالای صفحه با سایه.
 * دسکتاپ: ۲ ردیفه (لوگو + جستجو + اکشن‌ها / ناوبری).
 * موبایل: نوار بالا (همبرگر، لوگو، سبد) + جستجوی تمام‌عرض زیر آن.
 * هنگام اسکرول به پایین، ردیف دوم (ناوبری/جستجو) به‌نرمی جمع می‌شود
 * و هنگام اسکرول به بالا دوباره ظاهر می‌شود.
 */
export default function Header() {
  const { siteName } = getSettings();
  const { count } = useCartState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  // جمع‌شدن ردیف دوم هنگام اسکرول به پایین
  useEffect(() => {
    let lastY = window.scrollY;
    const COLLAPSE_AFTER = 140; // بعد از این مقدار اسکرول، ردیف دوم جمع می‌شود

    const onScroll = () => {
      const y = window.scrollY;
      if (y > COLLAPSE_AFTER && y > lastY) {
        setNavHidden(true);
      } else if (y < lastY || y <= COLLAPSE_AFTER) {
        setNavHidden(false);
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // توجه: overflow-hidden فقط برای انیمیشن جمع‌شدن است؛ هنگام فوکوس جستجو باید
  // منوی کشویی بیرون از ردیف دیده شود (focus-within آن را موقتاً برمی‌دارد)
  const secondRowClasses = `overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:overflow-visible ${
    navHidden ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
  }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-card shadow-[0_4px_20px_-8px_rgb(15_23_42/0.18)]">
      {/* ---------- دسکتاپ: دو ردیف — تمام‌عرض ---------- */}
      <div className="hidden lg:block">
        <div className="flex h-20 items-center gap-6 px-4 sm:gap-8 sm:px-6 lg:px-10">
          <Link to="/" className="flex shrink-0 items-center" aria-label={siteName}>
            <img src={logo} alt={siteName} className="h-12 w-auto object-contain" />
          </Link>

          <Search className="w-full max-w-sm" />

          <div className="ms-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="ورود یا ثبت‌نام"
              className="group flex cursor-pointer items-center gap-2 rounded-xl border border-brand-500 bg-transparent px-4 py-2.5 text-sm font-bold text-brand-600 transition-[color,background-color,transform] hover:bg-brand-500 hover:text-white active:scale-95"
            >
              <LogIn className="size-4 -scale-x-100" aria-hidden="true" />
              ورود / ثبت‌نام
            </button>
            <Link
              to="/cart"
              aria-label={`سبد خرید — ${formatNumber(count)} کالا`}
              className="relative flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 p-2.5 text-white transition-[background-color,transform] hover:bg-brand-600 active:scale-95"
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                >
                  {formatNumber(count)}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className={secondRowClasses}>
          <div className="border-t border-line px-4 sm:px-6 lg:px-10">
            <Navbar />
          </div>
        </div>
      </div>

      {/* ---------- موبایل ---------- */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-ink transition-colors hover:bg-background"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>

          <Link to="/" aria-label={siteName} className="flex items-center">
            <img src={logo} alt={siteName} className="h-9 w-auto object-contain" />
          </Link>

          <Link
            to="/cart"
            aria-label={`سبد خرید — ${formatNumber(count)} کالا`}
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
              >
                {formatNumber(count)}
              </span>
            )}
          </Link>
        </div>
        <div className={secondRowClasses}>
          <div className="px-4 pb-3">
            <Search />
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
