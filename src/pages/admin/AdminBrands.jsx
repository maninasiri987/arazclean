import { Link } from "react-router-dom";
import { Edit3, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../context/StoreContext.jsx";
import { toFaDigits } from "../../utils/format.js";
import SmartImage from "../../components/ui/SmartImage.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";

/**
 * مدیریت برندها — کارت‌ها با لینک به صفحهٔ اختصاصی ویرایش برند
 * (مثل صفحهٔ ویرایش محصول) + حذف با مودال تأیید.
 * تعداد محصولات هر برند زنده از StoreContext شمرده می‌شود.
 */
export default function AdminBrands() {
  const { brands, products, deleteBrand } = useStore();
  const [confirmSlug, setConfirmSlug] = useState(null);

  const productCount = (slug) =>
    products.filter((p) => p.brandSlug === slug).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">مدیریت برندها</h1>
        <Link to="/admin/brands/new">
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            افزودن برند
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <div
            key={brand.slug}
            className="rounded-card border border-line bg-card p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              {brand.logo ? (
                <SmartImage
                  src={brand.logo}
                  alt={brand.name}
                  className="size-12 shrink-0 rounded-xl border border-line bg-background"
                  imgClassName="h-full w-full object-cover"
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
                <Link
                  to={`/admin/brands/${brand.slug}`}
                  aria-label={`ویرایش ${brand.name}`}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  <Edit3 className="size-4" aria-hidden="true" />
                </Link>
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
