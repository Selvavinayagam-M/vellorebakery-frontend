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
        const token = localStorage.getItem('token');

        const headers = { 'Authorization': `Bearer ${token}` };
        // If not FormData, set Content-Type to application/json
        if (!(product instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: product instanceof FormData ? product : JSON.stringify(product),
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

        const headers = { 'Authorization': `Bearer ${token}` };
        // If product is FormData, let browser set Content-Type (multipart/form-data)
        // If product is a plain object or JSON, set Content-Type: application/json

        // Check if we are sending FormData (Legacy wrapper or simplified)
        // The AddEditProduct now constructs FormData, but mostly with string values (including image URL).
        // Since we are still passing FormData to this function from AddEditProduct, we rely on browser.
        // BUT, if we wanted to switch to pure JSON:
        /* 
        if (!(product instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(product);
        }
        */

        // Since AddEditProduct constructs FormData, fetch will handle multipart automatically.
        // However, backend controller now handles string based 'image' field in req.body.
        // Multipart/form-data supports text fields, so req.body.image will be available.
        // We don't strictly need to force JSON here if FormData is already used, 
        // as long as we aren't sending a File object when we mean to send a URL string.
        // AddEditProduct change ensured we append string.

        // Get ID from FormData or Object
        const id = product instanceof FormData ? product.get('id') : (product.id || product._id);

        console.log("Service updating product ID:", id);
        if (!id || id === 'undefined') throw new Error("Product ID is missing or invalid");

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers,
            body: product instanceof FormData ? product : JSON.stringify(product),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update product');
        }
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
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to toggle status');
        return await response.json();
    } catch (error) {
        throw error;
    }
};
