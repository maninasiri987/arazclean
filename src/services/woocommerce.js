import { getSettings, setCatalogData } from "./catalog.js";

/**
 * لایهٔ اتصال به ووکامرس (WooCommerce REST API v3)
 * =================================================
 *
 * این فایل تنها نقطه‌ای است که با وردپرس/ووکامرس ارتباط برقرار می‌کند.
 * همهٔ کامپوننت‌ها از `catalog.js` داده می‌خوانند؛ وقتی این فایل داده را
 * با `setCatalogData()` وارد لایهٔ داده کند، فروشگاه خودکار به‌روز می‌شود.
 *
 * ── راه‌اندازی ─────────────────────────────────────────────
 * ۱) در تنظیمات ووکامرس (وردپرس) → Advanced → REST API یک کلید بسازید
 *    (خواندنی/نوشتنی — برای پنل مدیریت بهتر است Read/Write باشد).
 * ۲) مقادیر زیر را در `src/data/settings.json` قرار دهید:
 *    "woocommerce": {
 *      "consumerKey": "ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
 *      "consumerSecret": "cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
 *      "apiPath": "wp-json/wc/v3"
 *    }
 * ۳) مرورگر باید به دامنهٔ وردپرس دسترسی مستقیم داشته باشد — چون
 *    Consumer Key در کد سمت کلاینت می‌آید، برای محیط عملی حتماً
 *    یک پروکسی PHP (در همین سرویس قابل جاگذاری است) یا افزونهٔ
 *    CORS در وردپرس استفاده کنید. برای توسعهٔ محلی کافی است.
 *
 * اگر کلید خالی بماند، فروشگاه با دادهٔ نمونهٔ محلی (JSON) کار می‌کند.
 */

const DEFAULT_API_PATH = "wp-json/wc/v3";

// ---------- پیکربندی ----------
const wooConfig = () => {
  const { siteUrl, woocommerce } = getSettings();
  return {
    base: (siteUrl || "").replace(/\/+$/, ""),
    consumerKey: woocommerce?.consumerKey || "",
    consumerSecret: woocommerce?.consumerSecret || "",
    apiPath: woocommerce?.apiPath || DEFAULT_API_PATH,
  };
};

export const isWooConfigured = () => {
  const cfg = wooConfig();
  return Boolean(cfg.consumerKey && cfg.consumerSecret);
};

