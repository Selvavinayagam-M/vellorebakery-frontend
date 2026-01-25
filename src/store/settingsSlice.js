import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API URL
const API_URL = 'http://localhost:5000/api/settings';

// Async Thunks
export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return await response.json();
    }
);

export const updateSettings = createAsyncThunk(
    'settings/updateSettings',
    async (settings, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            if (!response.ok) throw new Error('Failed to update settings');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // Default Fallbacks
    storeName: 'Vellore Sweets',
    contactEmail: 'contact@velloresweets.com',
    contactPhone: '+91 9876543210',
    address: '123, Gandhi Road, Vellore, Tamil Nadu',
    currency: '₹',
    taxRate: 5,
    deliveryCharge: 40,
    freeDeliveryThreshold: 1000,
    enableDelivery: true,
    notifications: true,

    loading: false,
    error: null
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                // Merge API data
                Object.assign(state, action.payload);
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update
            .addCase(updateSettings.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
            });
    }
});

export default settingsSlice.reducer;
