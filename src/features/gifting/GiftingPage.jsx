import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGiftingProducts } from '../../features/products/productsSlice';
import ProductCard from '../../components/ProductCard';
import { motion } from 'framer-motion';

const GiftingPage = () => {
    const dispatch = useDispatch();
    const { gifting, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchGiftingProducts());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-4xl font-serif font-bold text-brand-maroon mb-2">
                        Premium Gifting
                    </h1>
                    <p className="text-gray-500">Perfect gifts for your loved ones</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-maroon"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {gifting.map((product, index) => (
                            <motion.div
                                key={product.id || product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && gifting.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg">No gifting products available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GiftingPage;


