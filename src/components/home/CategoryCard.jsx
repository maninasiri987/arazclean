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
 * کارت دسته‌بندی — کاشی فشرده به‌سبک دیجی‌کالا:
 * آیکون رنگی در قاب گرد + عنوان + تعداد محصولات.
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
      className="group flex w-32 shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-line bg-card p-4 text-center shadow-card transition-[box-shadow,border-color] duration-300 hover:border-brand-500/40 hover:shadow-card-hover sm:w-36"
    >
      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.bg} ${cfg.text} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-h-10 text-xs font-black leading-5 text-ink transition-colors group-hover:text-brand-600 sm:text-sm">
        {category.title}
      </span>
      <span className="text-[11px] font-medium text-muted">
        {formatNumber(count)} محصول
      </span>
    </Link>
  );
}

export default memo(CategoryCard);
