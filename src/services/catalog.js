import productsData from "../data/products.json";
import categoriesData from "../data/categories.json";
import brandsData from "../data/brands.json";
import blogData from "../data/blog.json";
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
        (p.categorySlug === product.categorySlug || p.brandSlug === product.brandSlug)
    )
    .slice(0, limit);

export const getProductsByCategory = (categorySlug) =>
  productsData.filter((p) => p.categorySlug === categorySlug);

export const getProductsByBrand = (brandSlug) =>
  productsData.filter((p) => p.brandSlug === brandSlug);

// ---------- Categories ----------
export const getCategories = () => categoriesData;

export const getCategoryBySlug = (slug) =>
  categoriesData.find((c) => c.slug === slug) || null;

// ---------- Brands ----------
export const getBrands = () => brandsData;

export const getBrandBySlug = (slug) =>
  brandsData.find((b) => b.slug === slug) || null;

// ---------- Blog ----------
export const getBlogPosts = () => blogData;

export const getBlogPostBySlug = (slug) =>
  blogData.find((b) => b.slug === slug) || null;

export const getFeaturedBlogPosts = (limit = 3) => {
  const featured = blogData.filter((b) => b.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  // اگر مقالهٔ ویژهٔ کافی نبود، بقیه را از سایر مقالات پر می‌کنیم
  const rest = blogData.filter((b) => !b.featured);
  return [...featured, ...rest].slice(0, limit);
};

// ---------- Hero ----------
export const getHeroSlides = () => heroData;

// ---------- Navigation & settings ----------
export const getNavigation = () => navigationData;

export const getSettings = () => settingsData;
