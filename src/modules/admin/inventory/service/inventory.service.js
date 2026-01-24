const API_URL = 'http://localhost:5000/api/products'; // Inventory is effectively products

export const getInventory = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) return [];
        const products = await response.json();
        // Map product fields to inventory shape if needed
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
        return [];
    }
};

export const updateStockService = async (id, stock) => {
    // Should call API to update stock
    // Placeholder logic since direct stock update API might vary
    return { id, stock: parseInt(stock), status: stock > 0 ? 'In Stock' : 'Out of Stock' };
};

export const toggleAvailabilityService = async (id) => {
    return { id, status: 'Updated' };
};
