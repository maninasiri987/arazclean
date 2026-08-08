import productsData from "../data/products.json";
import categoriesData from "../data/categories.json";
import brandsData from "../data/brands.json";
import heroData from "../data/hero.json";
import navigationData from "../data/navigation.json";
import settingsData from "../data/settings.json";

/**
 * لایهٔ دسترسی به داده — تنها نقطه‌ای که با داده در ارتباط است.
 * در آینده برای اتصال به ووکامرس، فقط توابع همین فایل بازنویسی می‌شوند.
 */

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
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug ||
          p.subcategorySlug === product.subcategorySlug ||
          p.brandSlug === product.brandSlug)
    )
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

// ---------- Brands (پویا — از دادهٔ محصولات استخراج می‌شوند) ----------
/**
 * برندهای یکتا که محصول دارند — با ادغام متادیتای برند (توضیح، لوگو و…).
 * اگر برندی در `brands.json` باشد اما محصولی نداشته باشد، نمایش داده نمی‌شود.
 */
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
  getBrands().find((b) => b.slug === slug) || null;

// ---------- Hero ----------
export const getHeroSlides = () => heroData;

// ---------- Navigation & settings ----------
export const getNavigation = () => navigationData;

export const getSettings = () => settingsData;
