import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReports } from '../modules/admin/reports/service/reports.service';

export const fetchReports = createAsyncThunk(
    'adminReports/fetchReports',
    async () => {
        return await getReports();
    }
);

const initialState = {
    dailySales: [],
    monthlyRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0, // NEW
    pendingCOD: 0,     // NEW
    topProducts: [],
    isLoading: false,
    error: null,
};

const adminReportsSlice = createSlice({
    name: 'adminReports',
    initialState,
    reducers: {
        filterReports: (state, action) => {
            console.log("Filtering reports for range:", action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dailySales = action.payload.dailySales;
                state.monthlyRevenue = action.payload.monthlyRevenue;
                state.totalOrders = action.payload.totalOrders;
                state.totalCustomers = action.payload.totalCustomers; // NEW
                state.pendingCOD = action.payload.pendingCOD;         // NEW
                state.topProducts = action.payload.topProducts;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { filterReports } = adminReportsSlice.actions;
export default adminReportsSlice.reducer;
