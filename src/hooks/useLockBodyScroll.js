import { useEffect } from "react";

/**
 * قفل اسکرول بدنه هنگام باز بودن دراور/مودال
 */
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
