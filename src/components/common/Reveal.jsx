import { motion } from "framer-motion";

/**
 * انیمیشن ظهور ملایم هنگام اسکرول — با احترام به prefers-reduced-motion
 */
export default function Reveal({ children, delay = 0, className = "", y = 24 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
