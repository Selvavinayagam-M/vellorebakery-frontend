import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilterCategory, fetchProducts } from '../../store/productsSlice';
import ProductsPage from '../products/ProductsPage';

const GiftingPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilterCategory('gifting'));
        dispatch(fetchProducts());
    }, [dispatch]);

    return <ProductsPage />;
};

export default GiftingPage;
