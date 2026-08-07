import { getFeaturedBlogPosts } from "../../services/catalog.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import BlogCard from "./BlogCard.jsx";
import Reveal from "../common/Reveal.jsx";

export default function BlogRow() {
  const posts = getFeaturedBlogPosts(3);
  return (
    <section aria-labelledby="blog-title" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="از مجلهٔ آراز کلین"
        subtitle="نکات و ترفندهای حرفه‌ای نظافت"
        linkText="همهٔ مقالات"
        linkTo="/blog"
      />
      <Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
