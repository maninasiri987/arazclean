import { motion } from "framer-motion";

/**
 * لودر تمام‌صفحهٔ هنگام باز شدن سایت — طراحی ساده:
 * فقط یک انیمیشن ساده در مرکز صفحه، بدون عنوان. فقط در اولین باز شدن نمایش داده می‌شود.
 */
export default function BootLoader() {
  return (
    <motion.div
      key="boot-loader"
      role="status"
      aria-label="در حال بارگذاری"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
      className="boot-screen"
    >
      <div className="boot-center">
        <div className="boot-spinner" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
