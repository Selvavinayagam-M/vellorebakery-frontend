import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsService } from '../modules/products/service/products.service';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        return await productsService.getAllProducts();
    }
);

const initialState = {
    items: [],
    filteredItems: [],
    categories: ["sweets", "snacks", "savories", "gifting"],
    loading: false,
    error: null,
    filters: {
        category: 'all',
        priceRange: [0, 2000],
        sortBy: 'popularity', // 'price-asc', 'price-desc', 'rating'
        searchQuery: '',
    },
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilterCategory: (state, action) => {
            state.filters.category = action.payload;
        },
        setPriceRange: (state, action) => {
            state.filters.priceRange = action.payload;
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.filters.searchQuery = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.items = action.payload.data;
                    state.filteredItems = action.payload.data;
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setFilterCategory, setPriceRange, setSortBy, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
