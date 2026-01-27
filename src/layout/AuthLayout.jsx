import React from 'react';
import { Outlet } from 'react-router-dom';
import Toast from '../components/Toast';

const AuthLayout = () => {
    return (
        <div className="font-sans text-gray-800 antialiased selection:bg-brand-mahogany selection:text-brand-turmeric">
            {/* Toast is global, so it's good to have it here too in case auth actions trigger toasts */}
            <Toast />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
