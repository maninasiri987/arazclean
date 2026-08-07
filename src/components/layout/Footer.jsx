import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, Send, MessageCircle, Linkedin, Sparkles } from "lucide-react";
import { getNavigation, getSettings } from "../../services/catalog.js";
import { toEnDigits } from "../../utils/format.js";
import logo from "../../../assets/header.png";

const socialIcons = {
  instagram: Instagram,
  telegram: Send,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
};

export default function Footer() {
  const { footerNav } = getNavigation();
  const { siteName, description, phone, email, workHours, socials, copyright } =
    getSettings();

  return (
    <footer className="border-t border-line bg-card">
      <div className="max-w-site mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* ستون ۱: لوگو + توضیح */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center" aria-label={siteName}>
              <img src={logo} alt={siteName} className="h-11 w-auto object-contain" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">{description}</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-success-600">
              <Sparkles className="size-4" aria-hidden="true" />
              ضمانت اصالت کالا و ارسال سریع به سراسر کشور
            </div>
          </div>

          {/* ستون‌های لینک */}
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 text-sm font-black text-ink">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted transition-colors duration-200 hover:text-brand-600"
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
            <h3 className="mb-4 text-sm font-black text-ink">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`tel:${toEnDigits(phone).replace(/[^\d]/g, "")}`} className="transition-colors hover:text-brand-600" dir="ltr">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`mailto:${email}`} className="transition-colors hover:text-brand-600" dir="ltr">
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
                    className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-line text-muted transition-[color,background-color,border-color] duration-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-line py-4">
        <p className="text-center text-xs text-muted/80">{copyright}</p>
      </div>
    </footer>
  );
}
