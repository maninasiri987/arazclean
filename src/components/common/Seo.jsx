import { Helmet } from "react-helmet-async";
import { getSettings } from "../../services/catalog.js";
import logo from "../../../assets/header.webp";

/**
 * مدیریت عنوان، توضیحات و متاهای اشتراک‌گذاری (Open Graph / Twitter) هر صفحه.
 *
 * آدرس پایهٔ برنامه از `siteUrl` در settings.json (دامنهٔ اصلی) + `BASE_URL`
 * (مسیر استقرار مثل `/arazclean/` در GitHub Pages) ساخته می‌شود؛ بنابراین با
 * تغییر محل استقرار (ریشهٔ دامنهٔ وردپرس یا زیرپوشه) به‌صورت خودکار درست می‌ماند.
 */
export default function Seo({ title, description }) {
  const { siteName, siteUrl } = getSettings();
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  // دامنهٔ اصلی بدون اسلش انتهایی — منبع حقیقت در settings.json
  const origin = (siteUrl || "").replace(/\/+$/, "");
  // مسیر پایهٔ استقرار (مثل /arazclean/) — پیشوند آدرس نهایی سایت
  const cleanBase = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "") || "/";
  const appUrl = `${origin}${cleanBase}`;
  // لوگوی باندل‌شده از قبل پیشوند پایه را دارد → دامنه کافی است.
  // اگر فایل خیلی کوچک شود و Vite آن را به‌صورت data URI درون‌خطی کند،
  // به‌جای آدرس مطلق استفاده نمی‌شود (og:image باید آدرس مطلق باشد).
  const imageUrl = /^https?:|^data:/.test(logo) ? logo : `${origin}${logo}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Open Graph — اشتراک در تلگرام/اینستاگرام/لینکدین */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {origin && <meta property="og:url" content={appUrl} />}
      {origin && !/^data:/.test(logo) && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:alt" content={siteName} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {origin && !/^data:/.test(logo) && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
}
