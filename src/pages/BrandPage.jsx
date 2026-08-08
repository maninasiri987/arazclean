import { useParams } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ProductListing from "../components/product/ProductListing.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { getBrandBySlug, getProductCountByBrand } from "../services/catalog.js";
import { formatNumber } from "../utils/format.js";

/**
 * صفحهٔ برند — فهرست محصولات یک برند خاص (ممکن است خالی باشد).
 */
export default function BrandPage() {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);

  if (!brand) return <NotFoundPage />;

  const count = getProductCountByBrand(slug);

  return (
    <>
      <Seo
        title={`برند ${brand.name}`}
        description={brand.description || brand.tagline}
      />
      <PageHero
        title={`برند ${brand.name}`}
        subtitle={
          count > 0
            ? `${brand.tagline} — ${formatNumber(count)} محصول از این برند در آراز کلین`
            : brand.tagline
        }
        breadcrumb={[
          { label: "برندها", to: "/brands" },
          { label: brand.name },
        ]}
      />
      <div className="pt-6">
        <ProductListing forceBrand={slug} perPage={12} />
      </div>
    </>
  );
}
