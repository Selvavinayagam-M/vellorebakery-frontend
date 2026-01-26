import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import HeroSection from './components/HeroSection';
import Categories from './components/Categories';
import PopularItems from './components/PopularItems';
import WhyLoveUs from './components/WhyLoveUs';
import SpecialOffers from './components/SpecialOffers';
import FreshBakes from './components/FreshBakes';
import BakeryCombos from './components/BakeryCombos';

import { COLLECTION_IMAGES } from '../../assets/images';

const STATIC_HOME_DATA = {
    hero: {
        title: "Experience the Royal Taste of Vellore",
        subtitle: "Authentic Traditional Sweets & Savories made with pure Ghee and Love.",
        ctaText: "Shop Now",
        ctaLink: "/products"
    },
    categories: [
        { id: '1', name: 'Sweets', image: COLLECTION_IMAGES.sweets, link: '/products?category=sweets' },
        { id: '2', name: 'Snacks', image: COLLECTION_IMAGES.snacks, link: '/products?category=snacks' },
        { id: '3', name: 'Bakery', image: COLLECTION_IMAGES.bakery, link: '/products?category=bakery' },
        { id: '4', name: 'Gifting', image: COLLECTION_IMAGES.gifting, link: '/gifting' }
    ],

};

const Home = () => {
    const dispatch = useDispatch();
    const { items: products, isLoading } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Filter Popular Items (Bestsellers)
    const popularProducts = products?.filter(p => p.flags?.isBestseller).slice(0, 4) || [];

    return (
        <div className="bg-white min-h-screen pb-20">
            <HeroSection data={STATIC_HOME_DATA.hero} />
            <Categories categories={STATIC_HOME_DATA.categories} />

            <PopularItems products={popularProducts} />
            <WhyLoveUs />
            <SpecialOffers />
            <FreshBakes />
            <BakeryCombos />
        </div>
    );
};

export default Home;

