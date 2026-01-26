import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRevenueAnalytics, getTopSellingProducts, getReportsOverview } from '../../../services/reports.service';

export const fetchReports = createAsyncThunk(
    'adminReports/fetchReports',
    async () => {
        const [revenueData, topProducts, overview] = await Promise.all([
            getRevenueAnalytics('daily'), // Request daily data explicitly
            getTopSellingProducts(),
            getReportsOverview()
        ]);

        // Map revenue stats to chart-friendly format
        // Backend returns: data: [{ _id: { year, month, day }, totalRevenue }]
        const dailySales = revenueData.data.map(item => ({
            day: `${item._id.day}/${item._id.month}`,
            sales: item.totalRevenue,
            date: `${item._id.year}-${item._id.month}-${item._id.day}`
        })).slice(-7); // Keep last 7 entries for the default view

        return {
            dailySales: dailySales,
            monthlyRevenue: overview.monthlyRevenue,
            totalOrders: overview.totalOrders,
            totalCustomers: overview.totalCustomers,
            pendingCOD: overview.pendingCOD,
            topProducts: topProducts || []
        };
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



