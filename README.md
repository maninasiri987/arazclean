# آراز کلین — فروشگاه آنلاین محصولات نظافت

فروشگاه آنلاین **RTL فارسی** محصولات نظافت و شوینده با **React + Vite + Tailwind CSS v4** به‌همراه **بک‌اند وردپرس/ووکامرس**.

فرانت‌اند به‌صورت کامل (فروشگاه + پنل مدیریت) در همین ریپو قرار دارد و لایهٔ دسترسی به داده
از طریق `src/services/catalog.js` جدا شده است تا در آینده بدون تغییر باقی کد، به REST ووکامرس متصل شود.

## ویژگی‌ها

- فروشگاه کامل: خانه، محصولات (فیلتر/مرتب‌سازی/صفحه‌بندی)، دسته‌بندی، جزئیات محصول، برندها، درباره ما، تماس
- سبد خرید و احراز هویت (ورود/ثبت‌نام)
- **پنل مدیریت**: داشبورد، مدیریت محصولات (افزودن/ویرایش)، برندها، اسلایدرها
- حالت RTL و فونت فارسی، طراحی ریسپانسیو (موبایل/تبلت/دسکتاپ)
- بارگذاری lazy صفحات و تصاویر (اسکلتون‌های shimmer)
- سئو با React Helmet Async (عنوان/توضیحات/OG هر صفحه)
- استقرار خودکار روی **GitHub Pages** با GitHub Actions
- بک‌اند وردپرس با mu-plugins اختصاصی (احراز هویت، مدیا، مسیرهای SPA و REST)

## راه‌اندازی

```bash
npm install
npm run dev      # اجرای نسخهٔ توسعه (http://localhost:5173)
npm run build    # ساخت نسخهٔ نهایی در dist/
npm run preview  # پیش‌نمایش نسخهٔ ساخته‌شده
npm run fonts    # تبدیل فونت‌های TTF به WOFF2 (scripts/woff2.mjs)
```

## استک

- React 19 + Vite 6
- React Router v7 (مسیرهای lazy)
- Tailwind CSS v4 (پیکربندی از طریق `@theme` در `src/index.css`)
- React Helmet Async (مدیریت عنوان/متای هر صفحه)
- React Hook Form (فرم‌ها)
- Lucide Icons
- وردپرس + ووکامرس (بک‌اند)

## ساختار پروژه

```
assets/                  ← تصاویر استاتیک (لوگو/هدر)
public/                  ← فایل‌های استاتیک (favicon، فونت‌ها، تصاویر، sitemap، robots)
src/
  main.jsx               ← Providers (Helmet, Toast, Cart, Auth, Store, Router)
  App.jsx                ← چیدمان + مسیرها
  routes.js              ← تنها منبع تعریف صفحات lazy
  index.css              ← Tailwind + توکن‌های برند + فونت
  data/                  ← دادهٔ سایت (JSON)
    products.json        ← محصولات
    categories.json      ← دسته‌بندی‌ها
    brands.json          ← برندها
    hero.json            ← اسلایدهای هیرو
    navigation.json      ← منوها و جستجوهای پرطرفدار
    settings.json        ← تنظیمات سایت (نام، اطلاعات تماس، ووکامرس)
  services/
    catalog.js           ← تنها نقطهٔ دسترسی به داده (نقطهٔ تعویض ووکامرس)
    woocommerce.js       ← لایهٔ REST ووکامرس (کلید مصرف‌کننده در settings.json)
  context/               ← CartContext, AuthContext, StoreContext, ToastContext, AdminThemeContext
  hooks/                 ← useProducts, useScrollRestoration, useLockBodyScroll, useRecentSearches
  utils/                 ← format (اعداد فارسی), assets, prefetch
  components/
    ui/                  ← کامپوننت‌های پایه (Button, Badge, Rating, Modal, Input, …)
    layout/              ← Header, Footer, Navbar, Search, ProfileMenu, BottomNav, …
    product/             ← ProductCard, ProductGrid, ProductListing, ProductTabs, …
    home/                ← HeroSlider, CategoryRow, BrandLogoGrid, PromoBanner, …
    common/              ← Seo, PageHero, Reveal, RouteFallback, BootLoader
  pages/                 ← صفحات فروشگاه + صفحات پنل مدیریت (admin/)
wordpress/               ← بک‌اند وردپرس (هسته، افزونه‌ها، قالب‌ها، mu-plugins)
scripts/woff2.mjs        ← اسکریپت بهینه‌سازی فونت
vite.config.js           ← base: /arazclean/ (GitHub Pages) + جداسازی chunks
.github/workflows/deploy.yml ← استقرار خودکار روی GitHub Pages
```

## صفحات

**فروشگاه:** خانه، محصولات، دسته‌بندی، جزئیات محصول، برندها، صفحهٔ برند، درباره ما، تماس، ورود/ثبت‌نام، سبد خرید و ۴۰۴.

**پنل مدیریت (`/admin`):** داشبورد، لیست/افزودن/ویرایش محصول، اسلایدرها، برندها.

## بک‌اند وردپرس

پوشهٔ `wordpress/` شامل نصب کامل وردپرس است:

- `wp-content/mu-plugins/` — افزونه‌های اختصاصی:
  - `arazclean-auth.php` — احراز هویت
  - `arazclean-media.php` — مدیریت رسانه
  - `arazclean-spa-routes.php` — مسیرهای SPA
  - `woo-rest-http-auth.php` — احراز هویت REST ووکامرس

برای اتصال فرانت‌اند به ووکامرس، کلید مصرف‌کننده را در `src/data/settings.json` (بخش `woocommerce`) قرار دهید.

## استقرار

با هر push روی شاخهٔ `main`، وورک‌فلو `deploy.yml` اجرا و خروجی روی GitHub Pages
در آدرس `https://maninasiri987.github.io/arazclean/` منتشر می‌شود (`base` در `vite.config.js`).

## نکته‌ها

- **فونت:** فونت‌های `BYekan+` و `BYekan-Bold` (فرمت `.woff2`) در `public/fonts/` قرار دارند.
- **رنگ‌های برند:** در `src/index.css` بخش `@theme` تعریف شده‌اند؛
  از توکن‌هایی مثل `bg-brand-500`، `text-ink`، `border-line` استفاده کنید.
- **اتصال به ووکامرس:** برای اتصال کامل فقط لایهٔ `src/services/` بازنویسی می‌شود؛ بقیهٔ کد بدون تغییر می‌ماند.
