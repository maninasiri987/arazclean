import { useState } from "react";
import { Edit3, Plus, Sparkles, Trash2 } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { toFaDigits } from "../../utils/format.js";
import { assetPath } from "../../utils/assets.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";

const EMPTY = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  logo: "",
  featured: false,
};

/**
 * مدیریت برندها — جدول + مودال افزودن/ویرایش + حذف.
 * تعداد محصولات هر برند زنده از StoreContext شمرده می‌شود.
 */
export default function AdminBrands() {
  const { brands, products, addBrand, updateBrand, deleteBrand } = useStore();
  const [open, setOpen] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [confirmSlug, setConfirmSlug] = useState(null);

  const productCount = (slug) =>
    products.filter((p) => p.brandSlug === slug).length;

  const openAdd = () => {
    setEditSlug(null);
    setForm(EMPTY);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (brand) => {
    setEditSlug(brand.slug);
    setForm({
      slug: brand.slug,
      name: brand.name,
      tagline: brand.tagline || "",
      description: brand.description || "",
      logo: brand.logo || "",
      featured: brand.featured,
    });
    setErrors({});
    setOpen(true);
  };

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.slug.trim()) errs.slug = "اسلاگ را وارد کنید";
    if (!form.name.trim()) errs.name = "نام برند را وارد کنید";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      logo: form.logo.trim() || null,
      placeholder: "brand",
      featured: form.featured,
    };

    if (editSlug) updateBrand(editSlug, payload);
    else addBrand(payload);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">مدیریت برندها</h1>
        <Button onClick={openAdd}>
          <Plus className="size-4" aria-hidden="true" />
          افزودن برند
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <div
            key={brand.slug}
            className="rounded-card border border-line bg-card p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              {brand.logo ? (
                <img
                  src={assetPath(brand.logo)}
                  alt={brand.name}
                  loading="lazy"
                  decoding="async"
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-background object-cover"
                />
              ) : (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-black text-brand-700">
                  {brand.name.slice(0, 1)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-ink">{brand.name}</h3>
                {brand.tagline && (
                  <p className="truncate text-[11px] text-muted">{brand.tagline}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(brand)}
                  aria-label={`ویرایش ${brand.name}`}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  <Edit3 className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmSlug(brand.slug)}
                  aria-label={`حذف ${brand.name}`}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted">
              <span>
                <span className="font-bold text-ink">{toFaDigits(productCount(brand.slug))}</span> محصول
              </span>
              <span className="flex items-center gap-1">
                {brand.featured && (
                  <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-bold text-brand-700">
                    <Sparkles className="size-3" aria-hidden="true" />
                    ویژه
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* مودال افزودن/ویرایش */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editSlug ? "ویرایش برند" : "افزودن برند"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="نام برند"
              name="name"
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
              rows={3}
              value={form.description}
              onChange={update("description")}
              className="w-full resize-y rounded-xl border border-line bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </div>
          <Input
            label="لوگو (مسیر تصویر)"
            name="logo"
            placeholder="/images/brands/bref.webp"
            hint="خالی = استفاده از حرف اول نام"
            value={form.logo}
            onChange={update("logo")}
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={update("featured")}
              className="size-4 accent-brand-500"
            />
            برند ویژه (نمایش در صفحهٔ برندها)
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="submit">
              {editSlug ? "ذخیره تغییرات" : "افزودن"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* مودال حذف */}
      <Modal
        open={!!confirmSlug}
        onClose={() => setConfirmSlug(null)}
        title="حذف برند"
        maxWidth="max-w-md"
      >
        <p className="mb-4 text-sm text-muted">
          آیا از حذف این برند اطمینان دارید؟ محصولات آن برند حذف نمی‌شوند.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmSlug(null)}>انصراف</Button>
          <button
            type="button"
            onClick={() => {
              deleteBrand(confirmSlug);
              setConfirmSlug(null);
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
          >
            حذف
          </button>
        </div>
      </Modal>
    </div>
  );
}