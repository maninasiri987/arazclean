import { useForm } from "react-hook-form";
import { Mail, Phone, Send } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import PageHero from "../components/common/PageHero.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { getSettings } from "../services/catalog.js";
import { useToast } from "../context/ToastContext.jsx";
import { toEnDigits } from "../utils/format.js";

export default function ContactPage() {
  const { phone, email, workHours } = getSettings();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (data) => {
    showToast(`${data.name} عزیز، پیام شما دریافت شد. به‌زودی با شما تماس می‌گیریم.`);
    reset();
  };

  return (
    <>
      <Seo
        title="تماس با ما"
        description="راه‌های ارتباط با آراز کلین؛ تلفن، ایمیل و فرم تماس."
      />
      <PageHero
        title="تماس با ما"
        subtitle="سؤالی دارید؟ تیم پشتیبانی آراز کلین آمادهٔ پاسخگویی است."
        breadcrumb={[{ label: "تماس با ما" }]}
      />

      <div className="max-w-site mx-auto grid grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">
        {/* اطلاعات تماس */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-36">
          <div className="rounded-card border border-line bg-card p-6 shadow-card">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50">
              <Phone className="size-6 text-brand-600" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-base font-black text-ink">تلفن پشتیبانی</h2>
            <p className="mt-1 text-sm text-muted" dir="ltr">
              <a href={`tel:${toEnDigits(phone).replace(/[^\d]/g, "")}`} className="transition-colors hover:text-brand-600">
                {phone}
              </a>
            </p>
          </div>

          <div className="rounded-card border border-line bg-card p-6 shadow-card">
            <div className="flex size-12 items-center justify-center rounded-xl bg-trust-50">
              <Mail className="size-6 text-trust-600" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-base font-black text-ink">ایمیل</h2>
            <p className="mt-1 text-sm text-muted" dir="ltr">
              <a href={`mailto:${email}`} className="transition-colors hover:text-brand-600">
                {email}
              </a>
            </p>
          </div>

          <div className="rounded-card bg-brand-50 p-6">
            <h2 className="text-sm font-black text-brand-700">ساعات پاسخگویی</h2>
            <p className="mt-1 text-sm text-brand-700/80">{workHours}</p>
          </div>
        </aside>

        {/* فرم تماس */}
        <div className="rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-black text-ink">ارسال پیام</h2>
          <p className="mt-1 text-sm text-muted">
            فرم زیر را پر کنید؛ کارشناسان ما در سریع‌ترین زمان پاسخ می‌دهند.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="نام و نام خانوادگی"
                placeholder="مثلاً مریم احمدی"
                error={errors.name?.message}
                {...register("name", {
                  required: "نام را وارد کنید",
                  minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد" },
                })}
              />
              <Input
                label="ایمیل"
                type="email"
                placeholder="you@example.com"
                dir="ltr"
                error={errors.email?.message}
                {...register("email", {
                  required: "ایمیل را وارد کنید",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "ایمیل معتبر نیست",
                  },
                })}
              />
            </div>
            <Input
              label="موضوع"
              placeholder="موضوع پیام شما"
              error={errors.subject?.message}
              {...register("subject", { required: "موضوع پیام را وارد کنید" })}
            />
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-bold text-ink">
                متن پیام
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="پیام خود را بنویسید…"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`w-full rounded-xl border bg-card px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-4 ${
                  errors.message
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                    : "border-line focus:border-brand-500 focus:ring-brand-500/15"
                }`}
                {...register("message", {
                  required: "متن پیام را بنویسید",
                  minLength: { value: 10, message: "پیام باید حداقل ۱۰ حرف باشد" },
                })}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg">
              <Send className="size-4 -scale-x-100" aria-hidden="true" />
              ارسال پیام
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
