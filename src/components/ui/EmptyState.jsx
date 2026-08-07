import { PackageSearch } from "lucide-react";

/**
 * حالت خالی — وقتی نتیجه/داده‌ای وجود ندارد
 */
export default function EmptyState({
  title = "نتیجه‌ای یافت نشد",
  description = "عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-card px-6 py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand-50">
        <PackageSearch className="size-8 text-brand-500" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
