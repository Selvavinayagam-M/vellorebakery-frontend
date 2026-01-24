import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrders, updateOrderStatusService } from '../modules/admin/orders/service/orders.service';

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
                    const index = state.orders.findIndex(o => o.id === action.payload.id);
                    if (index !== -1) {
                        state.orders[index] = action.payload;
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
            order.customer.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
    });
};

export const { setFilterStatus, setSearchQuery } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
