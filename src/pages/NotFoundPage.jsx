import { SearchX } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Search from "../components/layout/Search.jsx";
import Button from "../components/ui/Button.jsx";
import { toFaDigits } from "../utils/format.js";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="صفحه یافت نشد" description="صفحهٔ موردنظر شما وجود ندارد." />
      <div className="max-w-site mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-brand-50">
          <SearchX className="size-10 text-brand-500" aria-hidden="true" />
        </div>
        <p className="mt-6 text-7xl font-black text-brand-500">{toFaDigits(404)}</p>
        <h1 className="mt-2 text-2xl font-black text-ink">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted">
          ممکن است آدرس تغییر کرده یا صفحه حذف شده باشد. از جستجو استفاده کنید یا به
          صفحهٔ اصلی برگردید.
        </p>
        <div className="mt-8 w-full max-w-md">
          <Search />
        </div>
        <div className="mt-6 flex gap-3">
          <Button to="/" variant="primary">
            بازگشت به خانه
          </Button>
          <Button to="/products" variant="outline">
            مشاهدهٔ محصولات
          </Button>
        </div>
      </div>
    </>
  );
}
