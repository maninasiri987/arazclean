/**
 * تبدیل مسیر مطلق به مسیر پایه‌دار — برای استقرار روی زیرمسیر (مثل GitHub Pages)
 * که سایت در آدرسی مثل `/arazclean/` سرو می‌شود و مسیرهای مطلقِ `/images/...`
 * به جای درستی اشاره نمی‌کنند.
 *
 * ایدمپوتنت است: اگر مسیر از قبل پایه‌دار شده باشد دوباره پیشوند نمی‌گیرد.
 */
export const assetPath = (path) => {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path; // لینک خارجی دست‌نخورده می‌ماند
  if (!path.startsWith("/")) return path; // مسیر نسبی دست‌نخورده می‌ماند
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.replace(/\/+$/, "");
  if (cleanBase !== "/" && path.startsWith(cleanBase)) return path; // از قبل پایه‌دار
  return `${cleanBase}${path}`;
};
