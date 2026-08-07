import Breadcrumb from "../ui/Breadcrumb.jsx";

/**
 * سربرگ صفحات داخلی — عنوان + توضیح + مسیر
 */
export default function PageHero({ title, subtitle, breadcrumb = [], children }) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-brand-50/60 via-card to-background">
      <div className="max-w-site mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-black text-ink sm:text-3xl lg:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
