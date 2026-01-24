import { HOME_DATA } from '../data/home.data';
import { favoritesData } from '../data/favorites.data';

export const homeService = {
    getHomeData: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        ...HOME_DATA,
                        popularItems: favoritesData
                    }
                });
            }, 800);
        });
    }
};
