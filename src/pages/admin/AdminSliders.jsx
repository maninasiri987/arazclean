import { useState } from "react";
import { Edit3, Image, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";

const EMPTY = {
  badge: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaTo: "",
  image: "",
};

/**
 * مدیریت اسلایدهای هیرو — جدول + فرم در مودال (افزودن/ویرایش/حذف).
 */
export default function AdminSliders() {
  const { slides, addSlide, updateSlide, deleteSlide } = useStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (slide) => {
    setEditId(slide.id);
    setForm({
      badge: slide.badge || "",
      title: slide.title,
      description: slide.description || "",
      ctaLabel: slide.ctaLabel || "",
      ctaTo: slide.ctaTo || "",
      image: slide.image || "",
    });
    setErrors({});
    setOpen(true);
  };

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "عنوان را وارد کنید";
    if (!form.image.trim()) errs.image = "تصویر یا گرادیان پس‌زمینه را وارد کنید";
    if (!form.ctaTo.trim()) errs.ctaTo = "لینک مقصد را وارد کنید";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      badge: form.badge.trim() || undefined,
      title: form.title.trim(),
      description: form.description.trim(),
      ctaLabel: form.ctaLabel.trim() || "مشاهده",
      ctaTo: form.ctaTo.trim(),
      image: form.image.trim(),
    };

    if (editId) updateSlide(editId, payload);
    else addSlide(payload);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">مدیریت اسلایدرها</h1>
        <Button onClick={openAdd}>
          <Plus className="size-4" aria-hidden="true" />
          افزودن اسلایدر
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="overflow-hidden rounded-card border border-line bg-card shadow-card"
          >
            <div
              className="relative flex h-36 items-end p-4 text-white"
              style={{
                background: slide.image,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {slide.badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
                  <Sparkles className="size-3" aria-hidden="true" />
                  {slide.badge}
                </span>
              )}
              <div className="absolute left-3 top-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(slide)}
                  aria-label="ویرایش اسلایدر"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-card/90 text-muted transition-colors hover:bg-brand-500 hover:text-white"
                >
                  <Edit3 className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(slide.id)}
                  aria-label="حذف اسلایدر"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-card/90 text-muted transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="space-y-1.5 p-4">
              <h3 className="font-bold text-ink">{slide.title}</h3>
              <p className="line-clamp-2 text-xs leading-6 text-muted">
                {slide.description}
              </p>
              <p className="pt-1 text-[11px] text-muted/70">
                <span className="font-bold text-brand-600">{slide.ctaLabel}</span>
                {" ← "}
                {slide.ctaTo}
              </p>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="rounded-card border border-dashed border-line bg-card p-10 text-center text-sm text-muted">
          اسلایدی ثبت نشده است.
        </div>
      )}

      {/* مودال افزودن/ویرایش */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? "ویرایش اسلایدر" : "افزودن اسلایدر"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={save} className="space-y-4">
          <Input
            label="عنوان"
            name="title"
            value={form.title}
            onChange={update("title")}
            error={errors.title}
          />
          <Input
            label="نشان (اختیاری)"
            name="badge"
            placeholder="پیشنهاد هفته، جشنواره، …"
            value={form.badge}
            onChange={update("badge")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink" htmlFor="desc">
              توضیحات
            </label>
            <textarea
              id="desc"
              rows={3}
              value={form.description}
              onChange={update("description")}
              className="w-full resize-y rounded-xl border border-line bg-card px-4 py-2.5 text-sm leading-7 text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="متن دکمه (اختیاری)"
              name="ctaLabel"
              placeholder="مشاهده محصولات"
              value={form.ctaLabel}
              onChange={update("ctaLabel")}
            />
            <Input
              label="لینک دکمه"
              name="ctaTo"
              placeholder="/products"
              value={form.ctaTo}
              onChange={update("ctaTo")}
              error={errors.ctaTo}
            />
          </div>
          <Input
            label="پس‌زمینه (مسیر تصویر یا گرادیان CSS)"
            name="image"
            placeholder="linear-gradient(130deg, #0ea5a4 0%, #5eead4 140%)"
            hint="مثل دادهٔ نمونه: مسیر `/images/…` یا گرادیان CSS"
            value={form.image}
            onChange={update("image")}
            error={errors.image}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="submit">
              {editId ? "ذخیره تغییرات" : "افزودن"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* مودال حذف */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="حذف اسلایدر"
        maxWidth="max-w-md"
      >
        <p className="mb-4 text-sm text-muted">
          آیا از حذف این اسلایدر از صفحهٔ اصلی اطمینان دارید؟
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmId(null)}>انصراف</Button>
          <button
            type="button"
            onClick={() => {
              deleteSlide(confirmId);
              setConfirmId(null);
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