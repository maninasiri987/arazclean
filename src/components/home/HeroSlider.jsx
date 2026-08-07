import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { getHeroSlides } from "../../services/catalog.js";
import Button from "../ui/Button.jsx";

/**
 * اسلایدر هیرو — هر اسلاید یک تصویر پس‌زمینهٔ تمام‌عرض است
 * (مثل بنرهای دیجی‌کالا) و متن + دکمه روی همان تصویر قرار می‌گیرد.
 * ارتفاع ثابت و متناسب با ابعاد بنرها:
 * موبایل ۳۹۰×۵۲۰ / تبلت ۱۰۲۴×۴۸۰ / لپ‌تاپ ۱۲۸۰×۵۰۰ / دسکتاپ ۱۴۴۰×۵۶۰
 */
export default function HeroSlider() {
  const slides = getHeroSlides();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section aria-label="اسلایدر ویژه" className="w-full">
      {/* موبایل/تبلت: داخل کانتینر با گوشهٔ گرد — دسکتاپ: تمام‌عرض و بدون گردی */}
      <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:max-w-none lg:px-0">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          watchOverflow
          pagination={{ clickable: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          dir="rtl"
          className="hero-swiper overflow-hidden rounded-card shadow-card lg:rounded-none lg:shadow-none"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              {/* تصویر پس‌زمینهٔ اسلاید — یک لایهٔ واحد، بدون المان‌های اضافه */}
              <div
                className="relative flex h-[390px] items-center overflow-hidden md:h-[360px] lg:h-[375px] xl:h-[420px]"
                style={{
                  background: slide.image,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* گرادیان تیره برای خوانایی متن (سمت متن) */}
                <div
                  className="absolute inset-0 bg-gradient-to-l from-ink/60 via-ink/25 to-transparent"
                  aria-hidden="true"
                />

                <div className="relative w-full px-6 py-10 sm:px-12 lg:px-16">
                  <div className="max-w-xl">
                    {slide.badge && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white">
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="mt-5 text-2xl font-black leading-[1.2] text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
                      {slide.title}
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/90 sm:mt-4 sm:text-base">
                      {slide.description}
                    </p>
                    <div className="mt-6 sm:mt-8">
                      <Button to={slide.ctaTo} variant="white" size="lg">
                        {slide.ctaLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* دکمه‌های حرکت بین اسلایدها — گوشهٔ پایین راست */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <button
              ref={prevRef}
              type="button"
              aria-label="اسلاید قبلی"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition-[background-color,transform] hover:bg-white/30 active:scale-95"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label="اسلاید بعدی"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition-[background-color,transform] hover:bg-white/30 active:scale-95"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  );
}
