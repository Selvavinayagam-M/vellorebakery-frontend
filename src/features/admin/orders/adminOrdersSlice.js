import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrders, updateOrderStatus as updateOrderStatusService } from '../../../services/orders.service';

export const fetchOrders = createAsyncThunk(
    'adminOrders/fetchOrders',
    async () => {
        return await getOrders();
    }
);

export const updateOrderStatus = createAsyncThunk(
    'adminOrders/updateOrderStatus',
    async ({ id, status }) => {
        const updatedOrder = await updateOrderStatusService(id, status);
        return updatedOrder;
    }
);

const initialState = {
    orders: [],
    filteredOrders: [],
    filterStatus: 'All',
    searchQuery: '',
    isLoading: false,
    error: null,
};

const adminOrdersSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
            state.filteredOrders = applyFilters(state.orders, state.filterStatus, state.searchQuery);
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.filteredOrders = applyFilters(state.orders, state.filterStatus, state.searchQuery);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
                state.filteredOrders = applyFilters(state.orders, state.filterStatus, state.searchQuery);
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                if (action.payload) {
                    // Backend returns raw object with _id. Frontend state uses id.
                    const updatedId = action.payload._id || action.payload.id;
                    const index = state.orders.findIndex(o => o.id === updatedId);

                    if (index !== -1) {
                        // Merge only specific fields to preserve formatted data (date, customer, etc.)
                        state.orders[index] = {
                            ...state.orders[index],
                            status: action.payload.status,
                            statusHistory: action.payload.statusHistory
                        };
                        state.filteredOrders = applyFilters(state.orders, state.filterStatus, state.searchQuery);
                    }
                }
            });
    }
});

const applyFilters = (orders, status, query) => {
    return orders.filter(order => {
        const matchesStatus = status === 'All' || order.status === status;
        const matchesQuery =
            order.id.toLowerCase().includes(query.toLowerCase()) ||
            order.orderId?.toLowerCase().includes(query.toLowerCase()) ||
            (typeof order.customer === 'string'
                ? order.customer.toLowerCase().includes(query.toLowerCase())
                : order.customer?.name?.toLowerCase().includes(query.toLowerCase()));
        return matchesStatus && matchesQuery;
    });
};

export const { setFilterStatus, setSearchQuery } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;



