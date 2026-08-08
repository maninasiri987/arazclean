import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShoppingCart, Trash2 } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";
import ImagePlaceholder from "../components/ui/ImagePlaceholder.jsx";
import QuantitySelector from "../components/product/QuantitySelector.jsx";
import { useCartState, useCartActions } from "../context/CartContext.jsx";
import { getProductById } from "../services/catalog.js";
import { formatPrice, toFaDigits } from "../utils/format.js";
import { assetPath } from "../utils/assets.js";

export default function CartPage() {
  const { items, count, subtotal } = useCartState();
  const { updateQty, removeFromCart, clearCart } = useCartActions();

  const rows = items
    .map((item) => ({ ...item, product: getProductById(item.id) }))
    .filter((row) => row.product);

  return (
    <>
      <Seo title="سبد خرید" description="سبد خرید شما در فروشگاه آراز کلین." />
      <div className="max-w-site mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "سبد خرید" }]} />
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-black text-ink sm:text-3xl">
          <ShoppingCart className="size-7 text-brand-500" aria-hidden="true" />
          سبد خرید
          <span className="text-sm font-bold text-muted">({toFaDigits(count)} کالا)</span>
        </h1>

        {rows.length === 0 ? (
          <EmptyState
            title="سبد خرید شما خالی است"
            description="هنوز محصولی به سبد خود اضافه نکرده‌اید؛ از بین محصولات متنوع ما انتخاب کنید."
            action={
              <Button to="/products" variant="primary" size="lg">
                مشاهدهٔ محصولات
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* اقلام */}
            <ul className="space-y-4" aria-label="اقلام سبد خرید">
              {rows.map(({ product, qty }) => {
                const lineTotal = product.price * qty;
                return (
                  <li
                    key={product.id}
                    className="flex gap-4 rounded-card border border-line bg-card p-4 shadow-card"
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      className="w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-card"
                      aria-label={product.title}
                    >
                      {product.image ? (
                        <img
                          src={assetPath(product.image)}
                          alt={product.title}
                          loading="lazy"
                          className="aspect-square w-full object-contain bg-card p-1.5"
                        />
                      ) : (
                        <ImagePlaceholder type="product" aspect="aspect-square" />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted">{product.brand}</p>
                          <Link
                            to={`/product/${product.slug}`}
                            className="mt-0.5 line-clamp-2 text-sm font-bold text-ink transition-colors hover:text-brand-600"
                          >
                            {product.title}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`حذف ${product.title} از سبد`}
                          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <QuantitySelector
                          value={qty}
                          onChange={(v) => updateQty(product.id, v)}
                          max={product.stock}
                        />
                        <div className="text-left">
                          <p className="text-sm text-muted">
                            {formatPrice(product.price)} × {toFaDigits(qty)}
                          </p>
                          <p className="text-base font-black text-ink">{formatPrice(lineTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* خلاصه */}
            <aside className="h-fit rounded-card border border-line bg-card p-6 shadow-card lg:sticky lg:top-[calc(var(--header-offset,122px)+16px)]">
              <h2 className="text-lg font-black text-ink">خلاصه سفارش</h2>
              <dl className="mt-4 space-y-3 border-b border-line pb-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">جمع کالاها ({toFaDigits(count)})</dt>
                  <dd className="font-bold text-ink">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">هزینه ارسال</dt>
                  <dd className="font-bold text-success-600">رایگان</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-ink">مبلغ قابل پرداخت</span>
                <span className="text-xl font-black text-ink">{formatPrice(subtotal)}</span>
              </div>

              <Button size="lg" fullWidth className="mt-5" disabled>
                <Lock className="size-4" aria-hidden="true" />
                پرداخت — به‌زودی
              </Button>
              <p className="mt-3 text-center text-xs leading-6 text-muted">
                این فروشگاه فقط نمایشی است؛ درگاه پرداخت در نسخهٔ نهایی فعال می‌شود.
              </p>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
                <Link
                  to="/products"
                  className="flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                  ادامه خرید
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="cursor-pointer text-sm text-muted transition-colors hover:text-red-500"
                >
                  خالی کردن سبد
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
