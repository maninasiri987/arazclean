import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    // محدودسازی با requestAnimationFrame تا هر رویداد اسکرول state جدید نسازد
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 500);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    visible && (
      <button
        type="button"
        aria-label="بازگشت به بالا"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ animation: "fade-in 0.25s ease-out both" }}
        className="fixed bottom-24 right-6 z-40 flex size-11 cursor-pointer items-center justify-center rounded-full bg-brand-500 text-white shadow-pop transition-colors hover:bg-brand-600 focus-visible:ring-4 focus-visible:ring-brand-500/20 lg:bottom-6"
      >
        <ArrowUp className="size-5" aria-hidden="true" />
      </button>
    )
  );
}