import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersService } from '../../services/orders.service'; // Ensure correct path or use global service if fixed

// Thunk to fetch user's orders
export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ordersService.getMyOrders();
            // Service returns [orders] or we handle it
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Order handlers
            .addCase(createOrderSuccess, (state, action) => {
                state.loading = false;
                // state.orders.push(action.payload); // Don't push duplicates if we re-fetch
                state.currentOrder = action.payload;
            });
    }
});

export const { createOrderStart, createOrderSuccess, createOrderFailure } = orderSlice.actions;
export default orderSlice.reducer;



