import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * اسکرول به بالای صفحه هنگام تغییر مسیر
 */
export default function useScrollRestoration() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, search]);
}
