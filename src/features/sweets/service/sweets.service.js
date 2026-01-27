import { sweetsData } from '../data/sweets.data';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sweetsService = {
    getAllSweets: async () => {
        await delay(500);
        return { success: true, data: sweetsData.items };
    },

    getSweetsBySubcategory: async (subcat) => {
        await delay(300);
        return { success: true, data: sweetsData.items.filter(i => i.subcategory === subcat) };
    }
};

