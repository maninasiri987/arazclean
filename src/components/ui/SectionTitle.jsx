import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * عنوان بخش‌های صفحه با لینک اختیاری «مشاهده همه»
 */
export default function SectionTitle({ title, subtitle, linkText, linkTo, className = "" }) {
  return (
    <div className={`mb-6 flex items-end justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-xl font-black text-ink sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="group flex shrink-0 items-center gap-1 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
        >
          {linkText}
          <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
