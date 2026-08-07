import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import BrandCard from "../components/home/BrandCard.jsx";
import Reveal from "../components/common/Reveal.jsx";
import { getBrands } from "../services/catalog.js";

export default function BrandsPage() {
  const brands = getBrands();

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
        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <BrandCard key={brand.slug} brand={brand} />
            ))}
          </div>
        </Reveal>
      </div>
    </>
  );
}
