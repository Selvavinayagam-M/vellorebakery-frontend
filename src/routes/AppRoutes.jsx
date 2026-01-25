import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout';

// Modules (Pages)
import Home from '../modules/home/Home';
import ProductsPage from '../modules/products/ProductsPage';
import SweetsPage from '../modules/sweets/SweetsPage';
import SnacksPage from '../modules/snacks/SnacksPage';
import BakeryPage from '../modules/bakery/BakeryPage';
import GiftingPage from '../modules/gifting/GiftingPage';
import ProductDetails from '../modules/productDetails/ProductDetails';
import Cart from '../modules/cart/Cart';
import Checkout from '../modules/checkout/Checkout';
import OrderSuccess from '../modules/order/OrderSuccess';
import TrackOrderPage from '../modules/order/TrackOrderPage';
import Login from '../modules/user/Login';
import Profile from '../modules/user/Profile';

// Admin Modules
import AdminDashboard from '../modules/admin/dashboard/Dashboard';
import ProductList from '../modules/admin/products/ProductList';
import AddEditProduct from '../modules/admin/products/AddEditProduct';
import OrdersPage from '../modules/admin/orders/OrdersPage';
import CustomersPage from '../modules/admin/customers/CustomersPage';
import InventoryPage from '../modules/admin/inventory/InventoryPage';
import ReportsPage from '../modules/admin/reports/ReportsPage';
import SettingsPage from '../modules/admin/settings/SettingsPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes - Wrapped in MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/sweets" element={<SweetsPage />} />
                <Route path="/snacks" element={<SnacksPage />} />
                <Route path="/bakery" element={<BakeryPage />} />
                <Route path="/gifting" element={<GiftingPage />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes - Wrapped in ProtectedRoute & AdminLayout */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />

                    {/* Products */}
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/add" element={<AddEditProduct />} />
                    <Route path="products/edit/:id" element={<AddEditProduct />} />

                    {/* Other Admin Pages */}
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
