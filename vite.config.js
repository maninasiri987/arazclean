import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // جداسازی کتابخانه‌های بزرگ برای کش بهتر و بارگذاری موازی
        manualChunks: {
          "react-vendor": [
            "react",
            "react-dom",
            "react-router-dom",
            "react-helmet-async",
          ],
          motion: ["framer-motion"],
          swiper: ["swiper", "swiper/react", "swiper/modules"],
          forms: ["react-hook-form"],
        },
      },
    },
  },
});
