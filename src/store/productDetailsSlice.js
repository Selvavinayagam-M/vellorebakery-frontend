import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsService } from '../modules/products/service/products.service';

export const fetchProductById = createAsyncThunk(
    'productDetails/fetchProductById',
    async (id) => {
        const response = await productsService.getProductById(id);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

const initialState = {
    currentProduct: null,
    loading: false,
    error: null,
};

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState,
    reducers: {
        clearProductDetails: (state) => {
            state.currentProduct = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearProductDetails } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;
