import { memo } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";
import { prefetchPage } from "../../utils/prefetch.js";

/**
 * کارت مقاله — تصویر + دسته + عنوان + خلاصه + متا
 */
function BlogCard({ post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-card-hover">
      <Link
        to={`/blog/${post.slug}`}
        onMouseEnter={() => prefetchPage(`/blog/${post.slug}`)}
        onFocus={() => prefetchPage(`/blog/${post.slug}`)}
        className="relative block overflow-hidden"
        aria-label={post.title}
      >
        <ImagePlaceholder type="blog" aspect="aspect-[16/10]" className="transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-brand-600 shadow-card backdrop-blur">
          {post.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-black leading-6 text-ink transition-colors group-hover:text-brand-600">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-4 pt-4 text-[11px] text-muted/80">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-brand-500" aria-hidden="true" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-brand-500" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

export default memo(BlogCard);
