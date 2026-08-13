import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import SmartImage from "./SmartImage.jsx";

/**
 * بندانگشتی گزینه — لوگو/تصویر، ایموجی یا حرف اول نام.
 * `option.image` ← تصویر واقعی | `option.emoji` ← ایموجی | `option.letter` ← حرف
 */
function Thumb({ option, size = "size-7" }) {
  if (option.image) {
    return (
      <span
        className={`${size} shrink-0 overflow-hidden rounded-lg border border-line bg-background`}
      >
        <SmartImage
          src={option.image}
          alt=""
          className="h-full w-full"
          imgClassName="h-full w-full object-contain p-0.5"
        />
      </span>
    );
  }
  if (option.emoji) {
    return (
      <span
        className={`${size} flex shrink-0 items-center justify-center rounded-lg bg-brand-50 text-base leading-none`}
        aria-hidden="true"
      >
        {option.emoji}
      </span>
    );
  }
  if (option.letter) {
    return (
      <span
        className={`${size} flex shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-black text-brand-700`}
        aria-hidden="true"
      >
        {option.letter}
      </span>
    );
  }
  return (
    <span
      className={`${size} shrink-0 rounded-lg border border-line bg-background`}
      aria-hidden="true"
    />
  );
}

/**
 * سلکت سفارشی با بندانگشتی — جایگزین <select> معمولی برای نمایش
 * لوگوی برند / آیکون دسته در گزینه‌ها. در هر دو پوستهٔ روشن/تاریک ادمین کار می‌کند.
 */
export default function ImageSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "انتخاب کنید…",
  error,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  // بستن با کلیک بیرون یا Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {label && <label className="mb-1.5 block text-sm font-bold text-ink">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2.5 text-sm text-ink transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? "border-brand-500 ring-4 ring-brand-500/15" : "border-line"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {selected ? (
            <>
              <Thumb option={selected} />
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="truncate text-muted/70">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}

      {open && (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-64 overflow-auto rounded-xl border border-line bg-card p-1.5 shadow-pop"
          style={{ animation: "dropdown-in 0.15s ease-out both" }}
        >
          {options.length === 0 && (
            <li className="px-3 py-2.5 text-center text-xs text-muted">موردی نیست</li>
          )}
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-brand-50 font-bold text-brand-600"
                      : "text-muted hover:bg-background hover:text-ink"
                  }`}
                >
                  <Thumb option={opt} size="size-6" />
                  <span className="min-w-0 flex-1 truncate text-start">{opt.label}</span>
                  {active && (
                    <Check className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
