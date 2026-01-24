import React from 'react';
import { motion } from 'framer-motion';

export const About = () => (
    <div className="container mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-serif font-bold text-brand-maroon mb-6">Our Story</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Founded in 1995, Vellore Sweets started as a small family kitchen with a big dream: to share the authentic taste of traditional South Indian sweets with the world. Over the decades, we have grown into a beloved brand, but our core values remain the same—purity, quality, and love in every bite.
            </p>
        </motion.div>
    </div>
);

export const Contact = () => (
    <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-brand-maroon mb-8 text-center">Contact Us</h1>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-gold outline-none" placeholder="Your Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-gold outline-none" placeholder="your@email.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-gold outline-none" placeholder="How can we help?"></textarea>
                </div>
                <button className="w-full bg-brand-maroon text-white py-3 rounded-lg font-medium hover:bg-brand-maroon/90 transition-colors">Send Message</button>
            </form>
        </div>
    </div>
);

export const PrivacyPolicy = () => (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-serif font-bold text-brand-maroon mb-6">Privacy Policy</h1>
        <div className="prose prose-stone">
            <p>At Vellore Sweets, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
            <h3>Information Collection</h3>
            <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us.</p>
        </div>
    </div>
);

export const TermsOfService = () => (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-serif font-bold text-brand-maroon mb-6">Terms of Service</h1>
        <div className="prose prose-stone">
            <p>By accessing or using the Vellore Sweets website, you agree to be bound by these Terms of Service.</p>
            <h3>Use of Service</h3>
            <p>You may use our services only for lawful purposes and in accordance with these Terms.</p>
        </div>
    </div>
);
