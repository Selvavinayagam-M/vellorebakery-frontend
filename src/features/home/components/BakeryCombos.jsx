import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../features/cart/cartSlice';
import { showToast, openCart } from '../../../features/ui/uiSlice';
import { Coffee, Gift, PartyPopper, ChevronRight } from 'lucide-react';
import Button from '../../../components/Button';

import { COMBO_IMAGES } from '../../../assets/images';

const familyTeaTimeImg = COMBO_IMAGES.familyTeaTime;
const festivalGiftHamperImg = COMBO_IMAGES.festivalGift;
const kidsPartyPackImg = COMBO_IMAGES.kidsParty;

const combos = [
    {
        id: 1,
        title: "Family Tea Time",
        items: ["Butter Biscuits", "Kara Boondi", "Osmania Biscuits"],
        price: 399,
        originalPrice: 480,
        icon: <Coffee size={32} />,
        color: "bg-orange-50 border-orange-100",
        btnColor: "bg-orange-600 hover:bg-orange-700",
        image: familyTeaTimeImg
    },
    {
        id: 2,
        title: "Festival Gift Hamper",
        items: ["Mysore Pak", "Kaju Katli", "Mixed Dry Fruits"],
        price: 1499,
        originalPrice: 1800,
        icon: <Gift size={32} />,
        color: "bg-red-50 border-red-100",
        btnColor: "bg-brand-jaggery hover:bg-brand-mahogany",
        image: festivalGiftHamperImg
    },
    {
        id: 3,
        title: "Kids Party Pack",
        items: ["Veg Puffs (4)", "Coconut Buns (4)", "Cupcakes (4)"],
        price: 599,
        originalPrice: 750,
        icon: <PartyPopper size={32} />,
        color: "bg-yellow-50 border-yellow-100",
        btnColor: "bg-brand-turmeric text-brand-mahogany hover:bg-yellow-500",
        image: kidsPartyPackImg
    }
];

const BakeryCombos = () => {
    const dispatch = useDispatch();

    const handleAddToCart = (combo) => {
        dispatch(addToCart({
            id: `combo-${combo.id}`,
            name: combo.title,
            price: combo.price,
            image: combo.image,
            quantity: 1,
            isCombo: true
        }));
        dispatch(showToast({ message: `Added ${combo.title} to cart` }));
        dispatch(openCart());
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-mahogany mb-4">Curated Bakery Combos</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Perfectly paired treats for every occasion, from your evening tea to grand celebrations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {combos.map((combo, index) => (
                        <motion.div
                            key={combo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`rounded-2xl overflow-hidden border ${combo.color} relative group`}
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img src={combo.image} alt={combo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md text-brand-mahogany">
                                    {combo.icon}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{combo.title}</h3>
                                <ul className="text-sm text-gray-600 mb-6 space-y-1">
                                    {combo.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-turmeric"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="block text-gray-400 text-sm line-through">₹{combo.originalPrice}</span>
                                        <span className="block text-2xl font-bold text-brand-jaggery">₹{combo.price}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(combo)}
                                        className={`${combo.btnColor} px-6 py-2 rounded-full font-bold text-white shadow-md transition-shadow hover:shadow-lg flex items-center gap-1 text-sm`}
                                    >
                                        Add <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BakeryCombos;

