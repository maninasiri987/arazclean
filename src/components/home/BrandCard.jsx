import { memo } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { getProductCountByBrand } from "../../services/catalog.js";
import { formatNumber } from "../../utils/format.js";
import { prefetchPage } from "../../utils/prefetch.js";
import { assetPath } from "../../utils/assets.js";

/**
 * کارت برند — لوگوی دایره‌ای + نام + تعداد محصولات.
 * اگر برند `logo` داشته باشد همان نمایش داده می‌شود؛
 * در غیر این صورت جای‌نویس لوگو نشان داده می‌شود.
 */
function BrandCard({ brand }) {
  const count = getProductCountByBrand(brand.slug);

  return (
    <Link
      to={`/brands/${brand.slug}`}
      onMouseEnter={() => prefetchPage("/brands")}
      onFocus={() => prefetchPage("/brands")}
      className="group flex flex-col items-center gap-3"
      aria-label={`برند ${brand.name} — ${formatNumber(count)} محصول`}
    >
      <span className="flex size-20 items-center justify-center rounded-full border border-line bg-card p-2.5 shadow-card transition-[border-color,box-shadow] duration-300 group-hover:border-brand-500 group-hover:shadow-card-hover sm:size-24">
        {brand.logo ? (
          <img
            src={assetPath(brand.logo)}
            alt={`لوگوی ${brand.name}`}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Sparkles className="size-6" aria-hidden="true" />
          </span>
        )}
      </span>
      <span className="text-xs font-bold text-ink transition-colors group-hover:text-brand-600 sm:text-sm">
        {brand.name}
      </span>
      <span className="-mt-2 text-[11px] font-medium text-muted">
        {formatNumber(count)} محصول
      </span>
    </Link>
  );
}

export default memo(BrandCard);
