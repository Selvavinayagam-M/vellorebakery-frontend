import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { LOGO_IMAGES } from '../assets/images';
const logoImg = LOGO_IMAGES.main;

const Footer = () => {
    const settings = useSelector((state) => state.settings);

    return (
        <footer className="bg-brand-black text-brand-cream pt-16 pb-8">
            <div className="container mx-auto px-4">
<<<<<<< HEAD
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
=======
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12">
>>>>>>> 63c95fa90c53ffc457388675af0d65e5476b0090
                    {/* Brand */}
                    <div className="space-y-4 text-center md:text-left">
                        <Link to="/" className="text-3xl font-serif font-bold text-white tracking-tight inline-block">
                            <img src={logoImg} alt="Vellore Sweets" className="h-32 md:h-48 w-auto object-contain" />
                        </Link>

                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-brand-cream/70">
                            <li><Link to="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-brand-gold transition-colors">Shop All</Link></li>
                            <li><Link to="/track-order" className="hover:text-brand-gold transition-colors">Track Order</Link></li>
                            <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold text-white mb-6">Categories</h4>
                        <ul className="space-y-3 text-sm text-brand-cream/70">
                            <li><Link to="/products?category=sweets" className="hover:text-brand-gold transition-colors">Traditional Sweets</Link></li>
                            <li><Link to="/products?category=snacks" className="hover:text-brand-gold transition-colors">Savory Snacks</Link></li>
                            <li><Link to="/products?category=gifting" className="hover:text-brand-gold transition-colors">Gift Boxes</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-brand-cream/70">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="mt-1 flex-shrink-0 text-brand-gold" />
                                <span>{settings.address}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-brand-gold" />
                                <span>{settings.contactPhone}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-brand-gold" />
                                <span>{settings.contactEmail}</span>
                            </li>
                        </ul>
                        <div className="flex justify-center md:justify-start space-x-4 mt-6">
                            <a href="#" className="text-brand-cream/70 hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-brand-cream/70 hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-brand-cream/70 hover:text-brand-gold transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/terms" className="hover:text-brand-gold">Terms of Service</Link>
                        <Link to="/privacy" className="hover:text-brand-gold">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

