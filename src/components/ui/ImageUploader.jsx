import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import SmartImage from "./SmartImage.jsx";

/**
 * تبدیل فایل تصویر به دادهٔ فشردهٔ base64 (Data URL) — برای ذخیره در دادهٔ
 * محصول/برند بدون نیاز به سرور. تصویر تا حداکثر `maxSize` پیکسل کوچک می‌شود
 * تا حجم ذخیره‌شده در localStorage معقول بماند.
 */
const readImageAsDataUrl = (file, maxSize = 512) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("فایل تصویر معتبر نیست"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const scale = maxSize / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // webp سبک‌تر است؛ اگر مرورگر پشتیبانی نکند به jpeg برمی‌گردد
        const mime = canvas.toDataURL("image/webp").startsWith("data:image/webp")
          ? "image/webp"
          : "image/jpeg";
        resolve(canvas.toDataURL(mime, 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * آپلودر تصویر — انتخاب فایل از سیستم + پیش‌نمایش + حذف.
 * مقدار (value) می‌تواند مسیر (مثل /images/...) یا Data URL باشد؛
 * نتیجهٔ انتخاب فایل به‌صورت Data URL به onChange داده می‌شود.
 */
export default function ImageUploader({
  value = "",
  onChange,
  label = "تصویر",
  hint = "یک تصویر از سیستم انتخاب کنید یا مسیر را بنویسید.",
  shape = "rounded-2xl",
  previewSize = "size-28",
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("فقط فایل تصویری مجاز است");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const dataUrl = await readImageAsDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "خطا در خواندن تصویر");
    } finally {
      setBusy(false);
    }
  };

  const hasImage = Boolean(value && value.trim());

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        {/* پیش‌نمایش */}
        <span
          className={`${previewSize} relative shrink-0 overflow-hidden border border-line bg-background ${shape}`}
        >
          {hasImage ? (
            <SmartImage
              src={value.trim()}
              alt="پیش‌نمایش تصویر"
              className="h-full w-full"
              imgClassName="h-full w-full object-contain p-1.5"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-muted/40">
              <ImagePlus className="size-8" strokeWidth={1.5} aria-hidden="true" />
            </span>
          )}
        </span>

        <div className="flex flex-col items-start gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              <Upload className="size-4" aria-hidden="true" />
              {busy ? "در حال پردازش…" : "انتخاب تصویر"}
            </button>
            {hasImage && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-muted transition-colors hover:border-red-300 hover:text-red-500"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                حذف
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted">{hint}</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
