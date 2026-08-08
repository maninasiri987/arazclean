import { memo } from "react";
import { Link } from "react-router-dom";
import { PackageX, ShoppingCart } from "lucide-react";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";
import Rating from "../ui/Rating.jsx";
import Badge from "../ui/Badge.jsx";
import { formatPrice, formatDiscountPercent } from "../../utils/format.js";
import { assetPath } from "../../utils/assets.js";
import { useCartActions } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { prefetchPage } from "../../utils/prefetch.js";

/**
 * کارت محصول — منطق کامل:
 * - بدون تخفیف: قیمت قبلی نمایش داده نمی‌شود
 * - ناموجود: دکمهٔ خرید غیرفعال + برچسب «ناموجود»
 */
function ProductCard({ product }) {
  const { addToCart } = useCartActions();
  const { showToast } = useToast();
  const outOfStock = product.stock <= 0;
  const hasDiscount = product.discount > 0;

  const handleAdd = () => {
    addToCart(product, 1);
    showToast(`«${product.title}» به سبد خرید اضافه شد`);
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-card transition-[box-shadow,border-color] duration-300 hover:border-brand-500/30 hover:shadow-card-hover ${
        outOfStock ? "opacity-80" : ""
      }`}
    >
      <Link
        to={`/product/${product.slug}`}
        onMouseEnter={() => prefetchPage(`/product/${product.slug}`)}
        onFocus={() => prefetchPage(`/product/${product.slug}`)}
        className="relative block"
        aria-label={product.title}
      >
        {product.image ? (
          <img
            src={assetPath(product.image)}
            alt={product.title}
            loading="lazy"
            className={`aspect-square w-full object-contain bg-card p-4 ${
              outOfStock ? "grayscale" : ""
            }`}
          />
        ) : (
          <ImagePlaceholder type={product.placeholder || "product"} className={outOfStock ? "grayscale" : ""} />
        )}
        {/* برچسب تخفیف */}
        {hasDiscount && (
          <Badge variant="discount" className="absolute right-3 top-3 shadow-card">
            {formatDiscountPercent(product.discount)} تخفیف
          </Badge>
        )}
        {/* برچسب ویژه */}
        {!hasDiscount && product.badge && (
          <Badge variant={product.badge === "جدید" ? "new" : "bestseller"} className="absolute right-3 top-3 shadow-card">
            {product.badge}
          </Badge>
        )}
        {/* ناموجود */}
        {outOfStock && (
          <Badge variant="danger" className="absolute left-3 top-3 shadow-card">
            <PackageX className="size-3" aria-hidden="true" />
            ناموجود
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] text-muted">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-ink transition-colors group-hover:text-brand-600">
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        <div className="mt-2">
          <Rating value={product.rating} />
        </div>

        <div className="mt-auto pt-3">
          {/* قیمت‌ها */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-black text-ink">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && product.oldPrice && (
              <span className="text-xs text-muted/70 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* موجودی */}
          {!outOfStock && product.stock < 10 && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              تنها {product.stock} عدد باقی مانده
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={outOfStock ? `${product.title} — ناموجود` : `افزودن ${product.title} به سبد خرید`}
            className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-[color,background-color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
              outOfStock
                ? "bg-background text-muted"
                : "bg-brand-500 text-white shadow-card hover:bg-brand-600"
            }`}
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {outOfStock ? "ناموجود" : "افزودن به سبد"}
          </button>
        </div>
      </div>
    </article>
  );
}

// memo تا با تغییر سبد خرید، همهٔ کارت‌ها دوباره رندر نشوند
export default memo(ProductCard);
