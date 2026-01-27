import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return { items: [], totalAmount: 0, totalItems: 0, deliveryCharge: 50 };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { items: [], totalAmount: 0, totalItems: 0, deliveryCharge: 50 };
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify({
            items: state.items,
            totalAmount: state.totalAmount,
            totalItems: state.totalItems,
            deliveryCharge: state.deliveryCharge
        });
        localStorage.setItem('cart', serializedState);
    } catch {
        // ignore write errors
    }
};

const initialState = loadState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
            } else {
                state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
            }
            state.totalItems += newItem.quantity || 1;
            state.totalAmount += newItem.price * (newItem.quantity || 1);
            saveState(state);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                state.totalItems -= existingItem.quantity;
                state.totalAmount -= existingItem.price * existingItem.quantity;
                state.items = state.items.filter(item => item.id !== id);
                saveState(state);
            }
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item && quantity > 0) {
                const diff = quantity - item.quantity;
                item.quantity = quantity;
                state.totalItems += diff;
                state.totalAmount += item.price * diff;
                saveState(state);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
            saveState(state);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

