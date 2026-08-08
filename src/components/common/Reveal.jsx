import { useRef, useEffect, useState } from "react";

/**
 * انیمیشن ظهور ملایم هنگام اسکرول — با احترام به prefers-reduced-motion
 */
export default function Reveal({ children, delay = 0, className = "", y = 24 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-60px" }
    );
    observer.observe(elem);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionDelay: `${delay}ms`,
        ...(visible
          ? { opacity: 1, transform: "translateY(0)" }
          : { opacity: 0, transform: `translateY(${y}px)` }),
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  );
}
