import { memo } from "react";
import { Link } from "react-router-dom";
import { prefetchPage } from "../../utils/prefetch.js";
import {
  UtensilsCrossed,
  Shirt,
  ShieldCheck,
  Sparkles,
  Layers,
  Droplets,
  Baby,
  Brush,
  Star,
  ChevronLeft,
} from "lucide-react";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";
import { getProductsByCategory } from "../../services/catalog.js";
import { formatNumber } from "../../utils/format.js";

const icons = {
  dish: UtensilsCrossed,
  laundry: Shirt,
  shield: ShieldCheck,
  sparkles: Sparkles,
  layers: Layers,
  droplets: Droplets,
  baby: Baby,
  brush: Brush,
  star: Star,
};

/**
 * کارت دسته‌بندی — آیکون + تصویر + تعداد محصولات و زیردسته‌ها
 */
function CategoryCard({ category }) {
  const Icon = icons[category.icon] || Layers;
  const count = getProductsByCategory(category.slug).length;
  const subCount = category.subcategories?.length || 0;

  return (
    <Link
      to={`/category/${category.slug}`}
      onMouseEnter={() => prefetchPage("/category")}
      onFocus={() => prefetchPage("/category")}
      className="group relative block overflow-hidden rounded-card border border-line bg-card shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <ImagePlaceholder type="category" aspect="aspect-[4/3]" className="transition-transform duration-500 group-hover:scale-[1.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" aria-hidden="true" />

      {/* آیکون */}
      <div className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-xl bg-card/90 shadow-card backdrop-blur" aria-hidden="true">
        <Icon className="size-5 text-brand-600" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="text-base font-black">{category.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">
          {category.description}
        </p>
        <p className="mt-2 flex items-center gap-1 text-xs font-bold text-brand-100">
          {formatNumber(count)} محصول
          {subCount > 0 && (
            <span className="text-white/60">· {formatNumber(subCount)} زیردسته</span>
          )}
          <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
        </p>
      </div>
    </Link>
  );
}

export default memo(CategoryCard);