// ---------- درخواست پایه (Basic Auth مثل مستندات ووکامرس) ----------
const apiFetch = async (endpoint, params = {}) => {
  const cfg = wooConfig();
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const url = `${cfg.base}/${cfg.apiPath}/${endpoint}${qs ? `?${qs}` : ""}`;
  const auth = btoa(`${cfg.consumerKey}:${cfg.consumerSecret}`);
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WooCommerce API ${res.status}: ${endpoint} — ${body.slice(0, 200)}`);
  }
  return res.json();
};

// ---------- نگاشت دادهٔ ووکامرس به شکل دادهٔ فروشگاه ----------

/**
 * نگاشت محصول ووکامرس → محصول فروشگاه (catalog.js).
 * فیلدهای برند و دسته از محصول REST خوانده می‌شوند؛ اسلاگِ دسته و برند
 * هم از همان پاسخ (categories[].slug / attributes) می‌آید.
 */
export const mapWooProduct = (p) => {
  const category = p.categories?.[0] || {};
  const subcategory = p.categories?.[1] || null;
  // برند: به‌صورت یک ویژگی (attribute) سفارشی با نام «brand» در نظر گرفته می‌شود
  const brandAttr = (p.attributes || []).find(
    (a) => a.name?.toLowerCase() === "brand" || a.name === "برند"
  );
  const brandSlug = brandAttr?.options?.[0]?.toLowerCase().replace(/\s+/g, "-") || "";
  const images = (p.images || []).map((i) => i.src);

  const regularPrice = Number(p.regular_price || p.price || 0);
  const salePrice = Number(p.sale_price || p.price || 0);

  return {
    id: Number(p.id),
    title: p.name || "",
    slug: p.slug || "",
    brand: brandAttr?.options?.[0] || brandSlug || "",
    brandSlug,
    category: category.name || "",
    categorySlug: category.slug || "",
    subcategory: subcategory?.name || "",
    subcategorySlug: subcategory?.slug || "",
    description: p.description
      ? p.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : p.short_description
        ? p.short_description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        : "",
    specs: (p.attributes || [])
      .filter((a) => a.name !== "brand" && a.name !== "برند")
      .map((a) => ({ label: a.name || "", value: (a.options || []).join("، ") })),
    price: salePrice || regularPrice,
    oldPrice: salePrice && salePrice < regularPrice ? regularPrice : null,
    discount:
      salePrice && salePrice < regularPrice
        ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
        : 0,
    rating: Number(p.average_rating || 0),
    stock: Number(p.stock_quantity ?? (p.stock_status === "instock" ? 99 : 0)),
    badge: p.featured ? "پیشنهاد ویژه" : p.stock_status === "instock" ? "" : "",
    placeholder: "product",
    image: images[0] || null,
    images,
    featured: Boolean(p.featured),
    isNew: Boolean(p.related_ids?.length === 0) && false, // ووکامرس فیلد «جدید» ندارد
    comments: [], // نظرات جداگانه واکشی می‌شوند (fetchProductReviews)
  };
};

/** نگاشت دستهٔ ووکامرس → دستهٔ فروشگاه (زیردسته‌ها از محصولات استخراج می‌شوند) */
export const mapWooCategory = (c) => ({
  slug: c.slug || "",
  title: c.name || "",
  description: c.description || "",
  icon: "",
  placeholder: "category",
  featured: Boolean(c.image),
  subcategories: [], // بعداً هنگام بارگذاری محصولات پر می‌شود
});

/** نگاشت لوگوی برند — ووکامرس لوگوی برند ندارد؛ از تصویر دسته/محصول می‌توان استفاده کرد */
export const mapWooBrand = (b) => ({
  slug: b.slug || "",
  name: b.name || "",
  tagline: b.description || "",
  description: b.description || "",
  logo: b.image || null,
  placeholder: "brand",
  featured: Boolean(b.image),
});

// ---------- توابع عمومی ----------

/** همهٔ محصولات ووکامرس (صفحه‌به‌صفحه تا ۱۰۰) */
export const fetchWooProducts = async (per_page = 100) => {
  const all = [];
  let page = 1;
  for (;;) {
    const batch = await apiFetch("products", { per_page, page, status: "publish" });
    all.push(...batch.map(mapWooProduct));
    if (batch.length < per_page) break;
    page += 1;
  }
  return all;
};

/** نظرات یک محصول از ووکامرس */
export const fetchProductReviews = async (productId) => {
  const list = await apiFetch(`products/${productId}/reviews`, {
    per_page: 20,
    status: "approved",
  });
  return list.map((r) => ({
    name: r.reviewer || "",
    rating: Number(r.rating || 0),
    text: r.review || "",
    date: "",
    verified: Boolean(r.verified),
  }));
};

/** همهٔ دسته‌ها + برندها از ووکامرس */
export const fetchWooTaxonomies = async () => {
  const categories = await apiFetch("products/categories", { per_page: 100 });
  // برندها از ویژگی سفارشی «brand» خوانده می‌شوند (در ووکامرس → محصولات → ویژگی‌ها)
  let brands = [];
  try {
    const attr = await apiFetch("products/attributes", { per_page: 100 });
    const brandAttr = attr.find((a) => a.name?.toLowerCase() === "brand" || a.name === "برند");
    if (brandAttr) {
      const terms = await apiFetch(`products/attributes/${brandAttr.id}/terms`, {
        per_page: 100,
      });
      brands = terms.map(mapWooBrand);
    }
  } catch {
    brands = [];
  }
  return { categories: categories.map(mapWooCategory), brands };
};

// ---------- بارگذاری کامل (جایگزین دادهٔ نمونه) ----------

/**
 * همهٔ داده را از ووکامرس می‌خواند و داخل لایهٔ داده قرار می‌دهد.
 * زیردسته‌ها هم از دستهٔ محصولات ساخته می‌شوند تا ساختار فروشگاه حفظ شود.
 */
export const loadWooCatalog = async () => {
  if (!isWooConfigured()) return false;

  const [products, { categories, brands }] = await Promise.all([
    fetchWooProducts(),
    fetchWooTaxonomies(),
  ]);

  // زیردسته‌ها از دسته‌بندی دوم هر محصول ساخته می‌شوند
  const subByCat = {};
  products.forEach((p) => {
    if (p.categorySlug && p.subcategorySlug) {
      subByCat[p.categorySlug] = subByCat[p.categorySlug] || [];
      if (!subByCat[p.categorySlug].some((s) => s.slug === p.subcategorySlug)) {
        subByCat[p.categorySlug].push({
          slug: p.subcategorySlug,
          title: p.subcategory,
        });
      }
    }
  });
  const categoriesWithSubs = categories.map((c) => ({
    ...c,
    subcategories: subByCat[c.slug] || [],
  }));

  setCatalogData({ products, brands, categories: categoriesWithSubs });
  return true;
};
