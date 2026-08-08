import { getCategories } from "../../services/catalog.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import CategoryCard from "./CategoryCard.jsx";
import Reveal from "../../components/common/Reveal.jsx";

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
        {/* یک ردیف — اسکرول افقی بدون نمایش اسکرول‌بار */}
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:px-8">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
