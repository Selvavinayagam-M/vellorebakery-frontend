import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfferCard = ({ product, onAddToCart }) => {
    // Calculate Savings
    const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;
    const discountPercentage = product.originalPrice
        ? Math.round((discountAmount / product.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercentage > 0 && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                            {discountPercentage}% OFF
                        </span>
                    )}
                    {product.category === 'combos' && (
                        <span className="bg-brand-mahogany text-brand-turmeric text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                            VALUE PACK
                        </span>
                    )}
                </div>

                {/* Offer Tags */}
                {product.offerTags && product.offerTags.length > 0 && (
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                        {product.offerTags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="bg-white/90 backdrop-blur-sm text-brand-mahogany text-[9px] font-bold px-2 py-0.5 rounded-full border border-gray-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{product.subcategory}</p>
                    <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-green-700">
                        4.5 <Star size={8} fill="currentColor" />
                    </div>
                </div>

                <Link to={`/products/${product.id}`} className="block">
                    <h3 className="font-serif font-bold text-lg text-gray-800 mb-1 group-hover:text-brand-mahogany transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-grow">
                    {product.description}
                </p>

                {/* Combo Detail */}
                {product.category === 'combos' && (
                    <div className="mb-3 text-[10px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                        <span className="font-bold block mb-1">Contains:</span>
                        {product.itemsIncluded?.join(', ')}
                    </div>
                )}

                {/* Price Block */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-brand-mahogany">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through decoration-red-400">₹{product.originalPrice}</span>
                            )}
                        </div>
                        {discountAmount > 0 && (
                            <p className="text-[10px] text-green-600 font-bold">
                                You Save ₹{discountAmount}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => onAddToCart(product)}
                        className="bg-brand-turmeric text-brand-mahogany p-2 rounded-lg hover:bg-brand-gold transition-colors shadow-sm active:scale-95"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default OfferCard;

