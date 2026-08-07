import { memo } from "react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";
import { getProductsByBrand } from "../../services/catalog.js";
import { formatNumber } from "../../utils/format.js";
import { prefetchPage } from "../../utils/prefetch.js";

/**
 * کارت برند — لوگو + نام + تعداد محصولات
 */
function BrandCard({ brand }) {
  const count = getProductsByBrand(brand.slug).length;

  return (
    <Link
      to={`/products?brand=${brand.slug}`}
      onMouseEnter={() => prefetchPage("/products")}
      onFocus={() => prefetchPage("/products")}
      className="group flex flex-col items-center rounded-card border border-line bg-card p-5 text-center shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-card-hover"
    >
      <ImagePlaceholder type="brand" aspect="aspect-[3/2]" className="rounded-lg" />
      <h3 className="mt-4 text-sm font-black text-ink transition-colors group-hover:text-brand-600">
        {brand.name}
      </h3>
      <p className="mt-1 text-xs text-muted">{brand.tagline}</p>
      <p className="mt-2 text-[11px] font-bold text-brand-600">
        {formatNumber(count)} محصول
      </p>
    </Link>
  );
}

export default memo(BrandCard);
