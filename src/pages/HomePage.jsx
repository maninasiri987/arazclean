import { useMemo } from "react";
import Seo from "../components/common/Seo.jsx";
import Reveal from "../components/common/Reveal.jsx";
import HeroSlider from "../components/home/HeroSlider.jsx";
import ValuePropsStrip from "../components/home/ValuePropsStrip.jsx";
import CategoryRow from "../components/home/CategoryRow.jsx";
import PromoBanner from "../components/home/PromoBanner.jsx";
import BrandLogoGrid from "../components/home/BrandLogoGrid.jsx";
import Newsletter from "../components/home/Newsletter.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { getFeaturedProducts, getNewProducts } from "../services/catalog.js";

export default function HomePage() {
  // memoize filtered lists so they don't re-calculate on every render
  const { featured, fresh } = useMemo(
    () => ({ featured: getFeaturedProducts(8), fresh: getNewProducts(8) }),
    []
  );

  return (
    <>
      <Seo
        description="آراز کلین؛ فروشگاه تخصصی محصولات نظافت و شوینده با ضمانت اصالت کالا و ارسال سریع به سراسر کشور."
      />

      <div className="space-y-14 pb-16 pt-4 sm:space-y-20 sm:pt-6">
        <HeroSlider />

        {/* دسته‌بندی محصولات — دایره‌ای، بالای برندهای معتبر */}
        <CategoryRow />

        {/* برندهای معتبر — بالای پرفروش‌ترین‌ها */}
        <BrandLogoGrid />

        <section aria-labelledby="featured-title" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="پرفروش‌ترین‌ها"
            subtitle="محبوب‌ترین محصولات بین مشتریان آراز کلین"
            linkText="مشاهده همه"
            linkTo="/products?sort=popular"
          />
          <Reveal>
            <ProductGrid products={featured} />
          </Reveal>
        </section>

        <PromoBanner />

        <section aria-labelledby="new-title" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="تازه‌های آراز کلین"
            subtitle="جدیدترین محصولات وارد شده به فروشگاه"
            linkText="مشاهده همه"
            linkTo="/products?sort=newest"
          />
          <Reveal>
            <ProductGrid products={fresh} />
          </Reveal>
        </section>

        {/* مزایای خرید — بالای خبرنامه در پایین صفحه (ابتدای فوتر) */}
        <ValuePropsStrip />

        <Newsletter />
      </div>
    </>
  );
}
