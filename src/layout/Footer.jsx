import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

import logoImg from '../assets/images/logo/vellore-sweets-logo.png';

const Footer = () => {
    return (
        <footer className="bg-brand-black text-brand-cream pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="text-3xl font-serif font-bold text-white tracking-tight inline-block">
                            <img src={logoImg} alt="Vellore Sweets" className="h-16 w-auto object-contain" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Serving the authentic taste of tradition since 1995. Premium sweets and snacks handcrafted with love and purity.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-brand-cream/70 hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-brand-cream/70 hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-brand-cream/70 hover:text-brand-gold transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-brand-cream/70">
                            <li><Link to="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-brand-gold transition-colors">Shop All</Link></li>
                            <li><Link to="/about" className="hover:text-brand-gold transition-colors">Our Story</Link></li>
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
                            <li><Link to="/products?category=offers" className="hover:text-brand-gold transition-colors">Special Offers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-brand-cream/70">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="mt-1 flex-shrink-0 text-brand-gold" />
                                <span>123, Gandhi Road, Vellore, Tamil Nadu, 632001</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-brand-gold" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-brand-gold" />
                                <span>hello@velloresweets.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Vellore Sweets and Snacks. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/terms" className="hover:text-brand-gold">Terms of Service</Link>
                        <Link to="/privacy" className="hover:text-brand-gold">Privacy Policy</Link>
                        <Link to="/admin" className="hover:text-brand-gold text-brand-mahogany/40">Admin Access</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
