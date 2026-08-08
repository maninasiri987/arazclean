import { Link, useParams } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ProductListing from "../components/product/ProductListing.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import {
  getCategoryBySlug,
  getProductsByCategory,
  getProductsBySubcategory,
} from "../services/catalog.js";
import { formatNumber } from "../utils/format.js";

/**
 * صفحهٔ دسته‌بندی — از دادهٔ JSON به‌صورت پویا ساخته می‌شود.
 * از مسیر `/category/:slug` و `/category/:slug/:subslug` پشتیبانی می‌کند.
 */
export default function CategoryPage() {
  const { slug, subslug } = useParams();
  const category = getCategoryBySlug(slug);
  const subcategory = subslug
    ? category?.subcategories?.find((s) => s.slug === subslug)
    : null;

  if (!category) return <NotFoundPage />;
  if (subslug && !subcategory) return <NotFoundPage />;

  const count = subcategory
    ? getProductsBySubcategory(category.slug, subcategory.slug).length
    : getProductsByCategory(category.slug).length;

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
            const subCount = getProductsBySubcategory(category.slug, sub.slug).length;
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
