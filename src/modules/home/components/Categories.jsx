import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { COLLECTION_IMAGES, LOGO_IMAGES } from '../../../assets/images';

const royalSweetsImg = COLLECTION_IMAGES.sweets;
const savorySnacksImg = COLLECTION_IMAGES.snacks;
const bakeryFreshImg = COLLECTION_IMAGES.bakery;
const giftHampersImg = COLLECTION_IMAGES.gifting;
const logoImg = LOGO_IMAGES.main;

const COLLECTIONS = [
    {
        id: 'royal-sweets',
        title: "Royal Sweets",
        image: royalSweetsImg,
        link: "/products?category=sweets",
        size: "large", // Spans 2 cols, 2 rows
        description: "Handcrafted traditional delicacies"
    },
    {
        id: 'savory-snacks',
        title: "Savory Snacks",
        image: savorySnacksImg,
        link: "/products?category=savouries",
        size: "medium", // Standard square
        description: "Crispy, spicy, and authentic"
    },
    {
        id: 'bakery-fresh',
        title: "Bakery Fresh",
        image: bakeryFreshImg,
        link: "/products?category=bakery",
        size: "medium",
        description: "Oven-fresh cakes and buns"
    },
    {
        id: 'gift-hampers',
        title: "Gift Hampers",
        image: giftHampersImg,
        link: "/products?category=gifts",
        size: "wide", // Spans 2 cols (if needed) or distinct style
        description: "Perfect for every celebration"
    }
];

const CategoryCard = ({ item, index }) => {
    // Determine grid classes based on size
    const gridClasses = {
        large: "md:col-span-2 md:row-span-2 h-[400px] md:h-[600px]",
        wide: "md:col-span-2 md:row-span-1 h-[300px]",
        medium: "md:col-span-1 md:row-span-1 h-[300px]"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className={`group relative overflow-hidden rounded-3xl cursor-pointer ${gridClasses[item.size] || "h-[300px]"}`}
        >
            <Link to={item.link} className="block w-full h-full">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Subtle Logo Mark */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 opacity-40 mix-blend-overlay z-10 pointer-events-none">
                        <img src={logoImg} alt="" className="w-full h-full object-contain grayscale brightness-200" />
                    </div>
                </div>

                {/* Stronger Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-start text-white z-20">
                    <motion.div
                        className="transform transition-all duration-500 group-hover:-translate-y-2"
                    >
                        {/* Title & Arrow */}
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-wide drop-shadow-lg text-brand-turmeric">
                                {item.title}
                            </h3>
                            <div className="bg-brand-turmeric p-2 rounded-full opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-md">
                                <ArrowUpRight className="w-6 h-6 text-brand-mahogany" />
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-brand-cream text-base md:text-lg font-medium tracking-wide drop-shadow-md max-w-[90%]">
                            {item.description}
                        </p>
                    </motion.div>

                    {/* Mobile Tap Indicator / Decoration Line */}
                    <div className="w-0 group-hover:w-20 h-1.5 bg-brand-turmeric mt-4 transition-all duration-500 ease-out rounded-full shadow-[0_0_15px_rgba(255,193,7,0.6)]" />
                </div>

                {/* Subtle Border Glow on Hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
            </Link>
        </motion.div>
    );
};

const Categories = () => {
    return (
        <section className="py-20 md:py-32 bg-brand-beige/10">
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brand-mahogany/70 uppercase tracking-[0.2em] text-xs md:text-sm font-bold block mb-3"
                    >
                        Handcrafted Perfection
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-black mb-6"
                    >
                        Our Collections
                    </motion.h2>
                    <div className="w-24 h-1.5 bg-brand-turmeric mx-auto rounded-full opacity-80" />
                </div>

                {/* Asymmetric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* First Large Item (Left) */}
                    <CategoryCard item={COLLECTIONS[0]} index={0} />

                    {/* Two Medium Items (Right Column) */}
                    <div className="md:col-span-1 md:row-span-2 flex flex-col gap-6">
                        <CategoryCard item={COLLECTIONS[1]} index={1} />
                        <CategoryCard item={COLLECTIONS[2]} index={2} />
                    </div>

                    {/* Full Width / Special Item (Bottom) */}
                    <div className="md:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden group cursor-pointer"
                        >
                            <Link to={COLLECTIONS[3].link} className="block w-full h-full">
                                <img
                                    src={COLLECTIONS[3].image}
                                    alt={COLLECTIONS[3].title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">{COLLECTIONS[3].title}</h3>
                                    <span className="inline-block px-8 py-3 border border-white/30 text-white rounded-full uppercase tracking-widest text-xs hover:bg-white hover:text-brand-black transition-all duration-300">Explore Gifts</span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
