import { Helmet } from "react-helmet-async";
import { getSettings } from "../../services/catalog.js";

/**
 * مدیریت عنوان و توضیحات هر صفحه
 */
export default function Seo({ title, description }) {
  const { siteName } = getSettings();
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
