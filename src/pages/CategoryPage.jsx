import { useParams } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ProductListing from "../components/product/ProductListing.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { getCategoryBySlug, getProductsByCategory } from "../services/catalog.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const count = category ? getProductsByCategory(category.slug).length : 0;

  if (!category) return <NotFoundPage />;

  return (
    <>
      <Seo
        title={category.title}
        description={category.description}
      />
      <PageHero
        title={category.title}
        subtitle={category.description}
        breadcrumb={[{ label: category.title }]}
      />
      <div className="pt-6">
        <ProductListing forceCategory={category.slug} perPage={12} />
      </div>
    </>
  );
}
