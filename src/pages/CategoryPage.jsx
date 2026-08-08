import { Link, useParams } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ProductListing from "../components/product/ProductListing.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import {
  getCategoryBySlug,
  getCategoryProductCount,
  getSubcategoryProductCount,
} from "../services/catalog.js";
import { formatNumber } from "../utils/format.js";

export default function CategoryPage() {
  const { slug, subslug } = useParams();
  const category = getCategoryBySlug(slug);
  const subcategory = subslug
    ? category?.subcategories?.find((s) => s.slug === subslug)
    : null;

  if (!category) return <NotFoundPage />;
  if (subslug && !subcategory) return <NotFoundPage />;

  const count = subcategory
    ? getSubcategoryProductCount(category.slug, subcategory.slug)
    : getCategoryProductCount(category.slug);

  const title = subcategory ? subcategory.title : category.title;
  const subtitle = category.description;

  return (
    <>
      <Seo
        title={title}
        description={subcategory ? `${subcategory.title} — ${category.title}` : subtitle}
      />
      <PageHero
        title={title}
        subtitle={subtitle}
        breadcrumb={[
          { label: "دسته‌بندی‌ها", to: "/products" },
          { label: category.title, to: `/category/${category.slug}` },
          ...(subcategory ? [{ label: subcategory.title }] : []),
        ]}
      >
        {/* چیپ‌های زیردسته — جابه‌جایی سریع بین زیردسته‌های همین دسته */}
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="زیردسته‌ها">
          {!subcategory && (
            <Link
              to={`/category/${category.slug}`}
              aria-current="page"
              className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-bold text-white shadow-card"
            >
              همه ({formatNumber(count)})
            </Link>
          )}
          {category.subcategories?.map((sub) => {
            const active = subcategory?.slug === sub.slug;
            const subCount = getSubcategoryProductCount(category.slug, sub.slug);
            if (subCount === 0) return null;
            return (
              <Link
                key={sub.slug}
                to={`/category/${category.slug}/${sub.slug}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 ${
                  active
                    ? "bg-brand-500 text-white shadow-card"
                    : "border border-line bg-card text-muted hover:border-brand-500 hover:text-brand-600"
                }`}
              >
                {sub.title} ({formatNumber(subCount)})
              </Link>
            );
          })}
        </div>
      </PageHero>

      <div className="pt-6">
        <ProductListing
          forceCategory={category.slug}
          forceSubcategory={subslug}
          perPage={12}
        />
      </div>
    </>
  );
}
