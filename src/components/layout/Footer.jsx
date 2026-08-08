import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, Send, MessageCircle, Linkedin, Sparkles } from "lucide-react";
import { getNavigation, getSettings } from "../../services/catalog.js";
import { toEnDigits } from "../../utils/format.js";
import logo from "../../../assets/header.webp";

const socialIcons = {
  instagram: Instagram,
  telegram: Send,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
};

/**
 * فوتر — پس‌زمینهٔ تیرهٔ برند (ink) با متن‌های روشن برای خوانایی.
 */
export default function Footer() {
  const { footerNav } = getNavigation();
  const { siteName, description, phone, email, workHours, socials, copyright } =
    getSettings();

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      {/* نوار تزئینی بالای فوتر */}
      <div
        aria-hidden="true"
        className="h-0.5 w-full bg-gradient-to-l from-brand-500 via-trust-500 to-brand-500"
      />

      <div className="max-w-site mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* ستون ۱: لوگو + توضیح */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center" aria-label={siteName}>
              <span className="rounded-xl bg-white px-3 py-2 shadow-card">
                <img src={logo} alt={siteName} className="h-9 w-auto object-contain" loading="lazy" decoding="async" />
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">{description}</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-success-500">
              <Sparkles className="size-4" aria-hidden="true" />
              ضمانت اصالت کالا و ارسال سریع به سراسر کشور
            </div>
          </div>

          {/* ستون‌های لینک */}
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 text-sm font-black text-white">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ستون ۳: تماس */}
          <nav aria-label="راه‌های ارتباطی">
            <h3 className="mb-4 text-sm font-black text-white">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`tel:${toEnDigits(phone).replace(/[^\d]/g, "")}`} className="transition-colors hover:text-brand-500" dir="ltr">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`mailto:${email}`} className="transition-colors hover:text-brand-500" dir="ltr">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Sparkles className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                {workHours}
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.id] || Instagram;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 text-white/70 transition-[color,background-color,border-color] duration-200 hover:border-brand-500 hover:bg-brand-500/10 hover:text-brand-500"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-white/50">{copyright}</p>
      </div>
    </footer>
  );
}
