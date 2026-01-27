import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ProductCard from '../../../components/ProductCard';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../features/cart/cartSlice';

const PopularItems = ({ products }) => {
    const dispatch = useDispatch();

    // Skeleton Component
    const ProductSkeleton = () => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-20 bg-brand-cream/30 overflow-x-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-brand-maroon mb-2">Customer Favorites</h2>
                        <p className="text-brand-black/70">The most loved sweets and snacks by our patrons.</p>
                    </div>
                    <Link to="/products" className="text-brand-maroon font-semibold hover:text-brand-gold transition-colors mt-4 md:mt-0 underline-offset-4 hover:underline">
                        View All Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products?.map((product, index) => {
                        // Logic: First 2 from Left (-60), Last 2 from Right (60)
                        // For mobile (small screens), we might want simpler up-fade, but here we enforce the requested logic
                        const initialX = index < 2 ? -60 : 60;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: initialX }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                    delay: index * 0.15 // Slight stagger for visual layering
                                }}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={(p) => dispatch(addToCart(p))}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PopularItems;

