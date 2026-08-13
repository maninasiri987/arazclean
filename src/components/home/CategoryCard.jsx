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
} from "lucide-react";
import { getCategoryProductCount, getSubcategoryProductCount } from "../../services/catalog.js";
import { formatNumber } from "../../utils/format.js";

/** آیکون + رنگ‌های ملایم هر دسته — برای تمایز بصری سریع */
const styles = {
  dish: { icon: UtensilsCrossed, bg: "from-amber-50 to-orange-100", text: "text-orange-600" },
  laundry: { icon: Shirt, bg: "from-sky-50 to-blue-100", text: "text-blue-600" },
  shield: { icon: ShieldCheck, bg: "from-brand-50 to-teal-100", text: "text-brand-600" },
  sparkles: { icon: Sparkles, bg: "from-emerald-50 to-teal-100", text: "text-emerald-600" },
  layers: { icon: Layers, bg: "from-slate-100 to-slate-200", text: "text-slate-600" },
  droplets: { icon: Droplets, bg: "from-cyan-50 to-sky-100", text: "text-cyan-600" },
  baby: { icon: Baby, bg: "from-pink-50 to-rose-100", text: "text-rose-500" },
  brush: { icon: Brush, bg: "from-violet-50 to-purple-100", text: "text-violet-600" },
  star: { icon: Star, bg: "from-yellow-50 to-amber-100", text: "text-amber-500" },
};

const fallback = { icon: Layers, bg: "from-background to-brand-50", text: "text-brand-600" };

/**
 * کارت دسته‌بندی — دایرهٔ رنگی با آیکون + عنوان + تعداد محصولات.
 * هم‌سبک با کارت‌های دایره‌ای برندها (لوگو در حلقهٔ گرد).
 */
function CategoryCard({ category }) {
  const cfg = styles[category.icon] || fallback;
  const Icon = cfg.icon;
  const count = getCategoryProductCount(category.slug);

  return (
    <Link
      to={`/category/${category.slug}`}
      onMouseEnter={() => prefetchPage("/category")}
      onFocus={() => prefetchPage("/category")}
      className="group flex w-24 shrink-0 flex-col items-center gap-2.5 sm:w-28"
      aria-label={`دسته‌بندی ${category.title} — ${formatNumber(count)} محصول`}
    >
      <span
        className={`flex size-20 items-center justify-center rounded-full bg-gradient-to-br shadow-card ring-1 ring-inset ring-line/60 transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-card-hover sm:size-24 ${cfg.bg}`}
      >
        <Icon className={`size-8 sm:size-9 ${cfg.text}`} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-h-8 text-center text-xs font-black leading-4 text-ink transition-colors group-hover:text-brand-600 sm:text-sm">
        {category.title}
      </span>
      <span className="text-[11px] font-medium text-muted">
        {formatNumber(count)} محصول
      </span>
    </Link>
  );
}

export default memo(CategoryCard);
