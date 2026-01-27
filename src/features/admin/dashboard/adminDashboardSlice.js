import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardMetrics, getAllOrders } from '../../../services/orders.service';
import { getInventoryStatus } from '../../../services/inventory.service';

export const fetchDashboardData = createAsyncThunk(
    'adminDashboard/fetchData',
    async () => {
        const [stats, orders, inventoryStatus] = await Promise.all([
            getDashboardMetrics(),
            getAllOrders(),
            getInventoryStatus()
        ]);

        // Map recent activity from order list
        const activity = orders.slice(0, 5).map(o => ({
            id: o._id,
            user: o.customer?.name || "Customer",
            message: `New order placed: ${o.orderId}`,
            type: 'order',
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: o.status
        }));

        return { stats, activity, inventoryStatus };
    }
);

const initialState = {
    stats: {
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        lowStockCount: 0,
    },
    recentActivity: [],
    inventoryStatus: null,
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
                state.stats = {
                    ...action.payload.stats,
                    ...action.payload.inventoryStatus // Overwrite lowStockCount and add others if needed
                };
                state.inventoryStatus = action.payload.inventoryStatus; // Store full object for dedicated card
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




