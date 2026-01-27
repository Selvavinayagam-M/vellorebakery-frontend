import apiClient from '../app/apiClient';

export const offersService = {
    getAllOffers: async () => {
        try {
            // First try filtering by category 'combos'
            const response = await apiClient.get('/products', { params: { category: 'combos' } });

            // If backend returns list directly
            if (Array.isArray(response.data)) {
                return { success: true, data: response.data };
            }
            return { success: true, data: response.data.data || response.data };

        } catch (error) {
            console.error("Fetch offers error", error);
            // Fallback: fetch all and filter
            try {
                const res = await apiClient.get('/products');
                const products = Array.isArray(res.data) ? res.data : (res.data.data || []);
                const offers = products.filter(p => p.category === 'combos' || p.category === 'offers' || (p.oldPrice && p.oldPrice > p.price));
                return { success: true, data: offers };
            } catch (e) {
                return { success: false, message: e.message };
            }
        }
    },

    getOfferById: async (id) => {
        try {
            const response = await apiClient.get(`/products/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

export default offersService;

