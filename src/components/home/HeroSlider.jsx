import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { getHeroSlides } from "../../services/catalog.js";
import Button from "../ui/Button.jsx";

/**
 * اسلایدر هیرو — هر اسلاید یک تصویر پس‌زمینهٔ تمام‌عرض است
 * (مثل بنرهای دیجی‌کالا) و متن + دکمه روی همان تصویر قرار می‌گیرد.
 * فعلاً به‌جای عکس واقعی، گرادیان‌های غنی جای‌نویس تصویر هستند؛
 * بعداً کافی است `image` در hero.json با آدرس واقعی عکس جایگزین شود.
 */
export default function HeroSlider() {
  const slides = getHeroSlides();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // اتصال دکمه‌های سفارشی به ماژول Navigation سوییپر
  const onBeforeInit = (swiper) => {
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  };

  return (
    <section aria-label="اسلایدر ویژه" className="w-full">
      {/* موبایل/تبلت: داخل کانتینر با گوشهٔ گرد — دسکتاپ: تمام‌عرض و بدون گردی */}
      <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:max-w-none lg:px-0">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        watchOverflow
        pagination={{ clickable: true }}
        onBeforeInit={onBeforeInit}
        dir="rtl"
        className="hero-swiper overflow-hidden rounded-card shadow-card lg:rounded-none lg:shadow-none"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* تصویر پس‌زمینهٔ اسلاید — یک لایهٔ واحد، بدون المان‌های اضافه */}
            <div
              className="relative flex h-[180px] w-full items-center overflow-hidden sm:h-[400px]"
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

              <div className="relative w-full px-5 py-4 sm:px-12 sm:py-10 lg:px-16">
                <div className="max-w-xl">
                  {slide.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="mt-3 text-xl font-black leading-[1.2] text-white drop-shadow-sm sm:mt-4 sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h1>
                  <p className="mt-3 hidden max-w-md text-sm leading-7 text-white/90 sm:mt-4 sm:block sm:text-base">
                    {slide.description}
                  </p>
                  <div className="mt-5 hidden sm:mt-8 sm:block">
                    <Button to={slide.ctaTo} variant="white" size="lg">
                      {slide.ctaLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* دکمه‌های قبلی/بعدی — پایین سمت راست، فقط در نمایشگرهای بزرگ‌تر (موبایل: مخفی) */}
        <div className="absolute bottom-4 right-4 z-10 hidden gap-2 sm:flex">
          <button
            ref={prevRef}
            type="button"
            aria-label="اسلاید قبلی"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-ink shadow-card transition-colors hover:bg-white"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="اسلاید بعدی"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-ink shadow-card transition-colors hover:bg-white"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
        </div>
      </Swiper>
      </div>
    </section>
  );
}
