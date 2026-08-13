import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import { getHeroSlides } from "../../services/catalog.js";
import { assetPath } from "../../utils/assets.js";
import Button from "../ui/Button.jsx";

const AUTOPLAY_DELAY = 6000;
const DESKTOP_QUERY = "(min-width: 640px)";

/**
 * اسلایدر هیرو — ردِ واقعی اسکرول‌پذیر (scroll-snap).
 * موبایل: با کشیدن انگشت به‌صورت طبیعی اسکرول می‌شود (بدون JS).
 * دسکتاپ: پخش خودکار + دکمه‌های قبلی/بعدی + نقاط صفحه‌بندی.
 *
 * نکتهٔ فنی:
 * - ارتفاع فقط روی ویوپورت است؛ رد `h-full` و هر اسلاید `w-full shrink-0`
 *   است تا در همهٔ مرورگرها یکسان پهنای اسلایدها پهنای ویوپورت باشد.
 * - رد `dir="rtl"` است؛ اسکرول و پخش خودکار از راست به چپ (طبیعی برای فارسی).
 */
export default function HeroSlider() {
  const slides = getHeroSlides();
  const total = slides.length;

  const viewportRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );

  // فقط دسکتاپ پخش خودکار دارد؛ موبایل ناوبری دستی اسکرولی است
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const scrollToIndex = useCallback(
    (i, smooth = true) => {
      const el = viewportRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(i, total - 1));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // رد RTL است؛ اسلاید بعدی × مقدار منفی (جهت راست‌به‌چپ)
      el.scrollTo({
        left: -(clamped * el.clientWidth),
        behavior: smooth && !reduce ? "smooth" : "auto",
      });
    },
    [total]
  );

  // در شروع، مطمئن می‌شویم ویوپورت روی اسلاید اول است (مثلاً پس از رفرش)
  useEffect(() => {
    scrollToIndex(0, false);
  }, [scrollToIndex]);

  // همگام‌سازی شاخص با اسکرول واقعی کاربر (موبایل + صفحه‌کلید)
  const onScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    setIndex((prev) => (prev === i ? prev : i));
  }, []);

  const goTo = useCallback(
    (i) => {
      const clamped = Math.max(0, Math.min(i, total - 1));
      setIndex(clamped);
      scrollToIndex(clamped);
    },
    [scrollToIndex, total]
  );

  // پخش خودکار — فقط دسکتاپ و نامکث و وقتی بیش از یک اسلاید هست
  useEffect(() => {
    if (!isDesktop || paused || total < 2) return undefined;
    const timer = setTimeout(() => {
      goTo((index + 1) % total);
    }, AUTOPLAY_DELAY);
    return () => clearTimeout(timer);
  }, [isDesktop, paused, index, total, goTo]);

  // وقتی عرض پنجره عوض می‌شود، اسنپ روی اسلاید فعلی می‌ماند
  useEffect(() => {
    const onResize = () => scrollToIndex(index, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, scrollToIndex]);

  return (
    <section aria-label="اسلایدر ویژه" className="w-full">
      {/* موبایل/تبلت: داخل کانتینر با گوشهٔ گرد — دسکتاپ: تمام‌عرض و بدون گردی */}
      <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:max-w-none lg:px-0">
        <div
          className="relative overflow-hidden rounded-card shadow-card lg:rounded-none lg:shadow-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* رویهٔ اسکرول‌پذیر: موبایل با انگشت، دسکتاپ با JS
              چیدمان RTL؛ پخش خودکار و اسکرول از راست به چپ است */}
          <div
            ref={viewportRef}
            dir="rtl"
            onScroll={onScroll}
            className="no-scrollbar h-[260px] w-full overflow-x-auto overflow-y-hidden sm:h-[380px] lg:h-[420px]"
            style={{ scrollSnapType: "x mandatory" }}
          >
            <div className="flex h-full" aria-live="polite">
              {slides.map((slide, i) => {
                // فقط اسلایدِ نمایش‌داده‌شده <h1> است؛ بقیه <h2> — هر صفحه فقط یک h1 (سئو)
                const Heading = i === index ? "h1" : "h2";
                const isGradient = slide.image?.startsWith("linear-") || slide.image?.startsWith("radial-");
                const bgStyle = isGradient
                  ? { background: slide.image }
                  : {
                      backgroundImage: `url("${assetPath(slide.image)}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    };

                return (
                <div
                  key={slide.id}
                  className="relative flex h-full w-full shrink-0 snap-start items-center overflow-hidden"
                  style={bgStyle}
                >
                  <div className="relative w-full px-6 py-6 sm:px-14 sm:py-12 lg:px-20">
                    <div className="flex flex-col items-start gap-3 sm:gap-5">
                      {/* تایتل با بکگراند و متن سفید دقیقاً مشابه دکمه — بدون حالت کلیک */}
                      <Heading className="inline-flex cursor-default select-none items-center rounded-2xl bg-brand-500 px-5 py-2.5 text-base font-black text-white shadow-xl sm:px-8 sm:py-4 sm:text-2xl lg:text-3xl">
                        {slide.title}
                      </Heading>

                      {/* دکمهٔ مشاهده و خرید */}
                      <div className="flex items-center gap-3">
                        <Button
                          to={slide.ctaTo}
                          variant="white"
                          size="lg"
                          className="!px-6 !py-3 font-black text-xs sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-brand-100"
                        >
                          <span>{slide.ctaLabel}</span>
                          <ArrowLeft className="size-4.5 -scale-x-100" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* دکمه‌های ناوبری — فقط دسکتاپ (موبایل: اسکرول دستی)
              چیدمان صریح LTR: فلش چپ (<) = بعدی، فلش راست (>) = قبلی.
              غیرفعال‌سازی مطابق جهت حرکت محتوا:
              - فلش چپ در آخرین اسلاید غیرفعال (دیگر بعدی نیست)
              - فلش راست در اولین اسلاید غیرفعال (دیگر قبلی نیست) */}
          <div dir="ltr" className="absolute bottom-4 right-4 z-10 hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="اسلاید بعدی"
              onClick={() => goTo(index + 1)}
              disabled={index === total - 1}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-ink shadow-card transition-all hover:bg-white disabled:cursor-default disabled:opacity-40"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="اسلاید قبلی"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-ink shadow-card transition-all hover:bg-white disabled:cursor-default disabled:opacity-40"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* نقاط صفحه‌بندی — وسط اسلایدر؛ فقط دسکتاپ.
              dir="rtl" تا ترتیب نقاط هم‌راستا با ترتیب RTL اسلایدها باشد */}
          {total > 1 && (
            <div
              dir="rtl"
              className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink/40 p-1.5 backdrop-blur-sm sm:flex"
            >
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`برو به اسلاید ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-200 ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}