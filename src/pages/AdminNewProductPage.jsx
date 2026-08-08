import { forwardRef, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  Eraser,
  FileText,
  ImagePlus,
  Layers,
  Package,
  Save,
  Tags,
  UploadCloud,
  X,
} from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Rating from "../components/ui/Rating.jsx";
import ImagePlaceholder from "../components/ui/ImagePlaceholder.jsx";
import {
  getBrands,
  getCategories,
  getCategoryBySlug,
} from "../services/catalog.js";
import { useToast } from "../context/ToastContext.jsx";
import { formatPrice } from "../utils/format.js";

const BADGE_OPTIONS = [
  { value: "", label: "بدون نشان" },
  { value: "پرفروش", label: "پرفروش" },
  { value: "جدید", label: "جدید" },
  { value: "تخفیف ویژه", label: "تخفیف ویژه" },
  { value: "پیشنهاد ویژه", label: "پیشنهاد ویژه" },
];

const STOCK_OPTIONS = [
  { value: "in-stock", label: "موجود در انبار" },
  { value: "out-of-stock", label: "ناموجود" },
  { value: "soon", label: "به‌زودی" },
];

const badgeVariant = (badge) => {
  if (badge === "جدید") return "new";
  if (badge === "پرفروش") return "bestseller";
  if (badge === "تخفیف ویژه" || badge === "پیشنهاد ویژه") return "discount";
  return "neutral";
};

/** بخش‌بندی فرم — کارت‌های مستقل */
function FormCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-card border border-line bg-card p-5 shadow-card sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <Icon className="size-5 text-brand-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-black text-ink">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs leading-5 text-muted">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

