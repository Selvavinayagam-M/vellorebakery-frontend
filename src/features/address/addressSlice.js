import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    savedAddresses: [
        {
            id: '1',
            name: 'John Doe',
            street: '123 Gandhi Road',
            city: 'Vellore',
            state: 'Tamil Nadu',
            zip: '632001',
            phone: '9876543210',
            type: 'Home'
        }
    ],
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        addAddress: (state, action) => {
            state.savedAddresses.push(action.payload);
        },
        removeAddress: (state, action) => {
            state.savedAddresses = state.savedAddresses.filter(addr => addr.id !== action.payload);
        },
        updateAddress: (state, action) => {
            const index = state.savedAddresses.findIndex(addr => addr.id === action.payload.id);
            if (index !== -1) {
                state.savedAddresses[index] = action.payload;
            }
        }
    },
});

export const { addAddress, removeAddress, updateAddress } = addressSlice.actions;
export default addressSlice.reducer;

