import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/auth/userSlice';
import productsReducer from '../features/products/productsSlice';
import productDetailsReducer from '../features/productDetails/productDetailsSlice';
import cartReducer from '../features/cart/cartSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import orderReducer from '../features/orders/orderSlice';
import uiReducer from '../features/ui/uiSlice';
import homeReducer from '../features/home/homeSlice';
import offersReducer from '../features/offers/offersSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';
import addressReducer from '../features/address/addressSlice';
import orderTrackingReducer from '../features/orders/orderTrackingSlice';
import adminProductsReducer from '../features/admin/products/adminProductsSlice';
import adminDashboardReducer from '../features/admin/dashboard/adminDashboardSlice';
import adminOrdersReducer from '../features/admin/orders/adminOrdersSlice';
import adminCustomersReducer from '../features/admin/customers/adminCustomersSlice';
import adminInventoryReducer from '../features/admin/inventory/adminInventorySlice';
import adminReportsReducer from '../features/admin/reports/adminReportsSlice';
import settingsReducer from '../features/settings/settingsSlice';

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
        adminReports: adminReportsReducer, 
        settings: settingsReducer,
    },
});

export default store;

