import ProductCard from "./ProductCard.jsx";

/**
 * گرید ریسپانسیو محصولات — دسکتاپ ۴، تبلت ۳، موبایل ۲ ستون
 */
export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
