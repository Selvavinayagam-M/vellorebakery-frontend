import apiClient from '../../../app/apiClient';

export const giftingService = {
    getAllGifting: async () => {
        // Fetch products marked as gifts
        const response = await apiClient.get('/products?isGift=true');
        return { success: true, data: response.data };
    }
};

