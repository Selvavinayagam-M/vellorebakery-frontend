import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Array of product IDs
};

const favouritesSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {
        toggleFavourite: (state, action) => {
            const productId = action.payload;
            if (state.items.includes(productId)) {
                state.items = state.items.filter(id => id !== productId);
            } else {
                state.items.push(productId);
            }
        },
    },
});

export const { toggleFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
