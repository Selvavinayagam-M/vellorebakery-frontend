const API_URL = 'http://localhost:5000/api/products';

export const getProducts = async () => {
    try {
        // Admin route might be different if protecting, but using public for now or admin specific
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const addProduct = async (product) => {
    try {
        const token = localStorage.getItem('token'); // Get token from storage
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add product');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (product) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/${product.id || product._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Failed to update product');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return id;
    } catch (error) {
        throw error;
    }
};

export const toggleProductStock = async (id) => {
    // Backend doesn't have specific toggle endpoint, usually PATCH or PUT
    // For now we might need to fetch, toggle, update.
    // Or just implement updateProduct logic in UI.
    // Let's assuming UI calls updateProduct.
    // Leaving legacy support or implementing minimal:
    console.warn("toggleProductStock should use updateProduct in full-stack");
    return { id };
};

export const toggleProductActive = async (id) => {
    // Similar to stock
    console.warn("toggleProductActive should use updateProduct in full-stack");
    return { id };
};
