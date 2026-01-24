import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import mysorePakImg from '../../assets/images/hero-images/heroimg-Melt-in-Mouth Mysore Pak.png';
import mixtureImg from '../../assets/images/curatedbakerycombos/familyteatime.png';
import biscuitsImg from '../../assets/images/curatedbakerycombos/kidspartypack.png';

const MegaMenu = ({ isOpen, activeCategory, onClose }) => {
    // Mock data for mega menu content - in real app, this could come from props or store
    const menuContent = {
        sweets: {
            categories: [
                {
                    title: "Ghee Sweets",
                    items: ["Mysore Pak", "Laddu", "Badusha", "Jangri"]
                },
                {
                    title: "Milk Sweets",
                    items: ["Palkova", "Rasgulla", "Kalakand", "Milk Halwa"]
                },
                {
                    title: "Dry Fruit Sweets",
                    items: ["Kaju Katli", "Anjeer Roll", "Dates Ladoo", "Pista Roll"]
                }
            ],
            featured: {
                image: mysorePakImg,
                title: "Signature Mysore Pak",
                link: "/products/s1"
            }
        },
        snacks: {
            categories: [
                {
                    title: "Savories",
                    items: ["Butter Murukku", "Ribbon Pakoda", "Kara Sev", "Mixture"]
                },
                {
                    title: "Hot Snacks",
                    items: ["Samosa", "Kachori", "Masala Vada", "Veg Cutlet"]
                },
                {
                    title: "Chips & Crisps",
                    items: ["Potato Chips", "Banana Chips", "Tapioca Chips"]
                }
            ],
            featured: {
                image: mixtureImg,
                title: "Spicy Madras Mixture",
                link: "/products/sn3"
            }
        },
        bakery: {
            categories: [
                {
                    title: "Cakes & Pastries",
                    items: ["Black Forest", "Honey Cake", "Plum Cake", "Cupcakes"]
                },
                {
                    title: "Breads & Buns",
                    items: ["Sweet Bun", "Coconut Bun", "Milk Bread", "Wheat Bread"]
                },
                {
                    title: "Cookies",
                    items: ["Butter Biscuits", "Salt Biscuits", "Osmania", "Rusk"]
                }
            ],
            featured: {
                image: biscuitsImg,
                title: "Fresh Butter Biscuits",
                link: "/products/b5"
            }
        }
    };

    const content = menuContent[activeCategory];

    return (
        <AnimatePresence>
            {isOpen && content && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-brand-turmeric/20 z-50 overflow-hidden"
                    onMouseLeave={onClose}
                >
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Categories Columns */}
                            <div className="flex-grow grid grid-cols-3 gap-8 border-r border-gray-100 pr-8">
                                {content.categories.map((section, idx) => (
                                    <div key={idx}>
                                        <h4 className="font-serif font-bold text-brand-mahogany mb-4 text-lg border-b border-brand-turmeric/30 pb-2 inline-block">
                                            {section.title}
                                        </h4>
                                        <ul className="space-y-2">
                                            {section.items.map((item) => (
                                                <li key={item}>
                                                    <Link
                                                        to={`/products?search=${item}`}
                                                        className="text-gray-600 hover:text-brand-jaggery hover:translate-x-1 transition-all block text-sm"
                                                        onClick={onClose}
                                                    >
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Featured Section */}
                            <div className="w-64 flex-shrink-0">
                                <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">Featured</h4>
                                <div className="group relative rounded-lg overflow-hidden h-48 mb-3">
                                    <img
                                        src={content.featured.image}
                                        alt={content.featured.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <h5 className="absolute bottom-3 left-3 text-white font-bold font-serif text-lg leading-tight">
                                        {content.featured.title}
                                    </h5>
                                </div>
                                <Link
                                    to={content.featured.link}
                                    className="text-brand-jaggery font-bold text-sm flex items-center hover:gap-2 transition-all"
                                    onClick={onClose}
                                >
                                    Shop Now <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MegaMenu;
