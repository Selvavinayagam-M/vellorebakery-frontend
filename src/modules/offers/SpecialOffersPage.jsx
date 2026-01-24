import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilterCategory, fetchProducts } from '../../store/productsSlice'; // Reusing store
import ProductsPage from '../products/ProductsPage'; // Reuse existing logic

const SpecialOffersPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilterCategory('offers'));
        dispatch(fetchProducts());
    }, [dispatch]);

    return <ProductsPage />;
};

export default SpecialOffersPage;
