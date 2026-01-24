
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, Bell, User, MoreVertical } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Determine page title based on path
    const getPageTitle = () => {
        const path = location.pathname.split('/')[2];
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700 lg:hidden p-1 rounded-md hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 font-serif truncate">{getPageTitle()}</h2>
                    </div>

                    {/* Desktop Header Actions */}
                    <div className="hidden sm:flex items-center gap-6">
                        <button className="relative text-gray-500 hover:text-brand-mahogany transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-800">Admin User</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-brand-mahogany text-white rounded-full flex items-center justify-center">
                                <User size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Header Actions (Overflow) */}
                    <div className="sm:hidden flex items-center">
                        <button className="text-gray-500 hover:text-gray-700 p-2">
                            <MoreVertical size={24} />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
