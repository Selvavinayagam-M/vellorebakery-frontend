import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings, updateSettingsService } from '../modules/admin/settings/service/settings.service';

export const fetchSettings = createAsyncThunk(
    'adminSettings/fetchSettings',
    async () => {
        return await getSettings();
    }
);

export const updateSettings = createAsyncThunk(
    'adminSettings/updateSettings',
    async (newSettings) => {
        return await updateSettingsService(newSettings);
    }
);

const initialState = {
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    currency: 'INR',
    taxRate: 0,
    enableDelivery: false,
    deliveryFee: 0,
    notifications: false,
    isLoading: false,
    error: null,
};

const adminSettingsSlice = createSlice({
    name: 'adminSettings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                Object.assign(state, action.payload);
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
            });
    }
});

export default adminSettingsSlice.reducer;
