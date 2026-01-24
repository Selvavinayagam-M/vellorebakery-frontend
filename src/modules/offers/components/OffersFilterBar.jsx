import React from 'react';
import { Tag, Star, Clock, Gift } from 'lucide-react';

const FILTERS = [
    { id: 'all', label: 'All Offers', icon: Tag },
    { id: 'combos', label: 'Mega Combos', icon: Gift },
    { id: 'sweets', label: 'Sweet Deals', icon: Star },
    { id: 'snacks', label: 'Snack Steals', icon: Clock },
];

const SORT_OPTIONS = [
    { value: 'discount', label: 'Biggest Discount' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'popularity', label: 'Most Popular' },
];

const OffersFilterBar = ({ activeFilter, setActiveFilter, sortBy, setSortBy }) => {
    const filters = FILTERS;
    const sortOptions = SORT_OPTIONS;

    return (
        <div className="sticky top-[64px] z-30 bg-white shadow-sm border-b border-gray-100 -mt-8 mx-4 rounded-xl max-w-6xl md:mx-auto">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {filters.map(filter => {
                            const Icon = filter.icon;
                            const isActive = activeFilter === filter.id;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${isActive
                                        ? 'bg-brand-mahogany text-brand-turmeric shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric block w-full md:w-auto p-2.5"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffersFilterBar;
