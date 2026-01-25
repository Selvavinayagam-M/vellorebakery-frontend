import { createSlice } from '@reduxjs/toolkit';

import { HERO_IMAGES } from '../assets/images';

const heroImg1 = HERO_IMAGES.grandmasKitchen;
const heroImg2 = HERO_IMAGES.mysore;

const initialState = {
    heroSlides: [
        {
            id: 1,
            title: "Authentic Vellore Sweets",
            subtitle: "Tradition in every bite",
            image: heroImg1,
            cta: "Shop Now"
        },
        {
            id: 2,
            title: "Handcrafted Snacks",
            subtitle: "Crispy, Crunchy & Delicious",
            image: heroImg2,
            cta: "Explore Snacks"
        }
    ],
    loading: false,
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
});

export default homeSlice.reducer;
