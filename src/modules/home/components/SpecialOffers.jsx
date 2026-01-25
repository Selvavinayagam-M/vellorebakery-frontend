import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../shared/components/Button';
import { COMBO_IMAGES } from '../../../assets/images';
const festivalGiftHamperImg = COMBO_IMAGES.festivalGift;
import { Link } from 'react-router-dom';

const SpecialOffers = () => {
    return (
        <section className="py-20 bg-brand-maroon relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-gold opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-gold opacity-10 blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="bg-brand-gold text-brand-black px-4 py-1 rounded-full text-sm font-bold tracking-wide mb-6 inline-block">LIMITED TIME OFFER</span>
                            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                                Festive Sweet Box <br />
                                <span className="text-brand-gold">Flat 20% OFF</span>
                            </h2>
                            <p className="text-brand-cream/90 text-lg mb-8 max-w-lg">
                                Celebrate the festive season with our specially curated assortment of premium mysore pak, kaju katli, and motichoor ladoos.
                            </p>
                            <Link to="/products?category=offers">
                                <Button className="bg-brand-gold text-brand-mahogany font-bold border-none shadow-lg hover:bg-white hover:text-brand-mahogany hover:scale-105 transition-all duration-300">
                                    Order Now
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="md:w-1/2 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-[60px] transform scale-90"></div>
                            <img
                                src={festivalGiftHamperImg}
                                alt="Premium Gift Box"
                                className="relative rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 max-w-md w-full border-4 border-white/10 object-cover aspect-square"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
