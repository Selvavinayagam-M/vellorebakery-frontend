import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productsReducer from './productsSlice';
import productDetailsReducer from './productDetailsSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';
import orderReducer from './orderSlice';
import uiReducer from './uiSlice';
import homeReducer from './homeSlice';
import offersReducer from './offersSlice';
import favouritesReducer from './favouritesSlice';
import addressReducer from './addressSlice';
import orderTrackingReducer from './orderTrackingSlice';
import adminProductsReducer from './adminProductsSlice';
import adminDashboardReducer from './adminDashboardSlice';
import adminOrdersReducer from './adminOrdersSlice';
import adminCustomersReducer from './adminCustomersSlice';
import adminInventoryReducer from './adminInventorySlice';
import adminReportsReducer from './adminReportsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productsReducer,
        productDetails: productDetailsReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        ui: uiReducer,
        home: homeReducer,
        offers: offersReducer,
        favourites: favouritesReducer,
        address: addressReducer,
        orderTracking: orderTrackingReducer,
        adminProducts: adminProductsReducer,
        adminDashboard: adminDashboardReducer,
        adminOrders: adminOrdersReducer,
        adminCustomers: adminCustomersReducer,
        adminInventory: adminInventoryReducer,
        settings: settingsReducer,
    },
});

export default store;
