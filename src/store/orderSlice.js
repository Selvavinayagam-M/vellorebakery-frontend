import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [], // Array of order objects
    currentOrder: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrderStart: (state) => {
            state.loading = true;
        },
        createOrderSuccess: (state, action) => {
            state.loading = false;
            state.orders.push(action.payload);
            state.currentOrder = action.payload;
        },
        createOrderFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { createOrderStart, createOrderSuccess, createOrderFailure } = orderSlice.actions;
export default orderSlice.reducer;
