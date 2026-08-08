import { forwardRef } from "react";

/**
 * ورودی استاندارد فرم — compatible با react-hook-form (forwardRef)
 */
const Input = forwardRef(function Input(
  { label, error, hint, id, leftIcon, className = "", ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-bold text-ink"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={`w-full rounded-xl border bg-card px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors duration-200 focus:outline-none focus:ring-4 ${
            leftIcon ? "pe-10" : ""
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
              : "border-line focus:border-brand-500 focus:ring-brand-500/15"
          }`}
          {...props}
        />
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
