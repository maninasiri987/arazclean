import { getBrands } from "../../services/catalog.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import BrandCard from "./BrandCard.jsx";
import Reveal from "../common/Reveal.jsx";

export default function BrandLogoGrid() {
  const brands = getBrands();
  return (
    <section aria-labelledby="brands-title" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="برندهای معتبر"
        subtitle="همکاری با معتبرترین برندهای صنعت نظافت"
        linkText="همهٔ برندها"
        linkTo="/brands"
      />
      <Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
