const variants = {
  discount: "bg-red-500 text-white",
  new: "bg-trust-500 text-white",
  bestseller: "bg-brand-500 text-white",
  success: "bg-success-50 text-success-600",
  danger: "bg-red-50 text-red-500",
  neutral: "bg-background text-muted border border-line",
  brandSoft: "bg-brand-50 text-brand-700",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

/**
 * برچسب کوچک با انواع رنگ — مثل «٪۱۹ تخفیف»، «جدید»، «ناموجود»
 */
export default function Badge({ children, variant = "neutral", size = "md", className = "" }) {
  if (!children) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
