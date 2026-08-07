import { useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, ShoppingCart, Truck } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import ImagePlaceholder from "../components/ui/ImagePlaceholder.jsx";
import Badge from "../components/ui/Badge.jsx";
import Rating from "../components/ui/Rating.jsx";
import Button from "../components/ui/Button.jsx";
import QuantitySelector from "../components/product/QuantitySelector.jsx";
import ProductTabs from "../components/product/ProductTabs.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { getProductBySlug, getRelatedProducts } from "../services/catalog.js";
import { formatPrice, formatDiscountPercent, toFaDigits } from "../utils/format.js";
import { useCartActions } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addToCart } = useCartActions();
  const { showToast } = useToast();

  const [qty, setQty] = useState(1);
  const [activeView, setActiveView] = useState(1);

  if (!product) return <NotFoundPage />;

  const outOfStock = product.stock <= 0;
  const hasDiscount = product.discount > 0;
  const related = getRelatedProducts(product);

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`«${product.title}» (${toFaDigits(qty)} عدد) به سبد اضافه شد`);
  };

  return (
    <>
      <Seo title={product.title} description={product.description.slice(0, 150)} />

      <div className="max-w-site mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "محصولات", to: "/products" },
            { label: product.category, to: `/category/${product.categorySlug}` },
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* گالری */}
          <div>
            <div className="relative overflow-hidden rounded-card border border-line bg-card shadow-card">
              <ImagePlaceholder type={product.placeholder || "product"} aspect="aspect-square" />
              {hasDiscount && (
                <Badge variant="discount" className="absolute right-4 top-4 shadow-card">
                  {formatDiscountPercent(product.discount)} تخفیف
                </Badge>
              )}
              {outOfStock && (
                <Badge variant="danger" className="absolute left-4 top-4 shadow-card">
                  ناموجود
                </Badge>
              )}
              <span className="absolute bottom-4 left-4 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-muted shadow-card backdrop-blur">
                نمای {toFaDigits(activeView)}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label="تصاویر محصول">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setActiveView(n)}
                  aria-label={`نمای ${toFaDigits(n)}`}
                  aria-pressed={activeView === n}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    activeView === n
                      ? "border-brand-500 ring-2 ring-brand-500/20"
                      : "border-line hover:border-brand-500/50"
                  }`}
                >
                  <ImagePlaceholder type="product" aspect="aspect-square" />
                </button>
              ))}
            </div>
          </div>

          {/* اطلاعات */}
          <div>
            <p className="text-sm font-bold text-brand-600">{product.brand}</p>
            <h1 className="mt-2 text-2xl font-black leading-9 text-ink sm:text-3xl">
              {product.title}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <Rating value={product.rating} count={product.id * 7 + 13} />
            </div>

            {/* قیمت */}
            <div className="mt-6 rounded-card border border-line bg-background/60 p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-black text-ink">{formatPrice(product.price)}</span>
                {hasDiscount && product.oldPrice && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {hasDiscount && (
                  <Badge variant="discount">{formatDiscountPercent(product.discount)}</Badge>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {outOfStock ? (
                  <Badge variant="danger" size="md">ناموجود</Badge>
                ) : (
                  <Badge variant="success" size="md">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    موجود در انبار ({toFaDigits(product.stock)} عدد)
                  </Badge>
                )}
              </div>
            </div>

            {/* تعداد + افزودن به سبد */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-ink">تعداد:</span>
                {outOfStock ? (
                  <span className="rounded-xl border border-line bg-background px-4 py-2.5 text-sm text-muted">
                    فعلاً در دسترس نیست
                  </span>
                ) : (
                  <QuantitySelector value={qty} onChange={setQty} max={product.stock} />
                )}
              </div>
              <Button
                onClick={handleAdd}
                disabled={outOfStock}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="size-5" aria-hidden="true" />
                {outOfStock ? "ناموجود" : "افزودن به سبد خرید"}
              </Button>
            </div>

            {/* مزایا */}
            <ul className="mt-6 space-y-3 rounded-card border border-line bg-card p-5 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <Truck className="size-4 text-brand-500" aria-hidden="true" />
                ارسال سریع به سراسر کشور
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-success-500" aria-hidden="true" />
                ضمانت اصالت کالا
              </li>
            </ul>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="mt-12">
          <ProductTabs product={product} />
        </div>

        {/* محصولات مرتبط */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-14">
            <SectionTitle title="محصولات مرتبط" subtitle="شاید این محصولات هم برایتان جالب باشند" />
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </>
  );
}
