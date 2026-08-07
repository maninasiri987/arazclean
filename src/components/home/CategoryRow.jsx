import { getCategories } from "../../services/catalog.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import CategoryCard from "./CategoryCard.jsx";
import Reveal from "../common/Reveal.jsx";

export default function CategoryRow() {
  const categories = getCategories();
  return (
    <section aria-labelledby="categories-title" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="دسته‌بندی محصولات"
        subtitle="هر آنچه برای نظافت خانه و محل کار نیاز دارید"
        linkText="همهٔ دسته‌بندی‌ها"
        linkTo="/products"
      />
      <Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
