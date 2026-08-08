import { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import BottomNav from "./components/layout/BottomNav.jsx";
import BackToTop from "./components/layout/BackToTop.jsx";
import BootLoader from "./components/common/BootLoader.jsx";
import useScrollRestoration from "./hooks/useScrollRestoration.js";
import {
  HomePage,
  ProductsPage,
  CategoryPage,
  ProductDetailsPage,
  BrandsPage,
  BrandPage,
  AboutPage,
  ContactPage,
  CartPage,
  AdminNewProductPage,
  NotFoundPage,
} from "./routes.js";

/** اسکرول به بالای صفحه هنگام تغییر مسیر */
function ScrollToTop() {
  useScrollRestoration();
  return null;
}

/**
 * هنگام موفقیت اولین رندر، بوت را تمام‌شده اعلام می‌کند؛
 * از این به بعد هیچ لودری هنگام جابه‌جایی بین صفحات نمایش داده نمی‌شود.
 */
function MarkBooted({ onBoot }) {
  useEffect(() => {
    onBoot(true);
  }, [onBoot]);
  return null;
}

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {/* پرش مستقیم به محتوا برای صفحه‌خوان‌ها */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-500 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-pop"
      >
        پرش به محتوای اصلی
      </a>

      <ScrollToTop />

      {/* لودر فقط هنگام اولین باز شدن سایت */}
      <AnimatePresence>{!booted && <BootLoader />}</AnimatePresence>

      <Header />

      <main
        id="main"
        className="min-h-screen bg-background pt-[68px] lg:pt-[var(--header-offset,122px)] lg:transition-[padding-top] lg:duration-500 lg:ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* fallback خالی — هنگام جابه‌جایی بین صفحات لودر نمایش داده نمی‌شود */}
        <Suspense fallback={null}>
          <MarkBooted onBoot={setBooted} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/category/:slug/:subslug" element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetailsPage />} />
            <Route path="/brands/:slug" element={<BrandPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/admin/products/new" element={<AdminNewProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* فضای خالی موبایل — تا فوتر زیر نوار پایین پنهان نشود */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <BottomNav />

      <BackToTop />
    </>
  );
}
