import { BadgePercent, ArrowLeft, PhoneCall } from "lucide-react";
import Button from "../ui/Button.jsx";
import SmartImage from "../ui/SmartImage.jsx";

/**
 * بنر تبلیغاتی بزرگ — با تصویر اختصاصی سه‌بعدی و دکمه‌های کنشی داخل کانتینر
 */
export default function PromoBanner() {
  return (
    <section aria-label="بنر تبلیغاتی" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-l from-brand-700 via-brand-600 to-trust-700 p-5 sm:p-8 lg:p-10 shadow-xl">
        {/* پترن پس‌زمینه تزئینی */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.6) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-xl" />
        <div aria-hidden="true" className="absolute -bottom-20 -left-12 size-64 rounded-full bg-brand-400/20 blur-xl" />

        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          {/* متن و دکمه‌های کانتینر */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
              <BadgePercent className="size-4" aria-hidden="true" />
              جشنوارهٔ فصلی پاکیزگی و بهداشت
            </span>

            <h2 className="text-xl font-black leading-snug text-white sm:text-2xl lg:text-3xl">
              خرید عمده و تکی شوینده‌ها با تخفیف‌های ویژه
            </h2>

            <p className="max-w-lg text-xs leading-6 text-white/90 sm:text-sm sm:leading-7">
              مجموعه‌ای کامل از برترین شوینده‌های ظروف، سطوح و البسه با ضمانت اصالت کالا، ارسال فوری و تضمین بهترین قیمت بازار برای منازل، هتل‌ها و ارگان‌ها.
            </p>

            {/* دکمه‌های داخل کانتینر */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button to="/products" variant="white" size="lg" className="!px-5 !py-2.5 font-bold text-sm shadow-md hover:shadow-lg transition-all">
                مشاهده و خرید محصولات
              </Button>
              <Button to="/contact" variant="ghost" size="lg" className="!px-5 !py-2.5 font-bold text-sm text-white border border-white/30 hover:bg-white/15 transition-all">
                <PhoneCall className="size-4 ml-1.5" />
                مشاوره و خرید عمده
              </Button>
            </div>
          </div>

          {/* تصویر باکیفیت سکشن — نمایش در تمام اندازه‌ها */}
          <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/30 shadow-2xl bg-white/10 backdrop-blur-sm">
            <SmartImage
              src="/images/banners/promo-clean.jpg"
              alt="خرید عمده و تکی شوینده‌ها با تخفیف‌های ویژه"
              className="aspect-[16/9] sm:aspect-[16/10] w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
