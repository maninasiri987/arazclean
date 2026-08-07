import { BadgePercent } from "lucide-react";
import Button from "../ui/Button.jsx";

/**
 * بنر تبلیغاتی بزرگ — بدون تصویر واقعی، فقط گرادیان + جای‌نویس
 */
export default function PromoBanner() {
  return (
    <section aria-label="بنر تبلیغاتی" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-l from-brand-600 via-brand-500 to-trust-600 p-8 shadow-card sm:p-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.5) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
        <div aria-hidden="true" className="absolute -bottom-24 -left-16 size-72 rounded-full bg-white/5" />

        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
              <BadgePercent className="size-3.5" aria-hidden="true" />
              جشنوارهٔ تابستانه
            </span>
            <h2 className="mt-4 text-2xl font-black leading-snug text-white sm:text-3xl">
              خرید عمدهٔ شوینده‌ها با تخفیف‌های ویژه
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-white/85">
              برای خانواده‌ها، هتل‌ها و مراکز خدماتی؛ سبد کامل محصولات نظافت را با
              شرایط ویژه تهیه کنید.
            </p>
            <div className="mt-6">
              <Button to="/products" variant="white" size="lg">
                مشاهده محصولات
              </Button>
            </div>
          </div>

          <div className="hidden aspect-[4/3] max-w-sm items-center justify-center overflow-hidden rounded-card border border-white/20 bg-white/10 backdrop-blur md:flex" aria-hidden="true">
            <div className="flex flex-col items-center gap-3 text-white/90">
              <BadgePercent className="size-12" strokeWidth={1.5} />
              <span className="text-sm font-bold">تصویر تبلیغاتی</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
