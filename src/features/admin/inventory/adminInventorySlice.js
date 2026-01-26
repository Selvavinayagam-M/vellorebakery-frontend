import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory, updateStockService, toggleAvailabilityService } from '../../../services/inventory.service';

export const fetchInventory = createAsyncThunk(
    'adminInventory/fetchInventory',
    async () => {
        return await getInventory();
    }
);

export const updateStock = createAsyncThunk(
    'adminInventory/updateStock',
    async ({ id, stock }) => {
        return await updateStockService(id, stock);
    }
);

export const toggleAvailability = createAsyncThunk(
    'adminInventory/toggleAvailability',
    async (id) => {
        return await toggleAvailabilityService(id);
    }
);

const initialState = {
    items: [],
    isLoading: false,
    error: null,
};

const adminInventorySlice = createSlice({
    name: 'adminInventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateStock.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.items.findIndex(i => i.id === action.payload.id);
                    if (index !== -1) {
                        state.items[index] = action.payload;
                    }
                }
            })
            .addCase(toggleAvailability.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.items.findIndex(i => i.id === action.payload.id);
                    if (index !== -1) {
                        state.items[index] = action.payload;
                    }
                }
            });
    }
});

export default adminInventorySlice.reducer;



