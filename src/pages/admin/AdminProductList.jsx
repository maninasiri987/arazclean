import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../../context/StoreContext.jsx";
import { formatPrice, toFaDigits } from "../../utils/format.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";
import SmartImage from "../../components/ui/SmartImage.jsx";
import ImagePlaceholder from "../../components/ui/ImagePlaceholder.jsx";

// موجودی محصولات عددی است؛ بر اساس مقدار، وضعیت نمایش داده می‌شود
const stockBadge = (stock) => {
  if (stock <= 0) return { label: "ناموجود", variant: "neutral" };
  if (stock < 10) return { label: `${toFaDigits(stock)} عدد — کم`, variant: "discount" };
  return { label: `${toFaDigits(stock)} عدد`, variant: "success" };
};

const BADGE_MAP = {
  پرفروش: "bestseller",
  جدید: "new",
  "تخفیف ویژه": "discount",
  "پیشنهاد ویژه": "discount",
};

export default function AdminProductList() {
  const {
    products,
    deleteProduct,
    lowStockProducts,
    outOfStockProducts,
  } = useStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const PER_PAGE = 10;

  const filtered = products
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.includes(search)
    )
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  // صفحهٔ امن — بدون setState در حین رندر (که هشدار React می‌دهد)
  const safePage = Math.min(page, totalPages);

  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const confirmDelete = (id) => setDeleteId(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-black text-ink">مدیریت محصولات</h1>
        <Link to="/admin/products/new">
          <Button icon={<Plus className="size-4" />}>افزودن محصول</Button>
        </Link>
      </div>

      {/* جستجو و فیلتر */}
      <div className="rounded-card border border-line bg-card p-4 shadow-card">
        <Input
          label="جستجو"
          placeholder="نام، برند، یا اسلاگ…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="size-4.5 text-muted" />}
          className="max-w-xs"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
          <span>مجموع: <strong>{toFaDigits(products.length)}</strong></span>
          <span className="mx-1">|</span>
          <span className="text-amber-600">
            کم‌موجود: <strong>{toFaDigits(lowStockProducts.length)}</strong>
          </span>
          <span className="mx-1">|</span>
          <span className="text-red-500">
            ناموجود: <strong>{toFaDigits(outOfStockProducts.length)}</strong>
          </span>
        </div>
      </div>

      {/* جدول محصولات */}
      <div className="rounded-card border border-line bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-background border-b border-line">
              <tr>
                {[
                  { key: "id", label: "شناسه" },
                  { key: "title", label: "عنوان" },
                  { key: "brand", label: "برند" },
                  { key: "category", label: "دسته" },
                  { key: "price", label: "قیمت" },
                  { key: "stock", label: "موجودی" },
                  { key: "badge", label: "نشان" },
                  { key: "actions", label: "" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-bold text-muted cursor-pointer ${
                      col.key !== "actions" ? "hover:text-brand-600" : ""
                    }`}
                    onClick={() => col.key !== "actions" && handleSort(col.key)}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        sortDir === "asc" ? (
                          <ChevronUp className="size-3.5 text-brand-500" />
                        ) : (
                          <ChevronDown className="size-3.5 text-brand-500" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted">
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-line/40 last:border-0 hover:bg-background/50"
                  >
                    <td className="px-4 py-3 font-bold text-muted">
                      {toFaDigits(p.id)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="size-10 shrink-0 overflow-hidden rounded-lg border border-line bg-background">
                          {p.image ? (
                            <SmartImage
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full"
                              imgClassName="h-full w-full object-cover"
                            />
                          ) : (
                            <ImagePlaceholder type="product" aspect="aspect-square" />
                          )}
                        </span>
                        <span className="max-w-xs truncate font-bold text-ink">
                          {p.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.brand}</td>
                    <td className="px-4 py-3 text-muted">{p.category}</td>
                    <td className="px-4 py-3 font-bold text-ink">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={stockBadge(p.stock).variant}
                        className="text-[11px]"
                      >
                        {stockBadge(p.stock).label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {p.badge && (
                        <Badge
                          variant={BADGE_MAP[p.badge] || "neutral"}
                          className="text-[11px]"
                        >
                          {p.badge}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                          aria-label={`ویرایش ${p.title}`}
                        >
                          <FileText className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => confirmDelete(p.id)}
                          className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label={`حذف ${p.title}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <p className="text-xs text-muted">
              نمایش {toFaDigits((safePage - 1) * PER_PAGE + 1)} تا {toFaDigits(Math.min(safePage * PER_PAGE, filtered.length))} از {toFaDigits(filtered.length)}
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-muted hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-muted hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* مودال حذف */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="حذف محصول"
        maxWidth="max-w-md"
      >
        <p className="mb-4 text-sm text-muted">
          آیا از حذف این محصول اطمینان دارید؟ این کار قابل بازگشت نیست.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>انصراف</Button>
          <button
            type="button"
            onClick={() => {
              deleteProduct(deleteId);
              setDeleteId(null);
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