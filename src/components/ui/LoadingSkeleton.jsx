const base = "animate-pulse rounded-xl bg-line/60";

/**
 * اسکلت بارگذاری — variants: card, list, hero, text
 */
export default function LoadingSkeleton({ variant = "card", count = 4 }) {
  if (variant === "hero") {
    return (
      <div className="grid grid-cols-1 gap-8 rounded-card bg-card p-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className={`${base} h-40`} />
            <div className={`${base} h-4 w-3/4`} />
            <div className={`${base} h-3 w-1/2`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${base} h-14`} />
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className="space-y-3">
        <div className={`${base} h-6 w-2/3`} />
        <div className={`${base} h-3 w-full`} />
        <div className={`${base} h-3 w-5/6`} />
      </div>
    );
  }

  // card (پیش‌فرض)
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-card border border-line bg-card p-3">
          <div className={`${base} aspect-square`} />
          <div className={`${base} h-4 w-3/4`} />
          <div className={`${base} h-3 w-1/2`} />
          <div className={`${base} h-6 w-2/3`} />
        </div>
      ))}
    </div>
  );
}
