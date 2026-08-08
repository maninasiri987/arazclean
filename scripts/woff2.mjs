/**
 * تبدیل فونت‌های TTF به WOFF2 — اجرا: `node scripts/woff2.mjs`
 * WOFF2 حدود ۵۰٪ کوچک‌تر از TTF است و بارگذاری سایت را سریع‌تر می‌کند.
 */
import { readFile, writeFile } from "node:fs/promises";
import wawoff2 from "wawoff2";

const FILES = ["BYekan+", "BYekan-Bold"];

for (const name of FILES) {
  const ttf = await readFile(`public/fonts/${name}.ttf`);
  const woff2 = await wawoff2.compress(ttf);
  await writeFile(`public/fonts/${name}.woff2`, woff2);
  console.log(`${name}.ttf ${ttf.length} → ${name}.woff2 ${woff2.length} (−${Math.round((1 - woff2.length / ttf.length) * 100)}٪)`);
}
