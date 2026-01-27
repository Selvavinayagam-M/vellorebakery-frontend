import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import AdminLayout from '../layout/AdminLayout';

// Modules (Pages)
import Home from '../features/home/Home';
import ProductsPage from '../features/products/ProductsPage';
import SweetsPage from '../features/sweets/SweetsPage';
import SnacksPage from '../features/snacks/SnacksPage';
import BakeryPage from '../features/bakery/BakeryPage';
import GiftingPage from '../features/gifting/GiftingPage';
import ProductDetails from '../features/productDetails/ProductDetails';
import Cart from '../features/cart/Cart';
import Checkout from '../features/checkout/Checkout';
import OrderSuccess from '../features/orders/OrderSuccess';
import TrackOrderPage from '../features/orders/TrackOrderPage';
import Login from '../features/auth/Login';
import Profile from '../features/auth/Profile';
import AccountDetails from '../features/auth/AccountDetails';

// Admin Modules
import AdminDashboard from '../features/admin/dashboard/Dashboard';
import ProductList from '../features/admin/products/ProductList';
import AddEditProduct from '../features/admin/products/AddEditProduct';
import OrdersPage from '../features/admin/orders/OrdersPage';
import CustomersPage from '../features/admin/customers/CustomersPage';
import InventoryPage from '../features/admin/inventory/InventoryPage';
import ReportsPage from '../features/admin/reports/ReportsPage';
import SettingsPage from '../features/admin/settings/SettingsPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes - Wrapped in AuthLayout */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
            </Route>

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

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/account/details" element={<AccountDetails />} />
                </Route>
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

