import { giftingData } from '../data/gifting.data';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const giftingService = {
    getAllGifting: async () => { await delay(500); return { success: true, data: giftingData.items }; }
};
