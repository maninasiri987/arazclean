import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const initial = user?.name?.trim()?.charAt(0) || "ک";

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    showToast("با موفقیت از حساب خود خارج شدید", "info");
    navigate("/");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`حساب کاربری ${user?.name || ""}`}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-500/40 bg-brand-50/50 py-1.5 ps-1.5 pe-2.5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 sm:py-1"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-black text-white">
          {initial}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">{user?.name}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 text-brand-600 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-[80] mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-card shadow-pop transition-all duration-180"
          style={{
            animation: open ? "dropdown-in 0.18s cubic-bezier(0.16,1,0.3,1) both" : undefined,
          }}
        >
          <div className="border-b border-line bg-background/60 px-4 py-3">
            <p className="truncate text-sm font-black text-ink">{user?.name}</p>
            {user?.identifier && (
              <p className="mt-0.5 truncate text-xs text-muted" dir="ltr">
                {user.identifier}
              </p>
            )}
          </div>

          <div className="p-1.5">
            <Link
              to="/cart"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              سبد خرید
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut className="size-4 -scale-x-100" aria-hidden="true" />
              خروج از حساب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
