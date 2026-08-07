/**
 * قالب‌بندی اعداد و قیمت‌ها به فارسی
 */

export const toFaDigits = (value) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const toEnDigits = (value) =>
  String(value).replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

export const formatPrice = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  return `${toFaDigits(Number(value).toLocaleString("en-US"))} تومان`;
};

export const formatDiscountPercent = (discount) =>
  toFaDigits(Math.round(discount)) + "٪";

export const formatNumber = (value) => toFaDigits(Number(value).toLocaleString("en-US"));
