import { routeLoaders } from "../routes.js";

/**
 * پیش‌بارگذاری صفحهٔ بعدی هنگام هاور/فوکوس — تا جابه‌جایی بدون درنگ باشد.
 * چون صفحات lazy هستند، این تابع چانک مربوطه را زودتر دانلود می‌کند.
 * (import دوبارهٔ همان ماژول توسط مرورگر کش می‌شود — بدون هزینهٔ اضافه.)
 */
export const prefetchPage = (to) => {
  if (!to) return;
  // کوئری‌استرینگ را حذف می‌کنیم تا /products?sort=… هم با مسیر /products هم‌خوانی کند
  const path = to.split("?")[0];
  const key =
    Object.keys(routeLoaders).find(
      (route) => path === route || path.startsWith(route + "/")
    ) || "";
  const loader = routeLoaders[key];
  if (loader) loader().catch(() => {});
};
