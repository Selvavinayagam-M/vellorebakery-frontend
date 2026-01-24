import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers, toggleCustomerStatusService } from '../modules/admin/customers/service/customers.service';

export const fetchCustomers = createAsyncThunk(
    'adminCustomers/fetchCustomers',
    async () => {
        return await getCustomers();
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
