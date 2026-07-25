// frontend-user/src/components/products/ProductGrid.js
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No products match your criteria.</p>;
  }

  return (
    // grid-cols-2 for mobile, gap-3 (tighter spacing)
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}