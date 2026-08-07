import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-card",
  secondary:
    "bg-trust-500 text-white hover:bg-trust-600 shadow-card",
  outline:
    "border border-brand-500 bg-transparent text-brand-600 hover:bg-brand-500 hover:text-white",
  ghost:
    "bg-transparent text-muted hover:bg-brand-50 hover:text-brand-600",
  success:
    "bg-success-500 text-white hover:bg-success-600 shadow-card",
  white:
    "bg-white text-brand-600 hover:bg-brand-50 shadow-card",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

/**
 * دکمهٔ همه‌کاره — اگر `to` داده شود به‌صورت Link رندر می‌شود.
 */
export default function Button({
  variant = "primary",
  size = "md",
  to,
  fullWidth,
  className = "",
  children,
  ...props
}) {
  const classes = [
    "inline-flex cursor-pointer items-center justify-center rounded-xl font-bold transition-[color,background-color,border-color,transform,box-shadow] duration-200 focus-visible:ring-4 focus-visible:ring-brand-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
