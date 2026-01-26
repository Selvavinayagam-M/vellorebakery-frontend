import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

export const AdminPageHeader = ({ title, description, actionLabel, onAction }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
        <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 mt-1 text-xs md:text-base">{description}</p>
        </div>
        {actionLabel && (
            <button
                onClick={onAction}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-mahogany text-white px-4 py-2.5 rounded-lg font-medium hover:bg-brand-jaggery transition-colors shadow-sm active:scale-95 text-sm md:text-base"
            >
                <Plus size={18} />
                {actionLabel}
            </button>
        )}
    </div>
);

export const AdminSearchFilter = ({ searchQuery, setSearchQuery, onFilterClick }) => (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-turmeric focus:ring-1 focus:ring-brand-turmeric text-sm md:text-base"
            />
        </div>
        <button
            onClick={onFilterClick}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 bg-white text-sm md:text-base"
        >
            <Filter size={18} />
            <span className="inline md:inline">Filter</span>
        </button>
    </div>
);

