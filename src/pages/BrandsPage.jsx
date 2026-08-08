import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import BrandCard from "../components/home/BrandCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Reveal from "../components/common/Reveal.jsx";
import { getBrandsWithCounts } from "../services/catalog.js";

/**
 * صفحهٔ برندها — به‌صورت پویا از دادهٔ محصولات ساخته می‌شود
 * (فقط برندهای یکتا که محصول دارند).
 */
export default function BrandsPage() {
  const brands = getBrandsWithCounts();

  return (
    <>
      <Seo
        title="برندها"
        description="برندهای معتبر و همکار آراز کلین در صنعت نظافت و شوینده."
      />
      <PageHero
        title="برندهای همکار"
        subtitle="فروشگاه آراز کلین محصولات معتبرترین برندهای صنعت نظافت را عرضه می‌کند"
        breadcrumb={[{ label: "برندها" }]}
      />

      <div className="max-w-site mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {brands.length === 0 ? (
          <EmptyState
            title="برندی یافت نشد"
            description="هنوز محصولی ثبت نشده است؛ به محض افزودن اولین محصول، برندها در اینجا نمایش داده می‌شوند."
          />
        ) : (
          <Reveal>
            <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:gap-x-10">
              {brands.map((brand) => (
                <BrandCard key={brand.slug} brand={brand} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}
