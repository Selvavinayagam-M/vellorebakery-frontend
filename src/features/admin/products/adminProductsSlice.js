import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productsService from '../../../services/products.service';

export const fetchProducts = createAsyncThunk(
    'adminProducts/fetchProducts',
    async () => {
        const response = await productsService.getProducts();
        return response;
    }
);

export const addProduct = createAsyncThunk(
    'adminProducts/addProduct',
    async (product) => {
        const response = await productsService.addProduct(product);
        return response;
    }
);

export const updateProduct = createAsyncThunk(
    'adminProducts/updateProduct',
    async ({ id, data }) => {
        const response = await productsService.updateProduct(id, data);
        return response;
    }
);

export const deleteProduct = createAsyncThunk(
    'adminProducts/deleteProduct',
    async (id) => {
        await productsService.deleteProduct(id);
        return id;
    }
);

export const toggleStock = createAsyncThunk(
    'adminProducts/toggleStock',
    async (id) => {
        const response = await productsService.toggleProductStock(id);
        return response;
    }
);

export const toggleActive = createAsyncThunk(
    'adminProducts/toggleActive',
    async (id) => {
        const response = await productsService.toggleProductActive(id);
        return response;
    }
);

const initialState = {
    items: [],
    isLoading: false,
    error: null,
};

const adminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Add
            .addCase(addProduct.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload && p._id !== action.payload);
            })
            // Toggle Stock
            .addCase(toggleStock.fulfilled, (state, action) => {
                const product = state.items.find(p => p.id === action.payload.id);
                if (product) {
                    product.inStock = action.payload.inStock;
                }
            })
            // Toggle Active
            .addCase(toggleActive.fulfilled, (state, action) => {
                const product = state.items.find(p => (p._id === action.payload._id) || (p.id === action.payload.id));
                if (product) {
                    product.isActive = action.payload.isActive;
                }
            });
    },
});

export const { setLoading } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;