/** سلکت استایل‌شده — هماهنگ با Input پروژه (forwardRef برای react-hook-form) */
const Select = forwardRef(function Select(
  { label, error, hint, id, className = "", children, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-bold text-ink">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        className={`w-full cursor-pointer rounded-xl border bg-card px-4 py-2.5 text-sm text-ink transition-colors duration-200 focus:outline-none focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
            : "border-line focus:border-brand-500 focus:ring-brand-500/15"
        }`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p id={`${selectId}-hint`} className="mt-1 text-xs text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});

/** تکست‌اریا استایل‌شده (forwardRef برای react-hook-form) */
const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, className = "", ...props },
  ref
) {
  const areaId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={areaId} className="mb-1.5 block text-sm font-bold text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${areaId}-error` : hint ? `${areaId}-hint` : undefined}
        className={`w-full resize-y rounded-xl border bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 transition-colors duration-200 focus:outline-none focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
            : "border-line focus:border-brand-500 focus:ring-brand-500/15"
        }`}
        rows={5}
        {...props}
      />
      {hint && !error && (
        <p id={`${areaId}-hint`} className="mt-1 text-xs text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${areaId}-error`} className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});

const defaultValues = {
  title: "",
  brand: "",
  category: "",
  subcategory: "",
  price: "",
  oldPrice: "",
  stock: "in-stock",
  rating: "4",
  badge: "",
  description: "",
};

export default function AdminNewProductPage() {
  const { showToast } = useToast();
  const brands = getBrands();
  const categories = getCategories();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const watched = watch();
  const category = getCategoryBySlug(watched.category);
  const selectedBrand = brands.find((b) => b.slug === watched.brand);

  // با تغییر دسته‌بندی، زیردستهٔ قبلی (نامعتبر) پاک می‌شود
  const prevCategoryRef = useRef(watched.category);
  useEffect(() => {
    if (
      prevCategoryRef.current &&
      prevCategoryRef.current !== watched.category
    ) {
      setValue("subcategory", "", { shouldValidate: false });
    }
    prevCategoryRef.current = watched.category;
  }, [watched.category, setValue]);

  // --- تصویر محصول (آپلود نمایشی) ---
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const onPickImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("فقط فایل تصویر مجاز است", "info");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data) => {
    showToast(`محصول «${data.title}» با موفقیت ثبت شد (نسخهٔ نمایشی)`);
    reset(defaultValues);
    removeImage();
  };

  const onReset = () => {
    reset(defaultValues);
    removeImage();
    showToast("فرم پاک شد", "info");
  };

  const previewPrice = Number(watched.price) > 0 ? Number(watched.price) : null;
  const previewOldPrice = Number(watched.oldPrice) > 0 ? Number(watched.oldPrice) : null;

  return (
    <>
      <Seo
        title="افزودن محصول جدید — پنل مدیریت"
        description="فرم افزودن محصول جدید به فروشگاه آراز کلین."
      />
      <PageHero
        title="افزودن محصول جدید"
        subtitle="پنل مدیریت آراز کلین — مشخصات محصول را وارد کرده و ثبت کنید."
        breadcrumb={[
          { label: "محصولات", to: "/products" },
          { label: "پنل مدیریت", to: "/admin/products/new" },
          { label: "افزودن محصول" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="max-w-site mx-auto grid grid-cols-1 gap-6 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          {/* ---------- فرم ---------- */}
          <div className="space-y-6">
            {/* اطلاعات پایه */}
            <FormCard
              icon={Package}
              title="اطلاعات پایه"
              description="عنوان، برند و دسته‌بندی محصول را مشخص کنید."
            >
              <div className="space-y-4">
                <Input
                  label="عنوان محصول"
                  name="title"
                  placeholder="مثال: مایع ظرف‌شویی لیمو ۱ لیتری"
                  error={errors.title?.message}
                  {...register("title", {
                    required: "عنوان محصول را وارد کنید",
                    minLength: { value: 5, message: "عنوان باید حداقل ۵ کاراکتر باشد" },
                  })}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    label="برند"
                    name="brand"
                    error={errors.brand?.message}
                    {...register("brand", { required: "برند را انتخاب کنید" })}
                  >
                    <option value="">انتخاب برند…</option>
                    {brands.map((b) => (
                      <option key={b.slug} value={b.slug}>{b.name}</option>
                    ))}
                  </Select>

                  <Select
                    label="دسته‌بندی"
                    name="category"
                    error={errors.category?.message}
                    {...register("category", { required: "دسته‌بندی را انتخاب کنید" })}
                  >
                    <option value="">انتخاب دسته…</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.title}</option>
                    ))}
                  </Select>
                </div>

                <Select
                  label="زیردسته"
                  name="subcategory"
                  error={errors.subcategory?.message}
                  hint={!category ? "ابتدا دسته‌بندی را انتخاب کنید" : undefined}
                  disabled={!category}
                  {...register("subcategory", {
                    required: "زیردسته را انتخاب کنید",
                    validate: (v) =>
                      !category || category.subcategories.some((s) => s.slug === v) || "زیردستهٔ انتخابی نامعتبر است",
                  })}
                >
                  <option value="">انتخاب زیردسته…</option>
                  {category?.subcategories?.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </Select>
              </div>
            </FormCard>

            {/* قیمت و موجودی */}
            <FormCard
              icon={Tags}
              title="قیمت و موجودی"
              description="قیمت فروش، قیمت قبلی (برای نمایش تخفیف) و وضعیت انبار."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="قیمت (تومان)"
                  name="price"
                  type="number"
                  inputMode="numeric"
                  placeholder="مثال: ۸۵۰۰۰"
                  error={errors.price?.message}
                  {...register("price", {
                    required: "قیمت را وارد کنید",
                    pattern: { value: /^\d+$/, message: "فقط عدد وارد کنید" },
                    min: { value: 1000, message: "حداقل قیمت ۱٬۰۰۰ تومان است" },
                  })}
                />
                <Input
                  label="قیمت قبلی (اختیاری)"
                  name="oldPrice"
                  type="number"
                  inputMode="numeric"
                  placeholder="مثال: ۱۰۰۰۰۰"
                  hint="برای نمایش تخفیف روی محصول"
                  error={errors.oldPrice?.message}
                  {...register("oldPrice", {
                    pattern: { value: /^\d+$/, message: "فقط عدد وارد کنید" },
                    validate: (v) =>
                      !v || !watched.price || Number(v) > Number(watched.price) ||
                      "قیمت قبلی باید بیشتر از قیمت فعلی باشد",
                  })}
                />
                <Select
                  label="وضعیت موجودی"
                  name="stock"
                  {...register("stock", { required: "وضعیت موجودی را انتخاب کنید" })}
                >
                  {STOCK_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <Select
                  label="امتیاز (از ۵)"
                  name="rating"
                  hint="نمایش ستاره‌ها روی کارت محصول"
                  {...register("rating", { required: "امتیاز را انتخاب کنید" })}
                >
                  {["5", "4.5", "4", "3.5", "3"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
                <Select
                  label="نشان محصول"
                  name="badge"
                  hint="اختیاری — نمایش برچسب روی کارت"
                  {...register("badge")}
                >
                  {BADGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </div>
            </FormCard>

            {/* توضیحات محصول */}
            <FormCard
              icon={FileText}
              title="توضیحات محصول"
              description="توضیحات کامل و جذاب محصول را بنویسید."
            >
              <div>
                <Textarea
                  label="توضیحات"
                  name="description"
                  placeholder="توضیحات کامل محصول…"
                  hint={`${watched.description.length.toLocaleString("fa-IR")} کاراکتر`}
                  error={errors.description?.message}
                  {...register("description", {
                    required: "توضیحات را وارد کنید",
                    minLength: { value: 20, message: "توضیحات باید حداقل ۲۰ کاراکتر باشد" },
                  })}
                />
              </div>
            </FormCard>

            {/* تصویر محصول */}
            <FormCard
              icon={ImagePlus}
              title="تصویر محصول"
              description="در این نسخهٔ نمایشی، آپلود واقعی انجام نمی‌شود؛ فقط پیش‌نمایش تصویر نشان داده می‌شود."
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickImage(e.target.files?.[0])}
                aria-hidden="true"
                tabIndex={-1}
              />

              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    onPickImage(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors duration-200 ${
                    dragOver
                      ? "border-brand-500 bg-brand-50"
                      : "border-line bg-background hover:border-brand-500/60 hover:bg-brand-50/40"
                  }`}
                >
                  <UploadCloud className="size-8 text-brand-500" aria-hidden="true" />
                  <span className="text-sm font-bold text-ink">
                    برای آپلود تصویر کلیک کنید یا فایل را اینجا رها کنید
                  </span>
                  <span className="text-xs text-muted">PNG یا JPG — حداکثر ۲ مگابایت (دمو)</span>
                </button>
              ) : (
                <div className="relative overflow-hidden rounded-card border border-line">
                  <img
                    src={imagePreview}
                    alt="پیش‌نمایش تصویر محصول"
                    className="mx-auto max-h-64 w-full object-contain bg-card p-4"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="حذف تصویر"
                    className="absolute left-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-card transition-colors hover:bg-red-600"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-bold text-white">
                    {imageFile?.name}
                  </span>
                </div>
              )}
            </FormCard>

            {/* دکمه‌های اقدام */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onReset}
                className="sm:ms-auto"
              >
                <Eraser className="size-4" aria-hidden="true" />
                پاک کردن فرم
              </Button>
              <Button type="submit" size="lg" className="sm:min-w-56">
                <Save className="size-5" aria-hidden="true" />
                ثبت محصول
              </Button>
            </div>

            <p className="flex items-start gap-2 rounded-card border border-brand-500/20 bg-brand-50/50 p-4 text-xs leading-6 text-muted">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden="true" />
              این صفحه یک نمونهٔ مدیریتی (فرانت‌اند) است و داده‌ها در حافظه ذخیره نمی‌شوند؛
              اتصال به ووکامرس در آینده از طریق لایهٔ داده انجام خواهد شد.
            </p>
          </div>

          {/* ---------- پیش‌نمایش زنده ---------- */}
          <aside className="lg:sticky lg:top-[calc(var(--header-offset,122px)+16px)] lg:self-start">
            <div className="rounded-card border border-line bg-card shadow-card">
              <div className="border-b border-line px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-black text-ink">
                  <Layers className="size-4 text-brand-500" aria-hidden="true" />
                  پیش‌نمایش زنده
                </h2>
              </div>

              <div className="p-5">
                <div className="relative overflow-hidden rounded-card border border-line bg-background">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="پیش‌نمایش محصول"
                      className="aspect-square w-full object-contain bg-card p-4"
                    />
                  ) : (
                    <ImagePlaceholder type="product" aspect="aspect-square" />
                  )}
                  {watched.badge && (
                    <Badge
                      variant={badgeVariant(watched.badge)}
                      className="absolute right-3 top-3 shadow-card"
                    >
                      {watched.badge}
                    </Badge>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-[11px] text-muted">
                    {selectedBrand?.name || "نام برند"}
                  </p>
                  <h3 className="min-h-10 text-sm font-bold leading-5 text-ink">
                    {watched.title || "عنوان محصول اینجا نمایش داده می‌شود…"}
                  </h3>

                  <div className="flex flex-wrap gap-1.5">
                    {category && (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-700">
                        {category.title}
                      </span>
                    )}
                    {category && watched.subcategory && (
                      <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-bold text-muted">
                        {category.subcategories.find((s) => s.slug === watched.subcategory)?.title}
                      </span>
                    )}
                  </div>

                  <Rating value={Number(watched.rating) || 0} size="size-3.5" />

                  <div className="flex flex-wrap items-baseline gap-2">
                    {previewPrice ? (
                      <>
                        <span className="text-base font-black text-ink">
                          {formatPrice(previewPrice)}
                        </span>
                        {previewOldPrice && (
                          <span className="text-xs text-muted/70 line-through">
                            {formatPrice(previewOldPrice)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-muted">قیمت محصول…</span>
                    )}
                  </div>

                  <p className="text-[11px] font-medium text-success-600">
                    {watched.stock === "in-stock" && "موجود در انبار"}
                    {watched.stock === "out-of-stock" && "ناموجود"}
                    {watched.stock === "soon" && "به‌زودی"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </>
  );
}
