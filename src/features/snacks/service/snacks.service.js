import { snacksData } from '../data/snacks.data';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const snacksService = {
    getAllSnacks: async () => { await delay(500); return { success: true, data: snacksData.items }; }
};

