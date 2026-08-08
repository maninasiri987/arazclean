import { routeLoaders } from "../routes.js";

/**
 * پیش‌بارگذاری صفحهٔ بعدی هنگام هاور/فوکوس — تا جابه‌جایی بدون درنگ باشد.
 * چون صفحات lazy هستند، این تابع چانک مربوطه را زودتر دانلود می‌کند.
 * (import دوبارهٔ همان ماژول توسط مرورگر کش می‌شود — بدون هزینهٔ اضافه.)
 */
const matchRoute = (path) => {
  // ۱) تطبیق دقیق یا الگوی پویا (مثل /category/:slug/:subslug)
  for (const route of Object.keys(routeLoaders)) {
    if (path === route) return route;
    if (route.includes(":")) {
      const r = route.split("/").filter(Boolean);
      const p = path.split("/").filter(Boolean);
      if (
        r.length === p.length &&
        r.every((seg, i) => seg.startsWith(":") || seg === p[i])
      ) {
        return route;
      }
    }
  }
  // ۲) تطبیق پیشوند (مثل /products?sort=… → /products)
  for (const route of Object.keys(routeLoaders)) {
    if (!route.includes(":") && path.startsWith(route + "/")) return route;
  }
  return "";
};

export const prefetchPage = (to) => {
  if (!to) return;
  // کوئری‌استرینگ را حذف می‌کنیم تا /products?sort=… هم با مسیر /products هم‌خوانی کند
  const path = to.split("?")[0];
  const loader = routeLoaders[matchRoute(path)];
  if (loader) loader().catch(() => {});
};
