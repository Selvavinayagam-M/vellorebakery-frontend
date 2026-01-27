import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    // Select both states
    const userAuth = useSelector((state) => state.user);
    const adminAuth = useSelector((state) => state.adminAuth);
    const location = useLocation();

    // Determine target context based on requirement
    // If route requires Admin, check Admin Slice
    const requiresAdmin = allowedRoles?.includes('admin') || allowedRoles?.includes('superadmin');

    if (requiresAdmin) {
        if (!adminAuth.isAuthenticated) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
        return <Outlet />;
    }

    // Otherwise, check Customer Slice
    if (!userAuth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    return <Outlet />;
};

export default ProtectedRoute;

