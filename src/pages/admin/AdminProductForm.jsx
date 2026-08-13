import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  ImagePlus,
  MessageSquareQuote,
  Package,
  Plus,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { getCategories, getAllBrands } from "../../services/catalog.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import SmartImage from "../../components/ui/SmartImage.jsx";
import ImageSelect from "../../components/ui/ImageSelect.jsx";
import ImageUploader from "../../components/ui/ImageUploader.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";

/** ایموجی دسته‌ها — هم‌راستا با منوی فروشگاه */
const catEmoji = {
  laundry: "🧴",
  dishwashing: "🍽️",
  "home-cleaning": "🏠",
  "personal-care": "🧴",
  "baby-care": "👶",
  tissue: "🧻",
  "cleaning-tools": "🧹",
  disinfectants: "🦠",
  special: "⭐",
};

const EMPTY_SPEC = { label: "", value: "" };
const EMPTY_COMMENT = { name: "", rating: 5, text: "", date: "", verified: true };

/**
 * فرم محصول — هم برای ایجاد جدید هم ویرایش محصول موجود.
 * با پیش‌نمایش زندهٔ کارت محصول (همان کامپوننت فروشگاه) + ویرایش همهٔ بخش‌ها:
 * تصویر و گالری، برند، دسته‌بندی، قیمت، مشخصات، توضیحات و نظرات.
 * داده‌ها از StoreContext (نمایشی) خوانده/نوشته می‌شوند؛ هنگام اتصال به
 * ووکامرس فقط لایهٔ داده (catalog.js) جایگزین می‌شود.
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

  // همهٔ برندها: برندهای ثبت‌شده در فروشگاه + همهٔ برندهای تعریف‌شده در برندهای.json
  // تا در فرم بتوان هر برندی را بدون نیاز به داشتن محصول قبلی انتخاب کرد.
  const brandOptions = useMemo(() => {
    const map = new Map();
    brands.forEach((b) => map.set(b.slug, b));
    getAllBrands().forEach((b) => {
      if (!map.has(b.slug)) map.set(b.slug, b);
    });
    return Array.from(map.values());
  }, [brands]);

  const [form, setForm] = useState(() => ({
    title: "",
    slug: "",
    brand: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: 10,
    rating: "4.5",
    badge: "",
    images: [],
    specs: [EMPTY_SPEC],
    comments: [],
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
        // سلکت‌ها مقدار slug می‌گیرند؛ برای پیش‌انتخاب درست باید اسلاگ باشند
        brand: existing.brandSlug || existing.brand,
        description: existing.description,
        price: String(existing.price),
        oldPrice: existing.oldPrice ? String(existing.oldPrice) : "",
        stock: existing.stock,
        rating: String(existing.rating),
        badge: existing.badge || "",
        images: (existing.images && existing.images.length
          ? existing.images
          : existing.image
            ? [existing.image]
            : []
        ).filter(Boolean),
        specs:
          existing.specs && existing.specs.length
            ? existing.specs.map((s) => ({ label: s.label, value: s.value }))
            : [EMPTY_SPEC],
        comments: existing.comments ? [...existing.comments] : [],
        featured: existing.featured,
        isNew: existing.isNew,
      });
      setCategorySlug(existing.categorySlug);
    }
  }, [existing]);

  const selectedCategory = categories.find((c) => c.slug === categorySlug);
  const brandMeta = brandOptions.find((b) => b.slug === form.brand);

  // گزینه‌های سلکت‌ها — با لوگو/ایموجی برای نمایش در ImageSelect
  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: c.title,
    emoji: catEmoji[c.slug] || "🧴",
  }));
  const brandSelectOptions = brandOptions.map((b) => ({
    value: b.slug,
    label: b.name,
    image: b.logo || undefined,
    letter: !b.logo ? b.name.slice(0, 1) : undefined,
  }));

  const update = (field) => (valueOrEvent) => {
    // ImageSelect مقدار خام می‌فرستد؛ input ها رویداد می‌فرستند — هر دو پشتیبانی می‌شود
    const value =
      valueOrEvent?.target !== undefined
        ? valueOrEvent.target.type === "checkbox"
          ? valueOrEvent.target.checked
          : valueOrEvent.target.value
        : valueOrEvent;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ---------- گالری تصاویر ----------
  const [newImage, setNewImage] = useState("");

  const addImage = () => {
    const src = newImage.trim();
    if (!src) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, src] }));
    setNewImage("");
  };

  const removeImage = (idx) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));

  // ---------- مشخصات ----------
  const updateSpec = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));

  const addSpec = () =>
    setForm((prev) => ({ ...prev, specs: [...prev.specs, EMPTY_SPEC] }));

  const removeSpec = (idx) =>
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));

  // ---------- نظرات ----------
  const updateComment = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      comments: prev.comments.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      ),
    }));

  const addComment = () =>
    setForm((prev) => ({ ...prev, comments: [...prev.comments, EMPTY_COMMENT] }));

  const removeComment = (idx) =>
    setForm((prev) => ({
      ...prev,
      comments: prev.comments.filter((_, i) => i !== idx),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = { ...form };
    const errs = {};
    if (!next.title.trim()) errs.title = "عنوان محصول را وارد کنید";
    if (!categorySlug) errs.category = "دسته‌بندی را انتخاب کنید";
    if (!form.brand) errs.brand = "برند را انتخاب کنید";
    if (!next.price || Number(next.price) <= 0)
      errs.price = "قیمت معتبر وارد کنید";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const specs = next.specs
      .filter((s) => s.label.trim() && s.value.trim())
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }));
    const comments = next.comments.filter((c) => c.name.trim() && c.text.trim());
    const images = next.images.filter(Boolean);

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
      // زیردسته در فرم ادمین حذف شده؛ هنگام ویرایش همان مقدار قبلی حفظ می‌شود
      subcategory: isEdit ? existing?.subcategory || "" : "",
      subcategorySlug: isEdit ? existing?.subcategorySlug || "" : "",
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
      image: images[0] || null,
      images,
      specs,
      comments,
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

  // ---------- پیش‌نمایش زنده (همان کامپوننت فروشگاه) ----------
  const previewProduct = useMemo(() => {
    const images = form.images.filter(Boolean);
    const specs = form.specs.filter((s) => s.label.trim() && s.value.trim());
    return {
      id: existing?.id || 0,
      title: form.title.trim() || "عنوان محصول",
      slug: form.slug.trim() || "product-slug",
      brand: brandMeta?.name || "برند",
      brandSlug: brandMeta?.slug || "",
      category: selectedCategory?.title || "دسته‌بندی",
      categorySlug: selectedCategory?.slug || "",
      subcategory: existing?.subcategory || "",
      subcategorySlug: existing?.subcategorySlug || "",
      description: form.description || "توضیحات محصول…",
      specs,
      comments: form.comments.filter((c) => c.name.trim() && c.text.trim()),
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      discount:
        form.oldPrice && Number(form.oldPrice) > Number(form.price)
          ? Math.round(
              ((Number(form.oldPrice) - Number(form.price)) / Number(form.oldPrice)) * 100
            )
          : 0,
      rating: Number(form.rating) || 0,
      stock: Number(form.stock) || 0,
      badge: form.badge || "",
      placeholder: "product",
      image: images[0] || null,
      images,
      featured: form.featured,
      isNew: form.isNew,
    };
  }, [form, existing, brandMeta, selectedCategory]);

  if (isEdit && !existing) {
    return (
      <div className="rounded-card border border-line bg-card p-8 text-center text-sm text-muted">
        محصول یافت نشد.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* دکمهٔ بازگشت به فهرست محصولات */}
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="flex cursor-pointer items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-brand-600"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
        بازگشت به فهرست محصولات
      </button>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">
          {isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}
        </h1>
        <Button type="submit">
          <Save className="size-4" aria-hidden="true" />
          {isEdit ? "ذخیره تغییرات" : "ثبت محصول"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* ─────── ستون فرم ─────── */}
        <div className="space-y-6">
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
              <ImageSelect
                label="دسته‌بندی"
                value={categorySlug}
                onChange={(v) => setCategorySlug(v)}
                options={categoryOptions}
                placeholder="انتخاب دسته…"
                error={errors.category}
              />
              <ImageSelect
                label="برند"
                value={form.brand}
                onChange={update("brand")}
                options={brandSelectOptions}
                placeholder="انتخاب برند…"
                error={errors.brand}
              />
            </div>
          </section>

          {/* قیمت و موجودی */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <Tags className="size-4 text-brand-600" aria-hidden="true" />
              قیمت و موجودی
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <Input
                label="موجودی (عدد)"
                name="stock"
                type="number"
                inputMode="numeric"
                value={form.stock}
                onChange={update("stock")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Input
                label="نشان محصول (اختیاری)"
                name="badge"
                placeholder="پرفروش / جدید / تخفیف ویژه / پیشنهاد ویژه"
                value={form.badge}
                onChange={update("badge")}
              />
            </div>
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

          {/* تصویر و گالری */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <ImagePlus className="size-4 text-brand-600" aria-hidden="true" />
              تصاویر محصول
            </h2>
            <div className="space-y-3 rounded-xl border border-dashed border-line bg-background/50 p-4">
              <ImageUploader
                value={newImage}
                onChange={(v) => setNewImage(v)}
                label="تصویر جدید"
                hint="یک تصویر از سیستم انتخاب کنید یا مسیر را بنویسید، سپس «افزودن» بزنید."
                previewSize="size-20"
              />
              <div className="flex gap-2">
                <Input
                  label=""
                  name="newImagePath"
                  placeholder="/images/products/product-1.webp"
                  value={newImage.startsWith("data:") ? "" : newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addImage} className="self-end">
                  <Plus className="size-4" aria-hidden="true" />
                  افزودن
                </Button>
              </div>
            </div>
            {form.images.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line bg-background p-6 text-center text-xs text-muted">
                هنوز تصویری ثبت نشده است — تصویر اول به‌عنوان تصویر اصلی محصول استفاده می‌شود.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {form.images.map((src, idx) => (
                  <div key={`${src}-${idx}`} className="group relative">
                    <SmartImage
                      src={src}
                      alt={`تصویر ${idx + 1}`}
                      className="size-20 overflow-hidden rounded-xl border border-line bg-background"
                      imgClassName="h-full w-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        اصلی
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label={`حذف تصویر ${idx + 1}`}
                      className="absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-muted">
              تصویر انتخاب‌شده از سیستم به‌صورت فشرده ذخیره می‌شود؛ در نسخهٔ ووکامرس تصویر از سرور وردپرس می‌آید.
            </p>
          </section>

          {/* مشخصات */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black text-ink">
                <FileText className="size-4 text-brand-600" aria-hidden="true" />
                مشخصات فنی
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="size-3.5" aria-hidden="true" />
                افزودن مشخصه
              </Button>
            </div>
            <div className="space-y-3">
              {form.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    label=""
                    placeholder="عنوان (مثل: حجم)"
                    value={spec.label}
                    onChange={(e) => updateSpec(idx, "label", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    label=""
                    placeholder="مقدار (مثل: ۱ لیتر)"
                    value={spec.value}
                    onChange={(e) => updateSpec(idx, "value", e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    aria-label="حذف مشخصه"
                    className="flex size-10 shrink-0 cursor-pointer items-center justify-center self-start rounded-xl text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* توضیحات */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <FileText className="size-4 text-brand-600" aria-hidden="true" />
              توضیحات
            </h2>
            <textarea
              name="description"
              rows={5}
              value={form.description}
              onChange={update("description")}
              placeholder="توضیحات کامل محصول…"
              className="w-full resize-y rounded-xl border border-line bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </section>

          {/* نظرات */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black text-ink">
                <MessageSquareQuote className="size-4 text-brand-600" aria-hidden="true" />
                نظرات مشتریان
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addComment}>
                <Plus className="size-3.5" aria-hidden="true" />
                افزودن نظر
              </Button>
            </div>
            {form.comments.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line bg-background p-6 text-center text-xs text-muted">
                نظری ثبت نشده است.
              </p>
            ) : (
              <div className="space-y-4">
                {form.comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-line bg-background/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        <Input
                          label="نام مشتری"
                          placeholder="مثلاً مریم احمدی"
                          value={comment.name}
                          onChange={(e) => updateComment(idx, "name", e.target.value)}
                        />
                        <div>
                          <label className="mb-1.5 block text-sm font-bold text-ink">
                            امتیاز
                          </label>
                          <select
                            value={comment.rating}
                            onChange={(e) =>
                              updateComment(idx, "rating", Number(e.target.value))
                            }
                            className="w-full cursor-pointer rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                          >
                            {["5", "4.5", "4", "3.5", "3", "2.5", "2", "1"].map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeComment(idx)}
                        aria-label="حذف نظر"
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-ink">
                          متن نظر
                        </label>
                        <textarea
                          rows={2}
                          value={comment.text}
                          onChange={(e) => updateComment(idx, "text", e.target.value)}
                          placeholder="متن نظر مشتری…"
                          className="w-full resize-y rounded-xl border border-line bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-ink">
                          تاریخ (اختیاری)
                        </label>
                        <Input
                          label=""
                          placeholder="مثل: ۳ روز پیش"
                          value={comment.date}
                          onChange={(e) => updateComment(idx, "date", e.target.value)}
                        />
                        <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-bold text-ink">
                          <input
                            type="checkbox"
                            checked={comment.verified}
                            onChange={(e) =>
                              updateComment(idx, "verified", e.target.checked)
                            }
                            className="size-3.5 accent-brand-500"
                          />
                          خریدار تأییدشده
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ─────── ستون پیش‌نمایش ─────── */}
        <aside className="space-y-4 xl:sticky xl:top-[74px] xl:self-start">
          <div className="rounded-card border border-line bg-card p-4 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
              <Package className="size-4 text-brand-600" aria-hidden="true" />
              پیش‌نمایش زنده (کارت محصول)
            </h2>
            <p className="mb-4 text-[11px] leading-5 text-muted">
              همین کامپوننت در صفحهٔ اصلی و فهرست محصولات فروشگاه نمایش داده می‌شود؛
              تغییرات را اینجا زنده ببینید.
            </p>
            <ProductCard product={previewProduct} />
          </div>
        </aside>
      </div>

      {saved && (
        <p className="rounded-card bg-success-50 px-4 py-3 text-sm font-bold text-success-600">
          {isEdit ? "تغییرات ذخیره شد ✓" : "محصول ثبت شد ✓"} — در حال بازگشت به فهرست…
        </p>
      )}
    </form>
  );
}
