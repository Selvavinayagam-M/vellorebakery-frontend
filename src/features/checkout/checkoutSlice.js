import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    step: 1, // 1: Address, 2: Payment, 3: Confirmation
    shippingAddress: null,
    billingAddress: null,
    paymentMethod: 'card', // 'card', 'upi', 'cod'
    isProcessing: false,
    error: null,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload;
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        startCheckoutProcess: (state) => {
            state.isProcessing = true;
            state.error = null;
        },
        checkoutSuccess: (state) => {
            state.isProcessing = false;
            state.step = 3;
        },
        checkoutFailure: (state, action) => {
            state.isProcessing = false;
            state.error = action.payload;
        },
        resetCheckout: (state) => {
            state.step = 1;
            state.shippingAddress = null;
            state.billingAddress = null;
            state.isProcessing = false;
            state.error = null;
        }
    },
});

export const { setStep, setShippingAddress, setPaymentMethod, startCheckoutProcess, checkoutSuccess, checkoutFailure, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;

