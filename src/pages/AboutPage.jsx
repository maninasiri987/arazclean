import { HeartHandshake, Leaf, ShieldCheck, Target } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ImagePlaceholder from "../components/ui/ImagePlaceholder.jsx";
import Reveal from "../components/common/Reveal.jsx";

const values = [
  {
    icon: ShieldCheck,
    title: "کیفیت",
    desc: "تنها محصولاتی با بالاترین استاندارد کیفیت وارد سبد آراز کلین می‌شوند.",
  },
  {
    icon: Target,
    title: "شفافیت",
    desc: "قیمت منصفانه و اطلاعات کامل محصول؛ بدون هیچ ابهامی برای مشتری.",
  },
  {
    icon: Leaf,
    title: "مسئولیت زیست‌محیطی",
    desc: "ترویج محصولات سازگار با محیط زیست و کاهش مصرف پلاستیک.",
  },
  {
    icon: HeartHandshake,
    title: "اعتماد",
    desc: "رابطهٔ بلندمدت با مشتریان، مهم‌ترین سرمایهٔ ماست.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="درباره ما"
        description="آراز کلین؛ برند تخصصی محصولات نظافت با هدف ساده‌تر کردن زندگی روزمرهٔ خانواده‌های ایرانی."
      />
      <PageHero
        title="درباره آراز کلین"
        subtitle="ما به نظافت به‌عنوان بخشی از سلامت و آرامش زندگی نگاه می‌کنیم."
        breadcrumb={[{ label: "درباره ما" }]}
      />

      <div className="max-w-site mx-auto space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        {/* معرفی */}
        <Reveal>
          <section aria-labelledby="about-intro" className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 id="about-intro" className="text-xl font-black text-ink sm:text-2xl">
                داستان آراز کلین
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted">
                آراز کلین با این باور متولد شد که نظافت نباید یک کار طاقت‌فرسا باشد؛
                بلکه باید ساده، لذت‌بخش و مؤثر باشد. ما محصولات خود را از میان
                معتبرترین برندهای داخلی و بین‌المللی انتخاب می‌کنیم تا هر بار
                استفاده از آن‌ها، تجربه‌ای مطمئن باشد.
              </p>
              <p className="mt-4 text-sm leading-8 text-muted">
                از یک فروشگاه کوچک آنلاین شروع کردیم و امروز به مرجعی تخصصی برای
                خانواده‌ها، هتل‌ها، رستوران‌ها و مراکز خدماتی تبدیل شده‌ایم؛ اما
                هیچ‌چیز برای ما مهم‌تر از اعتماد شما نیست.
              </p>
            </div>
            <div className="overflow-hidden rounded-card border border-line bg-card shadow-card">
              <ImagePlaceholder type="banner" aspect="aspect-[4/3]" label="تصویر دفتر / تیم آراز کلین" />
            </div>
          </section>
        </Reveal>

        {/* مأموریت */}
        <Reveal>
          <section
            aria-labelledby="about-mission"
            className="rounded-card bg-gradient-to-l from-brand-600 to-trust-600 p-8 text-white shadow-card sm:p-12"
          >
            <h2 id="about-mission" className="text-xl font-black sm:text-2xl">
              مأموریت ما
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/90 sm:text-base">
              «ساده‌تر کردن زندگی با نظافتی آسان، مطمئن و در دسترس برای همهٔ
              خانواده‌های ایرانی؛ همراه با احترام به سلامت افراد و محیط زیست.»
            </p>
          </section>
        </Reveal>

        {/* ارزش‌ها */}
        <section aria-labelledby="about-values">
          <h2 id="about-values" className="mb-6 text-xl font-black text-ink sm:text-2xl">
            ارزش‌های ما
          </h2>
          <Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-card border border-line bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50">
                    <value.icon className="size-6 text-brand-600" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-ink">{value.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{value.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
