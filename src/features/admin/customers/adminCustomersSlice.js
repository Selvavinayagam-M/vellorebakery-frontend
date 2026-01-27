import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers, toggleCustomerStatusService, fetchCustomerOrders as fetchCustomerOrdersService } from '../../../services/customers.service';

export const fetchCustomers = createAsyncThunk(
    'adminCustomers/fetchCustomers',
    async () => {
        return await getCustomers();
    }
);

export const fetchCustomerOrders = createAsyncThunk(
    'adminCustomers/fetchCustomerOrders',
    async (id) => {
        return await fetchCustomerOrdersService(id);
    }
);

export const toggleCustomerStatus = createAsyncThunk(
    'adminCustomers/toggleCustomerStatus',
    async (id) => {
        return await toggleCustomerStatusService(id);
    }
);

const initialState = {
    customers: [],
    filteredCustomers: [],
    searchQuery: '',
    isLoading: false,
    historyLoading: false,
    selectedCustomerOrders: [],
    error: null,
};

const adminCustomersSlice = createSlice({
    name: 'adminCustomers',
    initialState,
    reducers: {
        setCustomerSearch: (state, action) => {
            state.searchQuery = action.payload;
            state.filteredCustomers = applyFilters(state.customers, state.searchQuery);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = action.payload;
                state.filteredCustomers = applyFilters(state.customers, state.searchQuery);
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.customers.findIndex(c => c.id === action.payload.id);
                    if (index !== -1) {
                        state.customers[index] = action.payload;
                        state.filteredCustomers = applyFilters(state.customers, state.searchQuery);
                    }
                }
            })
            .addCase(fetchCustomerOrders.pending, (state) => {
                state.historyLoading = true;
                state.selectedCustomerOrders = [];
            })
            .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.selectedCustomerOrders = action.payload;
            })
            .addCase(fetchCustomerOrders.rejected, (state, action) => {
                state.historyLoading = false;
                state.error = action.error.message;
            });
    }
});

const applyFilters = (customers, query) => {
    return customers.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
    );
};

export const { setCustomerSearch } = adminCustomersSlice.actions;
export default adminCustomersSlice.reducer;




