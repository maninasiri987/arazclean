import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, ShoppingCart } from "lucide-react";
import { useCartState } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatNumber } from "../../utils/format.js";
import Search from "./Search.jsx";
import Navbar from "./Navbar.jsx";
import ProfileMenu from "./ProfileMenu.jsx";
import logo from "../../../assets/header.webp";
import { getSettings } from "../../services/catalog.js";

/**
 * هدر سایت — فیکس در بالای صفحه با سایه.
 * دسکتاپ: جستجو + اکشن‌ها و ناوبری.
 * موبایل: فیلد جستجو (کلیک → صفحهٔ تمام‌صفحه) + دکمهٔ حساب.
 *
 * هنگام فوکوس جستجو:
 *  - دسکتاپ: کشوی پیشنهادات زیر فیلد باز می‌شود (بدون پس‌زمینهٔ تیره).
 *  - موبایل: صفحهٔ تمام‌صفحهٔ جستجو باز می‌شود (توسط Search مدیریت می‌شود).
 */
export default function Header() {
  const { count } = useCartState();
  const { user } = useAuth();
  const [navHidden, setNavHidden] = useState(false);

  // جمع‌شدن ردیف دوم هنگام اسکرول به پایین
  useEffect(() => {
    let lastY = window.scrollY;
    const COLLAPSE_AFTER = 140;

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

  // همگام‌سازی ارتفاع هدر با محتوا و منوی کشویی — تا فاصلهٔ خالی ایجاد نشود
  useEffect(() => {
    const root = document.documentElement;
    // ۱۲۲px = هدر باز (۸۰px ردیف اول + ناوبری)، ۸۱px = هدر جمع‌شده
    root.style.setProperty("--header-offset", navHidden ? "81px" : "122px");
  }, [navHidden]);

  const secondRowClasses = `overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:overflow-visible ${
    navHidden ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
  }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-card shadow-[0_4px_20px_-8px_rgb(15_23_42/0.18)]">
        {/* ─── دسکتاپ: دو ردیف ─── */}
        <div className="hidden lg:block">
          <div className="flex h-20 items-center gap-6 px-4 sm:gap-8 sm:px-6 lg:px-10">
            <Link to="/" className="flex shrink-0 items-center" aria-label={getSettings().siteName}>
              <img src={logo} alt={getSettings().siteName} className="h-11 w-auto object-contain" loading="lazy" decoding="async" />
            </Link>

            <Search className="w-full max-w-md" />

            <div className="ms-auto flex shrink-0 items-center gap-2">
              {user ? (
                <ProfileMenu />
              ) : (
                <Link
                  to="/login"
                  aria-label="ورود یا ثبت‌نام"
                  className="group flex cursor-pointer items-center gap-2 rounded-xl border border-brand-500 bg-transparent px-4 py-2.5 text-sm font-bold text-brand-600 transition-[color,background-color,transform] hover:bg-brand-500 hover:text-white active:scale-95"
                >
                  <LogIn className="size-4 -scale-x-100" aria-hidden="true" />
                  ورود / ثبت‌نام
                </Link>
              )}
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

        {/* ─── موبایل: فیلد جستجو + دکمهٔ حساب ─── */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center gap-2.5 px-4">
            <div className="min-w-0 flex-1">
              {/* در موبایل، لوگو فقط یک تصویر تزئینی داخل فیلد جستجو است — قابل کلیک نیست */}
              <Search
                logo={
                  <img
                    src={logo}
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                }
              />
            </div>
            {user ? (
              <ProfileMenu />
            ) : (
              <Link
                to="/login"
                aria-label="ورود یا ثبت‌نام"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line text-muted transition-[color,background-color,border-color] duration-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
              >
                <LogIn className="size-4.5 -scale-x-100" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
