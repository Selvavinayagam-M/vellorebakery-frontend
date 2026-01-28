import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterCategory, setSearchQuery, setSortBy, setPriceRange, fetchProducts } from '../../features/products/productsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, SlidersHorizontal, ChevronDown, ShoppingCart, User, Heart, X } from 'lucide-react';
import { addToCart } from '../../features/cart/cartSlice';
import ProductCard from '../../components/ProductCard';
import ProductCardSkeleton from '../../components/ProductCard'; // Using same card for now as skeleton
import Button from '../../components/Button';


const ProductsPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { items, filters } = useSelector((state) => state.products);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

    
    const currentCategoryItems = React.useMemo(() => {
        return items.filter(product => filters.category === 'all' || product.category === filters.category);
    }, [items, filters.category]);

    const minCategoryPrice = React.useMemo(() => {
        if (currentCategoryItems.length === 0) return 0;
        const prices = currentCategoryItems.map(p => p.price);
        return Math.min(...prices);
    }, [currentCategoryItems]);

    
    useEffect(() => {
        dispatch(fetchProducts());
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            dispatch(setFilterCategory(category));
        } else {
            dispatch(setFilterCategory('all'));
        }
    }, [location, dispatch]);

    // Reset price range when category changes
    useEffect(() => {
        setLocalPriceRange([0, 2000]);
        dispatch(setPriceRange([0, 2000]));
    }, [filters.category, dispatch]);


    const filteredProducts = items.filter(product => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search')?.toLowerCase() || '';

        const matchesCategory = filters.category === 'all' || product.category === filters.category;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesPrice && matchesSearch;
    }).sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return 0; // popularity/default
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-4xl font-serif font-bold text-brand-maroon mb-4 md:mb-0">
                        {filters.category === 'all' ? 'All Products' :
                            filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
                    </h1>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500 text-sm hidden md:inline">{filteredProducts.length} items</span>
                        <div className="relative group">
                            <select
                                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer"
                                value={filters.sortBy}
                                onChange={(e) => dispatch(setSortBy(e.target.value))}
                            >
                                <option value="popularity">Popularity</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter size={18} className="mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
                    {/* Sidebar Filters (Desktop) - Animated Slide from Left */}
                    <motion.aside
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:block w-64 flex-shrink-0"
                    >
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-serif font-bold text-lg text-gray-800">Filters</h3>
                                <Filter size={18} className="text-brand-gold" />
                            </div>

                            <div className="mb-8">
                                <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                                <ul className="space-y-2">
                                    {['all', 'sweets', 'snacks', 'gifting', 'offers'].map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => dispatch(setFilterCategory(cat))}
                                                className={`text-sm w-full text-left py-1 capitalize transition-colors ${filters.category === cat ? 'text-brand-maroon font-bold' : 'text-gray-500 hover:text-brand-gold'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                    <span>₹0</span>
    
                                    <span>₹{Math.max(localPriceRange[1], minCategoryPrice)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={minCategoryPrice}
                                    max="2000"
                                    step="50"
                                    value={Math.max(localPriceRange[1], minCategoryPrice)}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setLocalPriceRange([0, val]);
                                        dispatch(setPriceRange([0, val]));
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-maroon"
                                />
                            </div>
                        </div>
                    </motion.aside>

                    {/* Product Grid - Animated Slide from Right */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="flex-grow"
                    >
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <Button
                                    variant="ghost"
                                    className="mt-4"
                                    onClick={() => {
                                        dispatch(setFilterCategory('all'));
                                        dispatch(setPriceRange([0, 2000]));
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 bg-white z-50 shadow-2xl p-6 md:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-serif font-bold text-xl text-gray-800">Filters</h3>
                                <button onClick={() => setIsFilterOpen(false)} className="text-gray-500">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Filter Content - reusing logic */}
                            <div className="mb-8">
                                <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                                <ul className="space-y-3">
                                    {['all', 'sweets', 'snacks', 'gifting', 'offers'].map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => {
                                                    dispatch(setFilterCategory(cat));
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`text-base w-full text-left py-1 capitalize ${filters.category === cat ? 'text-brand-maroon font-bold' : 'text-gray-500'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductsPage;

