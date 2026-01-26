import apiClient from '../app/apiClient';

export const getAllProducts = async (params) => {
    // Public: router.get('/', getProducts);
    const response = await apiClient.get('/products', { params });
    return response.data;
};

export const getProductById = async (id) => {
    
    const response = await apiClient.get('/products');
    // response.data should be array or {products: []}
    const products = Array.isArray(response.data) ? response.data : response.data.products;
    return products.find(p => p._id === id || p.id === id);
};

export const createProduct = async (productData) => {
    const headers = productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/products', productData, { headers });
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const headers = productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put(`/products/${id}`, productData, { headers });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
};

// Aliases and extra methods for Admin Slice
export const getProducts = getAllProducts;

export const addProduct = createProduct;

export const toggleProductStock = async (id) => {
   
    const response = await apiClient.patch(`/products/${id}/status`, { inStock: true }); // Toggle logic needs param? 
    // Actually, usually frontend toggles state and sends new state.
    // Ideally slice sends the NEW value.
    return response.data;
};

export const toggleProductActive = async (id) => {
    const response = await apiClient.patch(`/products/${id}/status`, { isActive: true });
    return response.data;
};

export const fetchGiftingProducts = async () => {
    const response = await apiClient.get('/products?isGift=true');
    return response.data;
};

export default {
    getAllProducts,
    getProducts,
    getProductById,
    createProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    toggleProductActive,
    fetchGiftingProducts
};

