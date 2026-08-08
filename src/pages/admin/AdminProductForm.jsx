import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, ImagePlus, Package, Save, Tags } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { getCategories } from "../../services/catalog.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

/**
 * فرم محصول — هم برای ایجاد جدید هم ویرایش محصول موجود.
 * از StoreContext برای افزودن/به‌روزرسانی استفاده می‌کند و پس از ثبت
 * به‌صفحهٔ لیست برمی‌گردد. آپلود واقعی تصویر در این نسخه حذف است؛
 * فقط مسیر تصویر به‌عنوان متن نگه داشته می‌شود.
 */
export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { products, brands, addProduct, updateProduct } = useStore();
  const categories = getCategories();

  const existing = useMemo(
    () => (isEdit ? products.find((p) => p.id === Number(id)) : null),
    [id, isEdit, products]
  );

  const [form, setForm] = useState(() => ({
    title: "",
    slug: "",
    brand: "",
    subcategory: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: 10,
    rating: "4.5",
    badge: "",
    image: "",
    featured: false,
    isNew: false,
  }));

  const [categorySlug, setCategorySlug] = useState("");
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // بارگذاری مقادیر موجود هنگام ویرایش
  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        // سلکت برند مقدار slug می‌گیرد؛ برای پیش‌انتخاب درست باید اسلاگ باشد
        brand: existing.brandSlug || existing.brand,
        subcategory: existing.subcategory,
        description: existing.description,
        price: String(existing.price),
        oldPrice: existing.oldPrice ? String(existing.oldPrice) : "",
        stock: existing.stock,
        rating: String(existing.rating),
        badge: existing.badge || "",
        image: existing.image || "",
        featured: existing.featured,
        isNew: existing.isNew,
      });
      setCategorySlug(existing.categorySlug);
    }
  }, [existing]);

  const selectedCategory = categories.find((c) => c.slug === categorySlug);
  const brandMeta = brands.find((b) => b.slug === form.brand);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = { ...form };
    const errs = {};
    if (!next.title.trim()) errs.title = "عنوان محصول را وارد کنید";
    if (!categorySlug) errs.category = "دسته‌بندی را انتخاب کنید";
    if (!form.subcategory) errs.subcategory = "زیردسته را انتخاب کنید";
    if (!form.brand) errs.brand = "برند را انتخاب کنید";
    if (!next.price || Number(next.price) <= 0)
      errs.price = "قیمت معتبر وارد کنید";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const base = {
      title: next.title.trim(),
      slug:
        next.slug.trim() ||
        next.title
          .trim()
          .replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-")
          .replace(/^-|-$/g, "") || "product",
      brand: brandMeta?.name || (isEdit ? existing?.brand : form.brand),
      brandSlug: brandMeta?.slug || (isEdit ? existing?.brandSlug : form.brand),
      category: selectedCategory?.title,
      categorySlug: selectedCategory?.slug,
      subcategory:
        selectedCategory?.subcategories?.find((s) => s.slug === form.subcategory)?.title,
      subcategorySlug: form.subcategory,
      description: next.description,
price: Number(next.price),
      oldPrice: next.oldPrice ? Number(next.oldPrice) : null,
      discount:
        next.oldPrice && Number(next.oldPrice) > Number(next.price)
          ? Math.round(((Number(next.oldPrice) - Number(next.price)) / Number(next.oldPrice)) * 100)
          : 0,
      rating: Number(next.rating),
      stock: Number(next.stock),
      badge: next.badge,
      placeholder: "product",
      image: next.image,
      featured: next.featured,
      isNew: next.isNew,
    };

    if (isEdit) {
      updateProduct(Number(id), base);
    } else {
      addProduct(base);
    }
    setSaved(true);
    setTimeout(() => navigate("/admin/products"), 500);
  };

  if (isEdit && !existing) {
    return (
      <div className="rounded-card border border-line bg-card p-8 text-center text-sm text-muted">
        محصول یافت نشد.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">
          {isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}
        </h1>
        <Button type="submit">
          <Save className="size-4" aria-hidden="true" />
          {isEdit ? "ذخیره تغییرات" : "ثبت محصول"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* اطلاعات پایه */}
        <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-ink">
            <Package className="size-4 text-brand-600" aria-hidden="true" />
            اطلاعات پایه
          </h2>
          <Input
            label="عنوان محصول"
            name="title"
            placeholder="مثال: مایع ظرف‌شویی لیمو ۱ لیتری"
            value={form.title}
            onChange={update("title")}
            error={errors.title}
          />
          <Input
            label="اسلاگ (اختیاری — اگر خالی بماند از عنوان ساخته می‌شود)"
            name="slug"
            placeholder="dishwashing-liquid-lemon-1l"
            value={form.slug}
            onChange={update("slug")}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink" htmlFor="sel-cat">
                دسته‌بندی
              </label>
              <select
                id="sel-cat"
                value={categorySlug}
                onChange={(e) => {
                  setCategorySlug(e.target.value);
                  setForm((prev) => ({ ...prev, subcategory: "" }));
                }}
                className="w-full cursor-pointer rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              >
                <option value="">انتخاب دسته…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.title}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.category}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink" htmlFor="subcat">
                زیردسته
              </label>
              <select
                id="subcat"
                value={form.subcategory}
                disabled={!selectedCategory}
                onChange={update("subcategory")}
                className="w-full cursor-pointer rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              >
                <option value="">انتخاب زیردسته…</option>
                {selectedCategory?.subcategories?.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.subcategory}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink" htmlFor="brand">
              برند
            </label>
            <select
              id="brand"
              value={form.brand}
              onChange={update("brand")}
              className="w-full cursor-pointer rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            >
              <option value="">انتخاب برند…</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            {errors.brand && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.brand}</p>
            )}
          </div>
        </section>

        {/* قیمت و موجودی */}
        <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-ink">
            <Tags className="size-4 text-brand-600" aria-hidden="true" />
            قیمت و موجودی
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="قیمت (تومان)"
              name="price"
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={update("price")}
              error={errors.price}
            />
            <Input
              label="قیمت قبلی (اختیاری)"
              name="oldPrice"
              type="number"
              inputMode="numeric"
              value={form.oldPrice}
              onChange={update("oldPrice")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="موجودی (عدد)"
              name="stock"
              type="number"
              inputMode="numeric"
              value={form.stock}
              onChange={update("stock")}
            />
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink" htmlFor="rating">
                امتیاز (از ۵)
              </label>
              <select
                id="rating"
                value={form.rating}
                onChange={update("rating")}
                className="w-full cursor-pointer rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              >
                {["5", "4.5", "4", "3.5", "3"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="نشان محصول (اختیاری)"
            name="badge"
            placeholder="پرفروش / جدید / تخفیف ویژه / پیشنهاد ویژه"
            value={form.badge}
            onChange={update("badge")}
          />
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={update("featured")}
                className="size-4 accent-brand-500"
              />
              محصول ویژه (نمایش در بخش پیشنهادها)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={update("isNew")}
                className="size-4 accent-brand-500"
              />
              محصول جدید
            </label>
          </div>
        </section>

        {/* توضیحات */}
        <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-black text-ink">
            <FileText className="size-4 text-brand-600" aria-hidden="true" />
            توضیحات
          </h2>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={update("description")}
            placeholder="توضیحات کامل محصول…"
            className="w-full resize-y rounded-xl border border-line bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
        </section>

        {/* تصویر */}
        <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-black text-ink">
            <ImagePlus className="size-4 text-brand-600" aria-hidden="true" />
            تصویر محصول
          </h2>
          <Input
            label="مسیر تصویر (اختیاری)"
            name="image"
            placeholder="/images/products/product-1.webp"
            hint="در این نسخهٔ نمایشی، فقط مسیر تصویر ثبت می‌شود؛ آپلود واقعی بعداً از ووکامرس می‌آید."
            value={form.image}
            onChange={update("image")}
          />
        </section>
      </div>

      {saved && (
        <p className="rounded-card bg-success-50 px-4 py-3 text-sm font-bold text-success-600">
          {isEdit ? "تغییرات ذخیره شد ✓" : "محصول ثبت شد ✓"} — در حال بازگشت به فهرست…
        </p>
      )}
    </form>
  );
}