import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilterCategory, fetchProducts } from '../../store/productsSlice';
import ProductsPage from '../products/ProductsPage';

const SnacksPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilterCategory('snacks'));
        dispatch(fetchProducts());
    }, [dispatch]);

    return <ProductsPage />;
};
export default SnacksPage;
