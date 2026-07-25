// frontend-user/src/components/products/SortOptions.js

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'priceLowToHigh', label: 'Price: Low to High' },
  { value: 'priceHighToLow', label: 'Price: High to Low' },
  { value: 'ratings', label: 'Top Rated' },
  { value: 'topDiscounts', label: 'Best Discounts' },
];

export default function SortOptions({ currentSort, onSortChange }) {
  return (
    <div className="w-full">
      <h3 className="font-bold text-gray-800 text-lg mb-3">Sort By</h3>
      <div className="space-y-1">
        {sortOptions.map(option => (
          <label 
            key={option.value} 
            className="flex items-center space-x-3 cursor-pointer py-1 group"
          >
            <input 
              type="radio"
              name="sort-option" 
              value={option.value}
              checked={currentSort === option.value}
              onChange={() => onSortChange(option.value)}
              className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            />
            <span className={`text-sm sm:text-base transition-colors ${
              currentSort === option.value ? 'text-blue-600 font-medium' : 'text-gray-600 group-hover:text-blue-600'
            }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}