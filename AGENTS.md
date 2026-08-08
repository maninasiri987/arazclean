# AGENTS.md — آراز کلین (Araz Clean)

فروشگاه آنلاین محصولات نظافت و شوینده — **راست‌به‌چپ (RTL)**، فارسی.

## Stack

- React 19 + Vite 6
- Tailwind CSS v4 (پیکربندی از طریق `@theme` در `src/index.css`)
- Lucide Icons (`lucide-react`)
- فونت: **B Yekan+** (فایل‌ها در `public/fonts/` — WOFF2 + TTF). بازسازی WOFF2: `npm run fonts`

## پالت رنگ برند

| توکن Tailwind | مقدار (Hex) | کاربرد |
| --- | --- | --- |
| `brand-500` | `#0EA5A4` | Primary / Brand |
| `trust-500` | `#2563EB` | Secondary / Trust |
| `success-500` | `#22C55E` | Success |
| `background` | `#F8FAFC` | Page Background |
| `card` | `#FFFFFF` | Card Background |
| `line` | `#E2E8F0` | Border |
| `ink` | `#0F172A` | Primary Text |
| `muted` | `#475569` | Secondary Text |

**رنگ‌های بالا دقیقاً از برند است و نباید بدون تأیید تغییر کند.**

سایه‌های کمکی (مشتق‌شده برای hover و حالت‌ها — قابل تغییر با تأیید کاربر):

| توکن | مقدار |
| --- | --- |
| `brand-50` | `#E7F6F6` |
| `brand-100` | `#CCECEC` |
| `brand-600` | `#0C8E8D` |
| `brand-700` | `#0A7776` |
| `trust-50` | `#EBF1FE` |
| `trust-600` | `#1D4ED8` |
| `success-50` | `#ECFDF3` |
| `success-600` | `#16A34A` |

## نحوهٔ استفاده از رنگ‌ها

در کامپوننت‌ها از همان توکن‌های بالا استفاده کنید:

```
bg-brand-500   text-ink      border-line
bg-background  bg-card       text-muted
bg-trust-500   text-success-500
```

## قواعد پروژه

- زبان: فارسی؛ همهٔ متن‌های رابط کاربری فارسی باشد.
- جهت صفحه: RTL (`dir="rtl"` در `index.html`). در فاصله‌گذاری از ویژگی‌های منطقی Tailwind استفاده کنید: `ms-*` / `me-*`، `ps-*` / `pe-*`، `start-*` / `end-*`.
- آیکون‌ها: فقط از `lucide-react` استفاده شود.
- برای تصاویر از پوشهٔ `public/` یا `src/assets/` استفاده کنید.
- رنگ‌ها و طراحی محصول (اسکلت صفحات) بدون تأیید کاربر ساخته نمی‌شود؛ کاربر طراحی را هدایت می‌کند.

## ساختار پروژه

```
assets/       ← تصاویر لوگو
public/       ← فایل‌های استاتیک (لوگو، فونت‌ها)
src/
  App.jsx     ← صفحهٔ جایگزین (به‌زودی جایگزین می‌شود)
  main.jsx    ← نقطهٔ ورود
  index.css   ← Tailwind v4 + @theme + فونت
```

## اتصال به وردپرس (برنامهٔ آینده)

داده‌های فروشگاه بعداً از ووکامرس (WooCommerce REST API) خوانده می‌شود.
معماری به‌گونه‌ای نگه داشته می‌شود که جایگزینی دادهٔ نمونه با API ساده باشد.
