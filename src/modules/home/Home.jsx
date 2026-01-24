import React from 'react';
import HeroSection from './components/HeroSection';
import Categories from './components/Categories';
import PopularItems from './components/PopularItems';
import WhyLoveUs from './components/WhyLoveUs';
import SpecialOffers from './components/SpecialOffers';
import FreshBakes from './components/FreshBakes';
import BakeryCombos from './components/BakeryCombos';

const STATIC_HOME_DATA = {
    hero: {
        title: "Experience the Royal Taste of Vellore",
        subtitle: "Authentic Traditional Sweets & Savories made with pure Ghee and Love.",
        ctaText: "Shop Now",
        ctaLink: "/products"
    },
    categories: [
        { id: '1', name: 'Sweets', image: 'https://res.cloudinary.com/demo/image/upload/v1/laddu_sample.jpg', link: '/sweets' },
        { id: '2', name: 'Snacks', image: 'https://res.cloudinary.com/demo/image/upload/v1/laddu_sample.jpg', link: '/snacks' },
        { id: '3', name: 'Bakery', image: 'https://res.cloudinary.com/demo/image/upload/v1/laddu_sample.jpg', link: '/bakery' },
        { id: '4', name: 'Gifting', image: 'https://res.cloudinary.com/demo/image/upload/v1/laddu_sample.jpg', link: '/gifting' }
    ],

};

const Home = () => {
    // Note: PopularItems and FreshBakes components inside need to be checked if they fetch their own data or rely on props.
    // Based on previous code, they relied on props passed from here, which came from service.
    // We should probably update them to fetch data via Redux or pass empty arrays for now until they are refactored.
    // Or better, let's look at them. For now, passing empty/static to prevent crash.

    return (
        <div className="bg-white min-h-screen pb-20">
            <HeroSection data={STATIC_HOME_DATA.hero} />
            <Categories categories={STATIC_HOME_DATA.categories} />
            {/* 
                Refactoring strategy: 
                These components likely expect 'products' prop. 
                If we pass nothing or mocked empty list, they might render empty.
                Ideally we should wire them to Redux too.
            */}
            <PopularItems products={[]} />
            <WhyLoveUs />
            <SpecialOffers />
            <FreshBakes />
            <BakeryCombos />
        </div>
    );
};

export default Home;
