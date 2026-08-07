import { Link, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import ImagePlaceholder from "../components/ui/ImagePlaceholder.jsx";
import BlogCard from "../components/home/BlogCard.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { getBlogPostBySlug, getBlogPosts } from "../services/catalog.js";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) return <NotFoundPage />;

  const related = getBlogPosts().filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <Seo title={post.title} description={post.excerpt} />
      <div className="max-w-site mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "مجله", to: "/blog" }, { label: post.title }]} />

        <article className="mx-auto max-w-3xl">
          <header>
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
              {post.category}
            </span>
            <h1 className="mt-4 text-2xl font-black leading-10 text-ink sm:text-3xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-5 border-b border-line pb-6 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <User className="size-4 text-brand-500" aria-hidden="true" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-brand-500" aria-hidden="true" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-brand-500" aria-hidden="true" />
                {post.readTime} مطالعه
              </span>
            </div>
          </header>

          <div className="mt-6 overflow-hidden rounded-card border border-line bg-card shadow-card">
            <ImagePlaceholder type="blog" aspect="aspect-[16/9]" />
          </div>

          <div className="mt-8 space-y-5">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-sm leading-8 text-muted sm:text-base sm:leading-9">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
              بازگشت به مجله
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-posts" className="mt-16 border-t border-line pt-10">
            <SectionTitle title="مقالات مرتبط" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
