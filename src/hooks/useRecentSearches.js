import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "arazclean-recent-searches";
const MAX_ITEMS = 8;

/**
 * مدیریت جستجوهای اخیر در localStorage — حداکثر ۸ آیتم.
 */
export default function useRecentSearches() {
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {
      // بی‌صدا — استوریج در دسترس نیست
    }
  }, [recent]);

  const add = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      return [trimmed, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const remove = useCallback((query) => {
    setRecent((prev) => prev.filter((s) => s !== query));
  }, []);

  const clear = useCallback(() => setRecent([]), []);

  return { recent, add, remove, clear };
}
