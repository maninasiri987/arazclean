# آراز کلین — فروشگاه آنلاین محصولات نظافت

پروژهٔ **UI Mockup** حرفه‌ای و ریسپانسیو فروشگاه آنلاین محصولات نظافت و شوینده
با **React + Vite + Tailwind CSS v4**. فقط رابط کاربری — بدون بک‌اند و بدون API.
داده‌ها از فایل‌های JSON محلی خوانده می‌شوند و در آینده به **ووکامرس** وصل می‌شوند.

## راه‌اندازی

```bash
npm install
npm run dev      # اجرای نسخهٔ توسعه
npm run build    # ساخت نسخهٔ نهایی
npm run preview  # پیش‌نمایش نسخهٔ ساخته‌شده
```

## استک

- React 19 + Vite 6
- React Router v7 (lazy routes)
- Tailwind CSS v4 (پیکربندی از طریق `@theme` در `src/index.css`)
- Swiper (اسلایدر هیرو)
- Framer Motion (انیمیشن‌های ظریف)
- React Helmet Async (مدیریت عنوان هر صفحه)
- React Hook Form (فقط فرم تماس — UI)
- Lucide Icons

## ساختار پروژه

```
assets/                  ← تصاویر (لوگو/هدر)
public/                  ← فایل‌های استاتیک (favicon، فونت‌ها)
PLAN.md                  ← برنامهٔ پیاده‌سازی
src/
  main.jsx               ← Providers (Helmet, Toast, Cart, Router)
  App.jsx                ← چیدمان + مسیرها
  index.css              ← Tailwind + توکن‌های برند + فونت
  data/                  ← دادهٔ نمایشی (JSON)
    products.json        ← ۲۴ محصول
    categories.json      ← ۸ دسته‌بندی
    brands.json          ← ۱۰ برند
    blog.json            ← ۶ مقاله
    hero.json            ← ۴ اسلاید هیرو
    navigation.json      ← منوها و جستجوهای پرطرفدار
    settings.json        ← تنظیمات سایت
  services/
    catalog.js           ← تنها نقطهٔ دسترسی به داده (نقطهٔ تعویض ووکامرس)
  context/               ← CartContext + ToastContext
  hooks/                 ← useProducts, useScrollRestoration, useLockBodyScroll
  utils/format.js        ← قالب‌بندی اعداد فارسی
  components/
    ui/                  ← کامپوننت‌های پایه (Button, Badge, Rating, Modal, …)
    layout/              ← Header, Footer, Navbar, Search, MobileMenu, BackToTop
    product/             ← ProductCard, ProductGrid, SidebarFilter, ProductTabs, …
    home/                ← HeroSlider, CategoryCard, BrandCard, BlogCard, …
    common/              ← Seo, PageHero, Reveal
  pages/                 ← ۱۱ صفحه
```

## صفحات

خانه، محصولات (فیلتر/مرتب‌سازی/صفحه‌بندی)، دسته‌بندی، جزئیات محصول، برندها،
مجله، جزئیات مقاله، درباره ما، تماس، سبد خرید (فقط UI) و صفحهٔ ۴۰۴.

## نکته‌ها

- **فونت:** وزیرمتن از Google Fonts بارگذاری می‌شود؛ برای فونت وزیر، فایل‌ها را
  با نام‌های `Vazir-Thin … Vazir-Black` (فرمت `.woff2`) در `public/fonts/` قرار دهید.
- **رنگ‌های برند:** در `src/index.css` بخش `@theme` تعریف شده‌اند؛
  از توکن‌هایی مثل `bg-brand-500`، `text-ink`، `border-line` استفاده کنید.
- **تصاویر:** این پروژه UI mockup است؛ به‌جای تصویر واقعی از کامپوننت
  `ImagePlaceholder` استفاده می‌شود.
- **اتصال به وردپرس:** برای اتصال به ووکامرس فقط `src/services/catalog.js`
  بازنویسی می‌شود؛ بقیهٔ کد بدون تغییر می‌ماند.
