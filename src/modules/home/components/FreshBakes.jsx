import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, ShoppingBag } from 'lucide-react';
import ProductCard from '../../../shared/components/ProductCard';
import Button from '../../../shared/components/Button';
import { Link } from 'react-router-dom';

const FreshBakes = () => {
    const { items } = useSelector((state) => state.products);
    // Filter for fresh items (mock logic: items with isFresh flag or specific categories)
    const freshItems = items.filter(item => item.isFresh).slice(0, 4);

    if (freshItems.length === 0) return null;

    return (
        <section className="py-20 bg-brand-coconut relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-turmeric/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-jaggery/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-2 text-brand-turmeric font-bold uppercase tracking-wider text-sm mb-2"
                        >
                            <Clock size={16} className="animate-pulse" />
                            <span>Fresh from the Oven</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-brand-mahogany"
                        >
                            Today's <span className="text-brand-jaggery italic">Special Bakes</span>
                        </motion.h2>
                    </div>

                    <Link to="/products?category=bakery">
                        <Button variant="outline" className="border-brand-mahogany text-brand-mahogany hover:bg-brand-mahogany hover:text-white">
                            View All Bakery Items
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {freshItems.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                {/* Freshness Banner */}
                <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-brand-turmeric/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-turmeric"></div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-brand-mahogany mb-2">Order before 4 PM for Same-Day Delivery!</h3>
                        <p className="text-gray-600">Ensure you get the warmth of our ovens delivered straight to your doorstep.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Mock Countdowns/Tickers could go here */}
                        <div className="text-center px-4 py-2 bg-brand-coconut rounded-lg border border-brand-turmeric/30">
                            <span className="block text-2xl font-bold text-brand-jaggery">04:00 PM</span>
                            <span className="text-xs text-gray-500 uppercase">Cut-off Time</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FreshBakes;
