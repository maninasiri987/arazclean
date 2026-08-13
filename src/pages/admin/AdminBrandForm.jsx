import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ImagePlus, Package, Save, Sparkles, Tags } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { getProducts } from "../../services/catalog.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import ImageUploader from "../../components/ui/ImageUploader.jsx";
import BrandCard from "../../components/home/BrandCard.jsx";
import { formatNumber } from "../../utils/format.js";

/**
 * فرم برند — هم برای ایجاد جدید هم ویرایش برند موجود.
 * با پیش‌نمایش زندهٔ کارت برند (همان کامپوننت فروشگاه) + ویرایش همهٔ بخش‌ها:
 * نام، اسلاگ، شعار، توضیحات، لوگو و برند ویژه.
 */
export default function AdminBrandForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug && slug !== "new");

  const { brands, addBrand, updateBrand } = useStore();
  const products = getProducts();

  const existing = useMemo(
    () => (isEdit ? brands.find((b) => b.slug === slug) : null),
    [slug, isEdit, brands]
  );

  const [form, setForm] = useState({
    slug: "",
    name: "",
    tagline: "",
    description: "",
    logo: "",
    featured: false,
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // بارگذاری مقادیر موجود هنگام ویرایش
  useEffect(() => {
    if (existing) {
      setForm({
        slug: existing.slug,
        name: existing.name,
        tagline: existing.tagline || "",
        description: existing.description || "",
        logo: existing.logo || "",
        featured: existing.featured,
      });
    }
  }, [existing]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "نام برند را وارد کنید";
    const cleanSlug = form.slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleanSlug) errs.slug = "اسلاگ را وارد کنید";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      slug: cleanSlug,
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      logo: form.logo.trim() || null,
      placeholder: "brand",
      featured: form.featured,
    };

    if (isEdit) {
      updateBrand(existing.slug, payload);
    } else {
      addBrand(payload);
    }
    setSaved(true);
    setTimeout(() => navigate("/admin/brands"), 500);
  };

  // پیش‌نمایش زنده — همون کارت برند فروشگاه
  const previewBrand = useMemo(
    () => ({
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-") || "brand-slug",
      name: form.name.trim() || "نام برند",
      tagline: form.tagline || "",
      description: form.description || "",
      logo: form.logo.trim() || null,
      placeholder: "brand",
      featured: form.featured,
    }),
    [form]
  );

  const productCount = useMemo(
    () => products.filter((p) => p.brandSlug === (isEdit ? existing?.slug : previewBrand.slug)).length,
    [products, isEdit, existing, previewBrand.slug]
  );

  if (isEdit && !existing) {
    return (
      <div className="rounded-card border border-line bg-card p-8 text-center text-sm text-muted">
        برند یافت نشد.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* دکمهٔ بازگشت به فهرست برندها */}
      <button
        type="button"
        onClick={() => navigate("/admin/brands")}
        className="flex cursor-pointer items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-brand-600"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
        بازگشت به فهرست برندها
      </button>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">
          {isEdit ? "ویرایش برند" : "افزودن برند جدید"}
        </h1>
        <Button type="submit">
          <Save className="size-4" aria-hidden="true" />
          {isEdit ? "ذخیره تغییرات" : "ثبت برند"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* ─────── ستون فرم ─────── */}
        <div className="space-y-6">
          {/* اطلاعات پایه */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <Tags className="size-4 text-brand-600" aria-hidden="true" />
              اطلاعات پایه
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="نام برند"
                name="name"
                placeholder="مثال: فیری"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
              />
              <Input
                label="اسلاگ"
                name="slug"
                placeholder="my-brand"
                value={form.slug}
                onChange={update("slug")}
                error={errors.slug}
              />
            </div>
            <Input
              label="شعار (اختیاری)"
              name="tagline"
              placeholder="قدرت پاک‌کنندگی ما"
              value={form.tagline}
              onChange={update("tagline")}
            />
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink" htmlFor="b-desc">
                توضیحات
              </label>
              <textarea
                id="b-desc"
                rows={4}
                value={form.description}
                onChange={update("description")}
                placeholder="توضیحات کامل برند…"
                className="w-full resize-y rounded-xl border border-line bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />
            </div>
          </section>

          {/* لوگو */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <ImagePlus className="size-4 text-brand-600" aria-hidden="true" />
              لوگوی برند
            </h2>
            <ImageUploader
              value={form.logo}
              onChange={(v) => update("logo")({ target: { value: v, type: "text" } })}
              label="لوگو"
              hint="یک تصویر لوگو از سیستم انتخاب کنید — خودکار کوچک و ذخیره می‌شود. خالی = نمایش حرف اول نام برند."
              shape="rounded-full"
            />
            <Input
              label="یا مسیر لوگو (اختیاری)"
              name="logo"
              placeholder="/images/brands/bref.webp"
              value={form.logo}
              onChange={update("logo")}
            />
          </section>

          {/* وضعیت */}
          <section className="rounded-card border border-line bg-card p-5 shadow-card space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-ink">
              <Sparkles className="size-4 text-brand-600" aria-hidden="true" />
              وضعیت نمایش
            </h2>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={update("featured")}
                className="size-4 accent-brand-500"
              />
              برند ویژه (نشان «ویژه» در پنل و صفحهٔ برندها)
            </label>
            <p className="text-[11px] leading-5 text-muted">
              نمایش در صفحهٔ اصلی فقط بر اساس داشتن محصول است؛ این گزینه فقط برچسب «ویژه» را کنترل می‌کند.
            </p>
          </section>
        </div>

        {/* ─────── ستون پیش‌نمایش ─────── */}
        <aside className="space-y-4 xl:sticky xl:top-[74px] xl:self-start">
          <div className="rounded-card border border-line bg-card p-4 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
              <Package className="size-4 text-brand-600" aria-hidden="true" />
              پیش‌نمایش زنده (کارت برند)
            </h2>
            <p className="mb-4 text-[11px] leading-5 text-muted">
              همین کارت در بخش «برندهای معتبر» صفحهٔ اصلی نمایش داده می‌شود؛ تغییرات را اینجا زنده ببینید.
            </p>
            <div className="flex justify-center rounded-xl border border-dashed border-line bg-background/50 py-6">
              <BrandCard brand={previewBrand} />
            </div>
            <div className="mt-4 border-t border-line pt-3 text-xs text-muted">
              <span className="font-bold text-ink">{formatNumber(productCount)}</span> محصول از این برند
            </div>
          </div>
        </aside>
      </div>

      {saved && (
        <p className="rounded-card bg-success-50 px-4 py-3 text-sm font-bold text-success-600">
          {isEdit ? "تغییرات ذخیره شد ✓" : "برند ثبت شد ✓"} — در حال بازگشت به فهرست…
        </p>
      )}
    </form>
  );
}
