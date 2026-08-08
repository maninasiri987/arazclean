/**
 * تبدیل مسیر مطلق به مسیر پایه‌دار — برای استقرار روی زیرمسیر (مثل GitHub Pages)
 * که سایت در آدرسی مثل `/arazclean/` سرو می‌شود و مسیرهای مطلقِ `/images/...`
 * به جای درستی اشاره نمی‌کنند.
 */
export const assetPath = (path) => {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path; // لینک خارجی دست‌نخورده می‌ماند
  if (!path.startsWith("/")) return path; // مسیر نسبی دست‌نخورده می‌ماند
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}${path}`;
};
