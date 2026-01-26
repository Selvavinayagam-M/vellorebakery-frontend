import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
        // Option: Redirect to unauthorized page or home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

