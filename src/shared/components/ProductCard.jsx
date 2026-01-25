import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Eye, Clock } from 'lucide-react';
import { addToCart } from '../../store/cartSlice';
import { toggleFavourite } from '../../store/favouritesSlice';
import { showToast, openCart } from '../../store/uiSlice';
import { Link } from 'react-router-dom';
import CloudinaryImage from './CloudinaryImage';
import { COMBO_IMAGES } from '../../assets/images';
const fallbackImage = COMBO_IMAGES.familyTeaTime;
import { LOGO_IMAGES } from '../../assets/images';
const logoImg = LOGO_IMAGES.main;

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const favouritesState = useSelector((state) => state.favourites);
    const favouriteIds = favouritesState?.items || [];
    const [isHovered, setIsHovered] = useState(false);

    if (!product) return null;

    // MongoDB uses _id, ensure we have a valid identifier
    const productId = product.id || product._id;

    const isFavourite = favouriteIds.includes(productId);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({ ...product, id: productId, quantity: 1 }));
        dispatch(showToast({ message: `Added ${product.name} to cart` }));
        dispatch(openCart());
    };

    const handleToggleFavourite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleFavourite(productId));
        dispatch(showToast({
            message: isFavourite ? `Removed from favorites` : `Added to favorites`
        }));
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Placeholder for Quick View functionality
        console.log("Quick view for", product.name);
    };

    return (
        <motion.div
            className="group relative w-full h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col font-sans"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream/10">
                <Link to={`/products/${productId}`} className="block w-full h-full">
                    {/* Brand Watermark Badge */}
                    <div className="absolute top-2 right-2 z-20 w-8 h-8 opacity-80 pointer-events-none">
                        <img src={logoImg} alt="" className="w-full h-full object-contain drop-shadow-md" />
                    </div>

                    <CloudinaryImage
                        publicId={product.imagePublicId || 'laddu_sample'}
                        url={product.image || fallbackImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        width={400}
                        height={300}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
                    {product.flags?.isFresh && (
                        <span className="bg-white/90 backdrop-blur-sm text-brand-mahogany text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                            <Clock size={12} className="text-green-600" /> Fresh Today
                        </span>
                    )}
                    {product.isHandmade && (
                        <span className="bg-brand-gold/90 backdrop-blur-sm text-brand-mahogany text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            Handmade
                        </span>
                    )}
                </div>

                {/* Secondary Actions - Always visible on touch, hover on desktop */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                    <button
                        onClick={handleToggleFavourite}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 active:scale-95 focus:outline-none md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0 duration-300 delay-75"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={18} className={isFavourite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"} />
                    </button>
                    <button
                        onClick={handleQuickView}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 active:scale-95 focus:outline-none md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0 duration-300 delay-100"
                        aria-label="Quick view"
                    >
                        <Eye size={18} className="text-gray-600 hover:text-brand-mahogany" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-grow flex flex-col items-start text-left relative z-10">
                {/* Rating & Category */}
                <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">{product.category}</span>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                        <Star size={12} className="fill-brand-gold text-brand-gold" />
                        <span>{product.rating || 4.5}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-brand-mahogany mb-1 hover:text-brand-jaggery transition-colors leading-tight line-clamp-1">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 font-light mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Price & CTA */}
                <div className="mt-auto w-full flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-brand-mahogany">₹{product.price}</span>
                        {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{product.oldPrice}</span>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 bg-brand-mahogany text-brand-cream text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-jaggery shadow-md hover:shadow-lg transition-all"
                    >
                        <ShoppingBag size={16} />
                        Add
                    </motion.button>
                </div>
            </div>

            {/* Bottom Decoration Line */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-gold via-brand-mahogany to-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </motion.div>
    );
};

export default ProductCard;
