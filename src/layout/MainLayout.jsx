import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../components/CartSidebar';
import Toast from '../components/Toast';

const MainLayout = () => {
    return (
        <div className="font-sans text-gray-800 antialiased selection:bg-brand-mahogany selection:text-brand-turmeric flex flex-col min-h-screen">
            <Header />
            <CartSidebar />
            <Toast />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

