import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, Package, ShoppingCart, Users, Truck, FileText, Settings, LogOut, X } from 'lucide-react';
import { logout } from '../features/auth/userSlice';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Inventory', path: '/admin/inventory', icon: Truck },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <aside className={`w-64 bg-brand-mahogany text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-2xl font-serif font-bold tracking-tight">
                        Vellore
                        <span className="block text-[10px] text-gray-400 font-sans uppercase tracking-widest mt-1">Admin Panel</span>
                    </h1>
                </div>
                {/* Close Button (Mobile Only) */}
                <button
                    onClick={onClose}
                    className="lg:hidden text-white/70 hover:text-white p-1"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => onClose && window.innerWidth < 1024 && onClose()}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-brand-turmeric text-brand-mahogany font-bold shadow-md'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={`mr-3 ${isActive ? 'text-brand-mahogany' : 'text-gray-400 group-hover:text-white'}`} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900/20 hover:text-red-100 rounded-lg transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

