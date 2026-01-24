const API_URL = 'http://localhost:5000/api/products';

export const offersService = {
    getAllOffers: async () => {
        try {
            // Fetch products that are combos or have offers. 
            // For now, fetching 'combos' category as a proxy or all products and filtering client-side if needed.
            // Better: backend support. Assuming backend supports ?category=combos
            const response = await fetch(`${API_URL}?category=combos`);

            if (!response.ok) {
                // Fallback: fetch all and filter client side if category filter isn't perfect on backend yet
                const allRes = await fetch(API_URL);
                const allData = await allRes.json();
                // Filter for offers logic
                const offers = allData.filter(p => p.category === 'combos' || p.category === 'offers' || (p.oldPrice && p.oldPrice > p.price));
                return { success: true, data: offers };
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    },

    getOfferById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Offer not found');
            }
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};
