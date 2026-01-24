import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    timeline: [
        { status: 'Order Placed', date: '2023-10-25 10:00 AM', completed: true },
        { status: 'Processing', date: '2023-10-25 02:00 PM', completed: true },
        { status: 'Shipped', date: '2023-10-26 09:00 AM', completed: false },
        { status: 'Out for Delivery', date: null, completed: false },
        { status: 'Delivered', date: null, completed: false },
    ],
};

const orderTrackingSlice = createSlice({
    name: 'orderTracking',
    initialState,
    reducers: {
        updateTrackingStatus: (state, action) => {
            // Logic to update status
        }
    },
});

export const { updateTrackingStatus } = orderTrackingSlice.actions;
export default orderTrackingSlice.reducer;
