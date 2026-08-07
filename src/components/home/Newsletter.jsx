import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { getSettings } from "../../services/catalog.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function Newsletter() {
  const { newsletter } = getSettings();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("لطفاً یک ایمیل معتبر وارد کنید", "info");
      return;
    }
    setEmail("");
    showToast("عضویت شما در خبرنامه ثبت شد. خوش آمدید!");
  };

  return (
    <section aria-label="خبرنامه" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-card border border-line bg-card p-8 text-center shadow-card sm:p-12">
        <div aria-hidden="true" className="absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-brand-50 blur-2xl" />
        <div className="relative mx-auto max-w-xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50">
            <Mail className="size-7 text-brand-600" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-black text-ink sm:text-2xl">{newsletter.title}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{newsletter.description}</p>

          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              ایمیل
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              className="w-full flex-1 rounded-xl border border-line bg-background px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
            >
              <Send className="size-4 -scale-x-100" aria-hidden="true" />
              عضویت
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
