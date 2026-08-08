import { getBrandsWithCounts } from "../../services/catalog.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import BrandCard from "./BrandCard.jsx";
import Reveal from "../../components/common/Reveal.jsx";

export default function BrandLogoGrid() {
  const brands = getBrandsWithCounts().filter((b) => b.logo);
  // اگر برندی با لوگو باقی نمانده (فعلاً فقط محصولات آراز کلین هستند)،
  // کل بخش نمایش داده نمی‌شود تا خالی به‌نظر نرسد.
  if (brands.length === 0) return null;
  return (
    <section aria-labelledby="brands-title" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="برندهای معتبر"
        subtitle="همکاری با معتبرترین برندهای صنعت نظافت"
        linkText="همهٔ برندها"
        linkTo="/brands"
      />
      <Reveal>
        {/* یک ردیف اسکرول‌پذیر افقی (راست به چپ) بدون نمایش اسکرول‌بار */}
        <div className="no-scrollbar -mx-4 flex items-center gap-x-6 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-x-8 sm:px-6 lg:-mx-8 lg:px-8">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
