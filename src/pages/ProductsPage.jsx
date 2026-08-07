import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ProductListing from "../components/product/ProductListing.jsx";

export default function ProductsPage() {
  return (
    <>
      <Seo
        title="محصولات"
        description="همهٔ محصولات نظافت و شوینده آراز کلین؛ با فیلتر بر اساس دسته، برند، قیمت و موجودی."
      />
      <PageHero
        title="همهٔ محصولات"
        subtitle="کامل‌ترین سبد محصولات نظافت و شوینده برای منزل، محل کار و مراکز صنعتی"
      />
      <div className="pt-6">
        <ProductListing />
      </div>
    </>
  );
}
