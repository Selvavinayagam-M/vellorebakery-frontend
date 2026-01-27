import apiClient from '../app/apiClient';

export const getInventory = async () => {
    try {
        const response = await apiClient.get('/products');
        const products = Array.isArray(response.data) ? response.data : (response.data.data || []);

        return products.map(p => ({
            id: p.id || p._id,
            name: p.name,
            sku: `SKU-${(p.id || p._id).slice(-4)}`,
            category: p.category,
            stock: p.stock || 0,
            status: p.stock > 0 ? (p.stock < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
            lastUpdated: new Date().toLocaleDateString()
        }));
    } catch (error) {
        console.error("Inventory fetch error", error);
        return [];
    }
};

export const updateStockService = async (id, stock) => {
    try {
        // Use the new dedicated stock update endpoint
        const response = await apiClient.put(`/products/${id}/stock`, { stock });
        const p = response.data;

        // Format response to match inventory item structure
        return {
            id: p._id || p.id,
            name: p.name,
            sku: `SKU-${(p._id || p.id).slice(-4)}`,
            category: p.category,
            unit: p.unit || 'Kg', // Ensure unit is preserved or defaulted
            stock: p.stock,
            status: p.stock > 0 ? (p.stock < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
            lastUpdated: new Date().toLocaleDateString()
        };
    } catch (error) {
        console.error("Stock update error", error);
        throw error;
    }
};

export const toggleAvailabilityService = async (id) => {
    try {
        const response = await apiClient.patch(`/products/${id}/toggle-active`);
        return { id, status: 'Updated' };
    } catch (error) {
        throw error;
    }
};

export const getInventoryStatus = async () => {
    try {
        const response = await apiClient.get('/inventory/status');
        return response.data;
    } catch (error) {
        console.error("Inventory Status fetch error", error);
        return null;
    }
};

export default {
    getInventory,
    updateStockService,
    toggleAvailabilityService,
    getInventoryStatus
};

