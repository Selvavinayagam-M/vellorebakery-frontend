import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeOffers: [
        { id: 1, type: 'discount', code: 'WELCOME10', description: '10% off on your first order', discount: 10 },
        { id: 2, type: 'shipping', code: 'FREESHIP', description: 'Free shipping on orders above ₹1000', minAmount: 1000 },
    ],
};

const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {},
});

export default offersSlice.reducer;
