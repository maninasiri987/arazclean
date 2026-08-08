import { ImageIcon, Sparkles, Layers, BadgePercent } from "lucide-react";

const config = {
  product: {
    label: "تصویر محصول",
    gradient: "from-brand-50 via-card to-brand-100/60",
    icon: ImageIcon,
  },
  category: {
    label: "تصویر دسته‌بندی",
    gradient: "from-trust-50 via-card to-brand-50",
    icon: Layers,
  },
  brand: {
    label: "لوگوی برند",
    gradient: "from-background via-card to-background",
    icon: Sparkles,
  },
  hero: {
    label: "تصویر اسلایدر",
    gradient: "from-brand-500/10 via-card to-trust-500/10",
    icon: Sparkles,
  },
  banner: {
    label: "تصویر تبلیغاتی",
    gradient: "from-brand-500/15 via-card to-trust-500/15",
    icon: BadgePercent,
  },
};

/**
 * جای‌نویس ظریف تصویر — به‌جای تصاویر واقعی (پروژه UI mockup است).
 * با `type` نوع گرادیان و برچسب مشخص می‌شود.
 */
export default function ImagePlaceholder({
  type = "product",
  label,
  className = "",
  aspect = "aspect-square",
}) {
  const cfg = config[type] || config.product;
  const Icon = cfg.icon;
  return (
    <div
      role="img"
      aria-label={label || cfg.label}
      className={`relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br ${cfg.gradient} ${aspect} ${className}`}
    >
      {/* بافت ظریف نقطه‌ای */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgb(12 142 141 / 0.18) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 text-brand-600/70">
        <Icon className="size-10" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[11px] font-bold tracking-wide">{label || cfg.label}</span>
      </div>
    </div>
  );
}
