import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { assetPath } from "../../utils/assets.js";

/**
 * تصویر هوشمند — lazy loading + اسکلت بارگذاری + fade-in + جای‌نویس خطا.
 *
 * - مسیر با `assetPath` پایه‌دار می‌شود (سازگار با GitHub Pages).
 * - برای جلوگیری از پرش چیدمان، حتماً نسبت ابعاد (مثل `aspect-square`)
 *   را روی `className` (ظرف) بدهید.
 * - اسکلت از کلاس `.skeleton-shimmer` استفاده می‌کند که با هر دو پوستهٔ
 *   روشن و تاریک سازگار است.
 */
export default function SmartImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const resolved = assetPath(src);

  // بازنشانی وضعیت هنگام تغییر منبع تصویر (مثل تعویض نمای گالری محصول)
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [resolved]);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* اسکلت — تا بارگذاری کامل تصویر (فقط وقتی منبع معتبر است) */}
      {resolved && !loaded && !error && (
        <span
          aria-hidden="true"
          className="skeleton-shimmer absolute inset-0"
        />
      )}

      {resolved && !error ? (
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${imgClassName} transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        error && (
          <span
            role="img"
            aria-label={alt || "تصویر در دسترس نیست"}
            className="absolute inset-0 flex items-center justify-center bg-card text-muted/40"
          >
            <ImageOff className="size-8" strokeWidth={1.5} aria-hidden="true" />
          </span>
        )
      )}
    </div>
  );
}
