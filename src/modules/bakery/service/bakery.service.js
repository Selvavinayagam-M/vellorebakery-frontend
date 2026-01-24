import { bakeryData } from '../data/bakery.data';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const bakeryService = {
    getAllBakery: async () => { await delay(500); return { success: true, data: bakeryData.items }; }
};
