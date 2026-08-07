import { Minus, Plus } from "lucide-react";
import { toFaDigits } from "../../utils/format.js";

/**
 * انتخاب تعداد — بین ۱ و max (موجودی)
 */
export default function QuantitySelector({ value, onChange, max = 99 }) {
  const inc = () => onChange(Math.min(value + 1, max));
  const dec = () => onChange(Math.max(1, value - 1));

  return (
    <div className="inline-flex items-center rounded-xl border border-line bg-card">
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="افزایش تعداد"
        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
      <span
        className="w-10 text-center text-sm font-black text-ink"
        aria-live="polite"
        aria-label={`تعداد: ${toFaDigits(value)}`}
      >
        {toFaDigits(value)}
      </span>
      <button
        type="button"
        onClick={dec}
        disabled={value <= 1}
        aria-label="کاهش تعداد"
        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
