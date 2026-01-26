import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductById } from '../../services/products.service';

export const fetchProductById = createAsyncThunk(
    'productDetails/fetchProductById',
    async (id) => {
        // Direct call to imported function, no service object
        const response = await getProductById(id);
        // Assuming response is the data object or has success field
        // Adjust based on service return. Service returns response.data
        return response;
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



