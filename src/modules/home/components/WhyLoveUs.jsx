import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Section 1 Images
import s1img1 from '../../../assets/images/craftedwithcare/section1/section1-img1.png';
import s1img2 from '../../../assets/images/craftedwithcare/section1/section1-img2.png';
import s1img3 from '../../../assets/images/craftedwithcare/section1/section1-img3.png';

// Section 2 Images
import s2img1 from '../../../assets/images/craftedwithcare/section2/section2-img1.png';
import s2img2 from '../../../assets/images/craftedwithcare/section2/section2-img2.png';
import s2img3 from '../../../assets/images/craftedwithcare/section2/section2-img3.png';

// Section 3 Images
import s3img1 from '../../../assets/images/craftedwithcare/section3/section3-img1.png';
import s3img2 from '../../../assets/images/craftedwithcare/section3/section3-img2.png';
import s3img3 from '../../../assets/images/craftedwithcare/section3/section3-img3.png';


const FEATURES_DATA = [
    {
        id: 1,
        title: "Purity You Can Trust",
        subtitle: "100% Ghee & Natural",
        description: "We use only the finest A2 Ghee and organic ingredients. No preservatives, no additives—just pure, authentic taste passed down through generations.",
        images: [s1img1, s1img2, s1img3],
        stat: "100% Pure"
    },
    {
        id: 2,
        title: "Fresh from Kitchen to You",
        subtitle: "Made Fresh Daily",
        description: "Every sweet is prepared fresh upon order in our traditional kitchen, ensuring you get the same aroma and taste as if it were made in your own home.",
        images: [s2img1, s2img2, s2img3],
        stat: "24h Fresh"
    },
    {
        id: 3,
        title: "Loved by thousands",
        subtitle: "Community Favorite",
        description: "Over 10,000 happy families trust Vellore Sweets for their celebrations. Taste the tradition that everyone is talking about.",
        images: [s3img1, s3img2, s3img3],
        stat: "10k+ Happy"
    }
];

const FeatureImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative overflow-hidden rounded-3xl shadow-lg aspect-[4/3] w-full h-full">
            <AnimatePresence mode='wait'>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt="Feature"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-mahogany/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        </div>
    );
};

const WhyLoveUs = ({ features }) => {
    // specific features passed from parent or fallback to internal static
    const displayFeatures = features || FEATURES_DATA;

    return (
        <section className="py-24 bg-brand-coconut overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-mahogany mb-4">
                            Crafted with Care. <span className="text-brand-jaggery italic">Delivered with Love.</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-turmeric to-transparent mx-auto rounded-full mb-4"></div>
                        <p className="text-brand-black/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Authentic South Indian sweets made fresh every day, bringing the warmth of tradition to your home.
                        </p>
                    </motion.div>
                </div>

                {/* Feature Tiles - Alternating Layout */}
                <div className="flex flex-col gap-24">
                    {displayFeatures.map((feature, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                            >
                                {/* Image Side */}
                                <div className="w-full lg:w-1/2 relative group">
                                    <div className={`absolute inset-0 bg-brand-turmeric/10 rounded-3xl transform ${isEven ? '-rotate-2' : 'rotate-2'} transition-transform duration-500 group-hover:rotate-0`}></div>

                                    {/* SLIDER COMPONENT */}
                                    <FeatureImageSlider images={feature.images} />

                                    {/* Floating Badge/Icon on Image */}
                                    <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'} bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 z-10 transform transition-transform duration-500 hover:scale-105`}>
                                        <div className="p-2 bg-brand-cream rounded-full text-brand-mahogany font-bold text-xl">
                                            {/* Icon Placeholders */}
                                            {index === 0 && "🛡️"}
                                            {index === 1 && "🚚"}
                                            {index === 2 && "👥"}
                                        </div>
                                        <span className="font-serif font-bold text-brand-mahogany text-sm tracking-wide">{feature.stat}</span>
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="w-full lg:w-1/2 text-left">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="h-px w-12 bg-brand-turmeric"></span>
                                        <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">{feature.subtitle}</span>
                                    </div>
                                    <h3 className="text-4xl font-serif font-bold text-brand-mahogany mb-6 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-brand-black/70 text-lg leading-relaxed mb-8 font-light max-w-lg">
                                        {feature.description}
                                    </p>

                                    {/* Decorative Element */}
                                    <div className="flex items-center gap-2 opacity-50">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-brand-mahogany' : 'bg-brand-turmeric/50'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyLoveUs;
