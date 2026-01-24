import { createSlice } from '@reduxjs/toolkit';

import heroImg1 from '../assets/images/hero-images/heroimg-The Warmth of Grandma’s Kitchen.png';
import heroImg2 from '../assets/images/hero-images/heroimg-Melt-in-Mouth Mysore Pak.png';

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
