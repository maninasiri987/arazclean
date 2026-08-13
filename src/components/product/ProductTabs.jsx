import { useState } from "react";
import Rating from "../ui/Rating.jsx";
import { toFaDigits } from "../../utils/format.js";

const REVIEW_TEMPLATES = [
  {
    name: "مریم احمدی",
    text: "کیفیت بسیار خوبی داشت و خیلی سریع ارسال شد. حتماً دوباره خرید می‌کنم.",
  },
  {
    name: "علی رستمی",
    text: "نسبت به قیمتش عملکرد عالی داره. راضی هستم از خریدم.",
  },
  {
    name: "سارا موسوی",
    text: "بسته‌بندی تمیز و مرتب بود. رایحه‌اش هم دقیقاً همونی بود که انتظار داشتم.",
  },
];

const TABS = [
  { id: "description", label: "توضیحات" },
  { id: "specs", label: "مشخصات" },
  { id: "reviews", label: "نظرات" },
];

/**
 * تب‌های صفحهٔ محصول — توضیحات / مشخصات / نظرات (دادهٔ نمایشی)
 */
export default function ProductTabs({ product }) {
  const [active, setActive] = useState("description");
  // اگر محصول نظر ثبت‌شده داشته باشد همان نمایش داده می‌شود؛ در غیر این صورت نمونهٔ نمایشی
  const reviews =
    product.comments && product.comments.length > 0
      ? product.comments
      : REVIEW_TEMPLATES.map((r, i) => ({
          ...r,
          rating: 3.5 + ((product.id + i) % 15) / 10,
        }));

  return (
    <div className="rounded-card border border-line bg-card shadow-card">
      {/* نوار تب */}
      <div role="tablist" aria-label="اطلاعات محصول" className="flex border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`relative cursor-pointer px-5 py-4 text-sm font-bold transition-colors duration-200 ${
              active === tab.id ? "text-brand-600" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand-500 transition-opacity ${
                active === tab.id ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        ))}
      </div>

      {/* پنل توضیحات */}
      {active === "description" && (
        <div role="tabpanel" id="panel-description" aria-labelledby="tab-description" className="p-6">
          <p className="text-sm leading-8 text-muted">{product.description}</p>
        </div>
      )}

      {/* پنل مشخصات */}
      {active === "specs" && (
        <div role="tabpanel" id="panel-specs" aria-labelledby="tab-specs" className="p-6">
          <dl className="divide-y divide-line rounded-xl border border-line">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-4 px-4 py-3 sm:grid-cols-[200px_1fr]">
                <dt className="text-sm font-bold text-ink">{spec.label}</dt>
                <dd className="text-sm text-muted">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* پنل نظرات */}
      {active === "reviews" && (
        <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" className="space-y-4 p-6">
          <p className="flex items-center gap-3 text-sm text-muted">
            میانگین امتیاز:
            <Rating value={product.rating} />
          </p>
          {reviews.map((review, i) => (
            <article key={i} className="rounded-xl border border-line bg-background/50 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-black text-ink">{review.name}</h4>
                <Rating value={review.rating} size="size-3.5" />
              </div>
              <p className="text-sm leading-7 text-muted">{review.text}</p>
              <p className="mt-2 text-[11px] text-muted/60">
                {review.verified !== false ? "خریدار تأییدشده — " : ""}
                {review.date || `${toFaDigits(12 + i)} روز پیش`}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
