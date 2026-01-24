import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats, getRecentActivity } from '../modules/admin/dashboard/service/dashboard.service';

export const fetchDashboardData = createAsyncThunk(
    'adminDashboard/fetchData',
    async () => {
        const [stats, activity] = await Promise.all([
            getDashboardStats(),
            getRecentActivity()
        ]);
        return { stats, activity };
    }
);

const initialState = {
    stats: {
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
    },
    recentActivity: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const adminDashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload.stats;
                state.recentActivity = action.payload.activity;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { updateStats } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
