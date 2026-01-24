import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilterCategory, fetchProducts } from '../../store/productsSlice'; // Reusing store
import ProductsPage from '../products/ProductsPage'; // Reuse existing logic

// Instead of duplicating logic, we can either redirect or wrap. 
// Wrapping ProductsPage but pre-setting category to 'sweets' is a clean way to keep the route.
// Or we can just import the logic.

const SweetsPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilterCategory('sweets'));
        dispatch(fetchProducts());
    }, [dispatch]);

    // Render ProductsPage but we can customize the title inside it or just render it directly.
    // However, ProductsPage expects to read URL params usually.
    // Let's force proper state.

    // Actually, simpler: ProductsPage handles everything if we pass props or rely on store.
    // But ProductsPage inspects URL search params.
    // Let's just redirect or duplicate the layout with Redux selector.
    // Making it a thin wrapper:

    return <ProductsPage />;
};

export default SweetsPage;
