import { routeLoaders } from "../routes.js";

/**
 * پیش‌بارگذاری صفحهٔ بعدی هنگام هاور/فوکوس — تا جابه‌جایی بدون درنگ باشد.
 * چون صفحات lazy هستند، این تابع چانک مربوطه را زودتر دانلود می‌کند.
 * (import دوبارهٔ همان ماژول توسط مرورگر کش می‌شود — بدون هزینهٔ اضافه.)
 */
export const prefetchPage = (to) => {
  if (!to) return;
  const key =
    Object.keys(routeLoaders).find(
      (route) => to === route || to.startsWith(route + "/")
    ) || "";
  const loader = routeLoaders[key];
  if (loader) loader().catch(() => {});
};
