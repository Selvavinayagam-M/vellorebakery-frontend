import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../../../shared/components/Button';

import { HERO_IMAGES } from '../../../assets/images';

const heroImg1 = HERO_IMAGES.grandmasKitchen;
const heroImg2 = HERO_IMAGES.mysore;
const heroImg3 = HERO_IMAGES.bakery;

// Premium Food Imagery - 3 Slides
const SLIDES = [
    {
        id: 1,
        image: heroImg1,
        alt: "Traditional Indian Sweets",
        title: "The Warmth of Grandma's Kitchen",
        subtitle: "Handcrafted with pure farm ghee, organic jaggery, and generations of love."
    },
    {
        id: 2,
        image: heroImg2,
        alt: "Signature Mysore Pak",
        title: "Melt-in-Mouth Mysore Pak",
        subtitle: "Our signature delicacy, made fresh every morning with premium ghee."
    },
    {
        id: 3,
        image: heroImg3,
        alt: "Fresh Bakery Biscuits",
        title: "Freshly Baked Every Hour",
        subtitle: "From butter biscuits to soft buns, taste the magic of our ovens."
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 3000); // 3 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        // Full screen immersive hero
        <section className="relative w-full h-[100dvh] min-h-[600px] flex items-center bg-brand-black group overflow-hidden">
            {/* Watermark Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1 pointer-events-none opacity-[0.03]">
                <img src="../../../assets/images/logo/vellore-sweets-logo.png" alt="" className="w-[600px] max-w-none grayscale" />
            </div>

            {/* Background Slides */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }} // Smooth slow fade
                    >
                        <img
                            src={SLIDES[currentSlide].image}
                            alt={SLIDES[currentSlide].alt}
                            className="w-full h-full object-cover object-center brightness-[0.45]" // Darkened for text contrast
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Overlay */}
            <div className="container mx-auto px-[clamp(1.5rem,5vw,5rem)] relative z-10 text-center text-white h-full flex flex-col justify-end items-center pb-20 md:pb-28">
                <motion.div
                    key={`content-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl"
                >
                    {/* Badge */}
                    <div className="inline-block mb-4 md:mb-6">
                        <span className="bg-brand-turmeric/90 text-brand-mahogany font-bold tracking-[0.2em] text-[10px] md:text-xs py-1.5 px-4 rounded-full uppercase shadow-lg backdrop-blur-sm border border-brand-turmeric/50">
                            A Legacy of Taste & Purity
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 leading-tight tracking-tight text-shadow-lg text-brand-cream whitespace-nowrap border-none text-center">
                        {SLIDES[currentSlide].title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base md:text-xl text-brand-cream/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed font-light font-sans tracking-wide">
                        {SLIDES[currentSlide].subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/products?category=sweets">
                            <Button variant="primary" size="lg" className="min-w-[200px] text-base md:text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 py-4">
                                Order Fresh Sweets
                            </Button>
                        </Link>
                        <Link to="/products?category=bakery">
                            <Button variant="outline" size="lg" className="min-w-[200px] text-base md:text-lg border-white text-white hover:bg-transparent hover:text-brand-turmeric hover:border-brand-turmeric py-4">
                                View Bakery Menu
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx
                            ? 'bg-brand-turmeric w-8'
                            : 'bg-white/50 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows Removed */}
        </section>
    );
};

export default HeroSection;
