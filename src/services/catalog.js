import productsSeed from "../data/products.json";
import categoriesSeed from "../data/categories.json";
import brandsSeed from "../data/brands.json";
import heroSeed from "../data/hero.json";
import navigationSeed from "../data/navigation.json";
import settingsSeed from "../data/settings.json";

/**
 * لایهٔ دسترسی به داده — تنها نقطه‌ای که با داده در ارتباط است.
 * در آینده برای اتصال به ووکامرس، فقط توابع همین فایل بازنویسی می‌شوند.
 *
 * داده‌ها متغیر درون ماژول هستند تا پنل مدیریت (AdminStore) بتواند
 * آن‌ها را به‌روزرسانی کند و همهٔ کامپوننت‌ها خودکار تغییرات را ببینند.
 */

// ---------- state داخلی (پیش‌فرض از فایل‌های JSON) ----------
let productsData = [...productsSeed];
let categoriesData = [...categoriesSeed];
let brandsData = [...brandsSeed];
let heroData = [...heroSeed];
let navigationData = { ...navigationSeed };
let settingsData = { ...settingsSeed };

/**
 * همگام‌سازی داده از پنل مدیریت یا ووکامرس — بعد از تغییر، همهٔ صداهای بعدی
 * (محصولات، شمارنده‌ها، اسلایدر و…) مقدارهای جدید را برمی‌گردانند.
 */
export const setCatalogData = ({ products, brands, hero, categories, settings } = {}) => {
  if (products) productsData = [...products];
  if (brands) brandsData = [...brands];
  if (hero) heroData = [...hero];
  if (categories) categoriesData = [...categories];
  if (settings) settingsData = { ...settings };
};

// ---------- Product counts (هر بار شمرده می‌شوند — حجم داده کوچک است) ----------
const countBy = (list) => {
  const m = {};
  list.forEach((p) => {
    m[p.categorySlug] = (m[p.categorySlug] || 0) + 1;
    if (p.subcategorySlug)
      m[`${p.categorySlug}/${p.subcategorySlug}`] =
        (m[`${p.categorySlug}/${p.subcategorySlug}`] || 0) + 1;
    m[`brand:${p.brandSlug}`] = (m[`brand:${p.brandSlug}`] || 0) + 1;
  });
  return m;
};

export const getCategoriesWithCounts = () => {
  const counts = countBy(productsData);
  return categoriesData.map((cat) => ({
    ...cat,
    productCount: counts[cat.slug] || 0,
    subcategoryCounts: cat.subcategories?.map((sub) => ({
      ...sub,
      productCount: counts[`${cat.slug}/${sub.slug}`] || 0,
    })),
  }));
};

export const getBrandsWithCounts = () => {
  const counts = countBy(productsData);
  const seen = new Map();
  productsData.forEach((p) => {
    if (!seen.has(p.brandSlug)) {
      seen.set(p.brandSlug, { slug: p.brandSlug, name: p.brand });
    }
  });
  return Array.from(seen.values()).map((brand) => {
    const meta = brandsData.find((b) => b.slug === brand.slug) || {};
    return {
      ...meta,
      ...brand,
      productCount: counts[`brand:${brand.slug}`] || 0,
    };
  });
};

export const getProductCountByBrand = (slug) => {
  const counts = countBy(productsData);
  return counts[`brand:${slug}`] || 0;
};
export const getCategoryProductCount = (slug) => {
  const counts = countBy(productsData);
  return counts[slug] || 0;
};
export const getSubcategoryProductCount = (catSlug, subSlug) => {
  const counts = countBy(productsData);
  return counts[`${catSlug}/${subSlug}`] || 0;
};
export const getTotalProductCount = () => productsData.length;

// ---------- Products ----------
export const getProducts = () => productsData;

export const getProductBySlug = (slug) =>
  productsData.find((p) => p.slug === slug) || null;

export const getProductById = (id) =>
  productsData.find((p) => p.id === Number(id)) || null;

export const getFeaturedProducts = (limit = 8) =>
  productsData.filter((p) => p.featured).slice(0, limit);

export const getNewProducts = (limit = 8) =>
  productsData.filter((p) => p.isNew).slice(0, limit);

export const getRelatedProducts = (product, limit = 4) =>
  productsData
    .filter((p) => {
      if (p.id === product.id) return false;
      // زیردسته فقط وقتی مقایسه شود که هر دو محصول زیردسته دارند؛
      // وگرنه محصولات بدون زیردسته (اضافه‌شده از ادمین) همه را هم‌خانواده نشان می‌دهند.
      const sameSub =
        Boolean(p.subcategorySlug && product.subcategorySlug) &&
        p.subcategorySlug === product.subcategorySlug;
      return (
        p.categorySlug === product.categorySlug ||
        sameSub ||
        p.brandSlug === product.brandSlug
      );
    })
    .slice(0, limit);

export const getProductsByCategory = (categorySlug) =>
  productsData.filter((p) => p.categorySlug === categorySlug);

export const getProductsBySubcategory = (categorySlug, subcategorySlug) =>
  productsData.filter(
    (p) =>
      p.categorySlug === categorySlug && p.subcategorySlug === subcategorySlug
  );

export const getProductsByBrand = (brandSlug) =>
  productsData.filter((p) => p.brandSlug === brandSlug);

// ---------- Categories ----------
export const getCategories = () => categoriesData;
export const getCategoryBySlug = (slug) =>
  categoriesData.find((c) => c.slug === slug) || null;

// ---------- Brands ----------
export const getBrands = () => {
  const seen = new Map();
  productsData.forEach((p) => {
    if (!seen.has(p.brandSlug)) {
      seen.set(p.brandSlug, { slug: p.brandSlug, name: p.brand });
    }
  });
  return Array.from(seen.values()).map((brand) => {
    const meta = brandsData.find((b) => b.slug === brand.slug) || {};
    return { ...meta, ...brand };
  });
};

export const getBrandBySlug = (slug) =>
  brandsData.find((b) => b.slug === slug) ||
  getProducts().find((p) => p.brandSlug === slug) ||
  null;

/** همهٔ برندهای تعریف‌شده (از برندهای.json) — برای سلکت فرم محصول در پنل مدیریت */
export const getAllBrands = () => brandsData;

// ---------- Hero ----------
export const getHeroSlides = () => heroData;

// ---------- Navigation & settings ----------
export const getNavigation = () => navigationData;
export const getSettings = () => settingsData;