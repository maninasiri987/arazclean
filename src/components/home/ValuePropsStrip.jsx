import { Truck, ShieldCheck, BadgeCheck, Headset } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "ارسال سریع",
    desc: "به سراسر کشور",
  },
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت",
    desc: "کالای ۱۰۰٪ اصل",
  },
  {
    icon: BadgeCheck,
    title: "پرداخت امن",
    desc: "درگاه‌های معتبر",
  },
  {
    icon: Headset,
    title: "پشتیبانی ۲۴/۷",
    desc: "همیشه همراه شما",
  },
];

export default function ValuePropsStrip() {
  return (
    <section aria-label="مزایای خرید از آراز کلین" className="cv-section max-w-site mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 rounded-card border border-line bg-card p-4 shadow-card sm:grid-cols-4 sm:p-6">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <item.icon className="size-5 text-brand-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black text-ink">{item.title}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
