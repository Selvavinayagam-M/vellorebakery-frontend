import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, fetchGiftingProducts as fetchGiftingProductsService } from '../../services/products.service';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        return await getAllProducts();
    }
);

export const fetchGiftingProducts = createAsyncThunk(
    'products/fetchGifting',
    async () => {
        const res = await fetchGiftingProductsService();
        return res;
    }
);

const initialState = {
    items: [],
    gifting: [],
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
                // Handle both array and { successful: true, data: [...] } formats
                const products = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
                state.items = products;
                state.filteredItems = products;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchGiftingProducts.fulfilled, (state, action) => {
                const products = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
                state.gifting = products;
            });
    }
});

export const { setFilterCategory, setPriceRange, setSortBy, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;



