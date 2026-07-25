// frontend-user/src/pages/products/index.js

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid'; 
import FilterSidebar from '@/components/products/FilterSidebar'; 
import SortOptions from '@/components/products/SortOptions'; 
import apiService from '@/services/apiService';

// ICONS
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ProductsPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  useEffect(() => {
    if (router.isReady) {
      const { category, sortBy: sortByQuery, searchTerm: searchQuery } = router.query;
      
      if (category) {
          const cats = Array.isArray(category) ? category : category.split(',');
          setSelectedCategories(cats);
      }
      
      if (sortByQuery) setSortBy(sortByQuery);
      
      if (searchQuery) setSearchTerm(searchQuery);
      else setSearchTerm('');
    }
  }, [router.isReady, router.query]);

  // 2. FETCH PRODUCTS (Main)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiService.get('/products/search', {
          params: { 
            category: selectedCategories.join(','), 
            sortBy: sortBy,
            searchTerm: searchTerm 
          }
        });
        
        const results = response.data.data.products || [];
        setProducts(results);

        if (results.length === 0) {
            const suggestionRes = await apiService.get('/products/search', {
                params: { sortBy: 'ratings', limit: 8 } 
            });
            setSuggestedProducts(suggestionRes.data.data.products || []);
        } else {
            setSuggestedProducts([]); 
        }

      } catch (err) {
        if (err.response && err.response.status === 404) {
            setProducts([]);
            try {
                const suggestionRes = await apiService.get('/products/search', { params: { sortBy: 'ratings', limit: 8 } });
                setSuggestedProducts(suggestionRes.data.data.products || []);
            } catch (e) { /* ignore */ }
        } else {
            setError('Could not load products.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (router.isReady) {
        fetchProducts();
    }
  }, [sortBy, selectedCategories, searchTerm, router.isReady]);

  return (
    <Layout fullWidth={true}>
      <div className="px-2 sm:px-6 lg:px-8 py-4 relative min-h-screen">
        
        {/* MOBILE FLOATING FILTER BUTTON */}
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden fixed top-36 right-4 z-40 bg-gray-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-gray-700 active:scale-95 transition-transform"
        >
          <FilterIcon />
          <span className="text-xs font-bold tracking-wide uppercase">Filters</span>
        </button>

        {/* MOBILE FILTER MODAL */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end md:hidden">
            <div className="w-4/5 h-full bg-white shadow-2xl p-5 overflow-y-auto animate-slide-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Filters & Sort</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <CloseIcon />
                </button>
              </div>
              <div className="mb-6"><SortOptions currentSort={sortBy} onSortChange={setSortBy} /></div>
              <hr className="mb-6"/>
              <div className="mb-8"><FilterSidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} /></div>
              <button onClick={() => setShowMobileFilters(false)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md active:bg-blue-700">
                Show Results
              </button>
            </div>
          </div>
        )}

        {/* DESKTOP LAYOUT */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* SIDEBAR */}
          <aside className="hidden md:flex w-1/4 lg:w-1/5 sticky top-24 self-start flex-col gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <SortOptions currentSort={sortBy} onSortChange={setSortBy} />
                <hr className="my-4"/>
                <FilterSidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            
            {/* Dynamic Header */}
            <h1 className="text-2xl font-bold mb-4 text-gray-800 pl-1">
              {searchTerm 
                ? (products.length > 0 ? `Search Results for "${searchTerm}"` : `No results for "${searchTerm}"`) 
                : "Our Collection"
              }
            </h1>
            
            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm min-h-[500px]">
              
              {/* Results Count Header */}
              {products.length > 0 && (
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-700">
                    All Products <span className="text-gray-500 font-normal">({products.length})</span>
                    </h2>
                </div>
              )}

              {loading && <p className="text-center py-20 text-gray-500 animate-pulse">Loading products...</p>}
              {error && <p className="text-center py-20 text-red-500">{error}</p>}

              {/* SCENARIO 1: We found products */}
              {!loading && !error && products.length > 0 && (
                <ProductGrid products={products} />
              )}

              {/* SCENARIO 2: Zero Results -> Show Recommendations */}
              {!loading && !error && products.length === 0 && (
                <div className="flex flex-col items-center">
                    
                    <div className="text-center py-10 max-w-md">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">We couldn&apos;t find any matches!</h3>
                        <p className="text-gray-500">
                            Please check the spelling or try searching for something else like &quot;Shirts&quot; or &quot;Shoes&quot;.
                        </p>
                    </div>

                    {suggestedProducts.length > 0 && (
                        <div className="w-full mt-8 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span>💡</span> You might be interested in these:
                            </h3>
                            <ProductGrid products={suggestedProducts} />
                        </div>
                    )}
                </div>
              )}

            </div>
          </main>

        </div>
      </div>
    </Layout>
  );
}