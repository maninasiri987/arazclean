import { Star, StarHalf } from "lucide-react";
import { toFaDigits } from "../../utils/format.js";

/**
 * نمایش امتیاز با ستاره — با aria-label برای دسترس‌پذیری
 */
export default function Rating({ value = 0, count, size = "size-4" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.25 && value - full < 0.75;
  const empty = 5 - full - (half ? 1 : 0);
  const label = `امتیاز ${toFaDigits(value)} از ۵`;

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={label}
      role="img"
      title={label}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} className={`${size} fill-amber-400 text-amber-400`} />
        ))}
        {/* در RTL ستاره‌ها از راست پر می‌شوند؛ نیم‌ستاره باید پر شدگیِ سمت راست داشته باشد */}
        {half && (
          <StarHalf className={`${size} -scale-x-100 fill-amber-400 text-amber-400`} />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} className={`${size} text-line`} />
        ))}
      </span>
      <span className="text-xs font-bold text-muted">{toFaDigits(value)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted/70">({toFaDigits(count)})</span>
      )}
    </div>
  );
}
