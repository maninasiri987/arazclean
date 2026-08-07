import { NavLink, useLocation } from "react-router-dom";
import { getNavigation } from "../../services/catalog.js";
import { prefetchPage } from "../../utils/prefetch.js";

function isActive(match, pathname) {
  if (match === "categories") return pathname.startsWith("/category");
  if (match === "/") return pathname === "/";
  return pathname.startsWith(match);
}

/**
 * نوار ناوبری اصلی (دسکتاپ)
 */
export default function Navbar({ onNavigate }) {
  const { mainNav } = getNavigation();
  const { pathname } = useLocation();

  return (
    <nav aria-label="ناوبری اصلی">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const active = isActive(item.match, pathname);
          return (
            <li key={item.label}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                onMouseEnter={() => prefetchPage(item.to)}
                onFocus={() => prefetchPage(item.to)}
                aria-current={active ? "page" : undefined}
                className={`relative block cursor-pointer rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-200 ${
                  active
                    ? "text-brand-600"
                    : "text-muted hover:text-brand-600"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500 transition-opacity duration-200 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
