import { useLocation } from "react-router-dom";
import LoadingSkeleton from "../ui/LoadingSkeleton.jsx";

/**
 * اسکلت صفحه هنگام بارگذاری lazy — بر اساس مسیر فعلی، طرح مناسب نمایش داده می‌شود:
 * خانه، فهرست محصولات، جزئیات محصول، پنل مدیریت و بقیهٔ صفحات.
 */
export default function RouteFallback() {
  const { pathname } = useLocation();

  // ─── خانه ───
  if (pathname === "/") {
    return (
      <div className="max-w-site mx-auto space-y-14 px-4 pb-16 pt-4 sm:px-6 sm:space-y-20 sm:pt-6 lg:px-8">
        <div className="skeleton-shimmer h-[180px] rounded-card sm:h-[400px]" />
        <div className="space-y-4">
          <div className="skeleton-shimmer h-7 w-48 rounded-lg" />
          <LoadingSkeleton variant="card" count={8} />
        </div>
        <div className="space-y-4">
          <div className="skeleton-shimmer h-7 w-40 rounded-lg" />
          <LoadingSkeleton variant="card" count={8} />
        </div>
      </div>
    );
  }

  // ─── جزئیات محصول ───
  if (pathname.startsWith("/product/")) {
    return (
      <div className="max-w-site mx-auto grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="skeleton-shimmer aspect-square rounded-card" />
        <div className="space-y-4 pt-2">
          <div className="skeleton-shimmer h-4 w-28 rounded-lg" />
          <div className="skeleton-shimmer h-9 w-3/4 rounded-xl" />
          <div className="skeleton-shimmer h-5 w-44 rounded-lg" />
          <div className="skeleton-shimmer h-32 rounded-card" />
          <div className="skeleton-shimmer h-12 w-56 rounded-xl" />
        </div>
      </div>
    );
  }

  // ─── پنل مدیریت ───
  if (pathname.startsWith("/admin")) {
    return (
      <div className="max-w-site mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="list" count={6} />
      </div>
    );
  }

  // ─── فهرست محصولات / دسته / برند / درباره / تماس / … ───
  return (
    <div className="max-w-site mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="skeleton-shimmer mb-4 h-4 w-56 rounded-lg" />
      <div className="skeleton-shimmer mb-3 h-10 w-72 max-w-full rounded-xl" />
      <div className="skeleton-shimmer mb-10 h-4 w-96 max-w-full rounded-lg" />
      <LoadingSkeleton variant="card" count={8} />
    </div>
  );
}
