import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Package, MapPin, LogOut, Heart, RotateCcw } from 'lucide-react';
import { logout } from './userSlice';
import { fetchMyOrders } from '../orders/orderSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProductCard from '../../components/ProductCard';
import { addToCart } from '../cart/cartSlice';
import { showToast } from '../ui/uiSlice';
import AccountDetails from './AccountDetails';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const handleReorder = (orderId) => {
        // In a real app, this would fetch order details and add specific items
        // For mock, just redirect to products or show toast
        dispatch(showToast({ message: `Items from #${orderId} added to cart` }));
        navigate('/cart');
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-10">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No orders yet. Start shopping!</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>Browse Sweets</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4 text-red-500">Your Orders (UPDATED)</h3>
            {[...orders].reverse().map((order) => (
                <Card key={order._id || order.id} className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="font-bold text-brand-maroon">#{order.orderId || order.id}</span>
                            <span className="text-gray-500 text-sm ml-2">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
                            </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Delivered' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                        {order.items.map(item => {
                            const weightStr = item.weight ? `(${item.weight})` : '';
                            return `${item.name} ${!item.name.includes('(') ? weightStr : ''} x ${item.qty}`;
                        }).join(', ')}
                    </p>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span>Total: ₹{order.totalAmount || order.total}</span>
                        <div className="space-x-2">
                            <button
                                onClick={() => navigate(`/track-order?orderId=${order.orderId || order.id}`)}
                                className="text-brand-maroon hover:underline"
                            >
                                View Details
                            </button>
                            {order.status === 'Delivered' && (
                                <button
                                    onClick={() => handleReorder(order.id)}
                                    className="text-brand-gold hover:text-brand-maroon flex items-center space-x-1"
                                >
                                    <RotateCcw size={14} /> <span>Reorder</span>
                                </button>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

const SavedAddresses = () => {
    const { savedAddresses } = useSelector(state => state.address);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Saved Addresses</h3>
                <Button size="sm" variant="outline">Add New</Button>
            </div>
            {savedAddresses.map(addr => (
                <Card key={addr.id} className="p-4 relative">
                    <h4 className="font-bold">{addr.name}</h4>
                    <span className="absolute top-4 right-4 text-xs bg-gray-100 px-2 py-1 rounded uppercase tracking-wide">{addr.type}</span>
                    <p className="text-sm text-gray-600 mt-1">
                        {addr.street},<br />
                        {addr.city}, {addr.state} - {addr.zip}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Phone: {addr.phone}</p>
                    <div className="mt-3 flex space-x-3 text-sm font-medium text-brand-maroon">
                        <button className="hover:underline">Edit</button>
                        <button className="hover:underline text-red-500">Delete</button>
                    </div>
                </Card>
            ))}
        </div>
    );
}

const FavouritesList = () => {
    const { items: favouriteIds } = useSelector(state => state.favourites);
    const { items: products } = useSelector(state => state.products);

    const favouriteProducts = products.filter(p => favouriteIds.includes(p.id));

    if (favouriteIds.length === 0) {
        return (
            <div className="text-center py-10">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No favorites yet. Start adding some sweets!</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="font-bold text-xl mb-6">My Favorites</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favouriteProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['orders', 'addresses', 'details', 'favourites'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <p>Please log in to view your profile.</p>
                <Button onClick={() => navigate('/login')}>Login</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-1/3">
                        <Card className="p-6 text-center">
                            <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-maroon text-3xl font-bold">
                                {currentUser.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-serif font-bold">{currentUser.name}</h2>
                            <p className="text-gray-500 mb-6">{currentUser.email}</p>

                            <nav className="space-y-2 text-left">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <Package size={20} /> <span>My Orders</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('favourites')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'favourites' ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <Heart size={20} /> <span>Favorites</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <MapPin size={20} /> <span>Saved Addresses</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'details' ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <User size={20} /> <span>Account Details</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-4"
                                >
                                    <LogOut size={20} /> <span>Logout</span>
                                </button>
                            </nav>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'orders' && <OrderHistory />}
                            {activeTab === 'addresses' && <SavedAddresses />}
                            {activeTab === 'favourites' && <FavouritesList />}
                            {activeTab === 'details' && (
                                <AccountDetails isEmbedded={true} />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

