import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import BlogCard from "../components/home/BlogCard.jsx";
import ImagePlaceholder from "../components/ui/ImagePlaceholder.jsx";
import Reveal from "../components/common/Reveal.jsx";
import { getBlogPosts } from "../services/catalog.js";

export default function BlogPage() {
  const posts = getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Seo
        title="مجله آراز کلین"
        description="مقالات آموزشی نظافت خانه، مراقبت از لباس و ترفندهای حرفه‌ای."
      />
      <PageHero
        title="مجلهٔ آراز کلین"
        subtitle="نکات، ترفندها و دانستنی‌های دنیای نظافت"
        breadcrumb={[{ label: "مجله" }]}
      />

      <div className="max-w-site mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* مقالهٔ ویژه */}
        {featured && (
          <Reveal>
            <article className="group mb-10 grid grid-cols-1 overflow-hidden rounded-card border border-line bg-card shadow-card md:grid-cols-2">
              <Link
                to={`/blog/${featured.slug}`}
                className="relative block overflow-hidden"
                aria-label={featured.title}
              >
                <ImagePlaceholder type="blog" aspect="aspect-[16/10] md:aspect-auto md:h-full" className="transition-transform duration-500 group-hover:scale-[1.04]" />
              </Link>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <span className="inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                  مقالهٔ ویژه
                </span>
                <h2 className="mt-4 text-xl font-black leading-9 text-ink transition-colors group-hover:text-brand-600 sm:text-2xl">
                  <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="mt-3 text-sm leading-8 text-muted">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  <span>{featured.author}</span>
                  <span>{featured.date}</span>
                  <span>{featured.readTime} مطالعه</span>
                </div>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
                >
                  ادامهٔ مطلب
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        )}

        {/* بقیهٔ مقالات */}
        <Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </Reveal>
      </div>
    </>
  );
}
