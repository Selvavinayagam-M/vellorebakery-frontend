const API_URL = 'http://localhost:5000/api/products';

export const productsService = {
    /**
     * Get all products
     * @returns {Promise<Object>}
     */
    getAllProducts: async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    },

    /**
     * Get product by ID
     * @param {string} id 
     * @returns {Promise<Object>}
     */
    getProductById: async (id) => {
        try {
            // Note: Backend implementation currently lacks specific route for GET /:id.
            // Workaround: Fetch all products and filter by ID on the client side.
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            const product = data.find(p => p._id === id || p.id === id); // MongoDB uses _id

            if (product) return { success: true, data: product };
            return { success: false, message: 'Product not found' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};
