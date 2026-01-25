import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterStatus, setSearchQuery, updateOrderStatus, fetchOrders } from '../../../store/adminOrdersSlice';
import { Search, Filter, Eye, X } from 'lucide-react';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { filteredOrders, filterStatus, searchQuery } = useSelector((state) => state.adminOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    React.useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();

            // Success Message (Only after DB save)
            // Using standard alert as requested/assumed, or simple console log if UI library missing
            // Ideally this would be a toast
            alert(`Order status updated to ${newStatus} successfully!`);

            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            alert('Failed to update order status. Please try again.');
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Orders Management</h1>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search order ID..."
                            className="w-full pl-10 pr-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mahogany focus:border-transparent outline-none text-sm md:text-base"
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        />
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 md:hidden" size={18} />
                        <select
                            className="w-full md:w-auto border border-gray-300 rounded-lg py-2.5 md:py-2 pl-10 md:pl-4 pr-4 focus:ring-2 focus:ring-brand-mahogany outline-none text-sm md:text-base bg-white appearance-none md:appearance-auto"
                            value={filterStatus}
                            onChange={(e) => dispatch(setFilterStatus(e.target.value))}
                        >
                            <option value="All">All Status</option>
                            <option value="PLACED">Placed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:overflow-hidden md:border md:border-gray-100">
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-100 md:border-0">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Order ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 whitespace-nowrap">Total</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.orderId}</td>
                                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.customer?.name || order.customer}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">{order.date}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">₹{order.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'PLACED' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {order.status?.replace(/_/g, ' ') || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-gray-400 hover:text-brand-mahogany transition-colors"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                                    <span className="font-bold text-gray-900">{order.orderId}</span>
                                    <span className="font-bold text-gray-900">₹{order.total}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {(order.customer?.name || (typeof order.customer === 'string' ? order.customer : '?')).charAt(0)}
                                        </div>
                                        {order.customer?.name || order.customer}
                                    </span>
                                    <span className="text-xs">{order.date}</span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'PLACED' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {order.status?.replace(/_/g, ' ') || order.status}
                                    </span>

                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all border border-gray-200"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                            No orders found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Drawer (Simple Modal) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                    <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Order ID</label>
                                <p className="text-lg font-bold text-gray-900">{selectedOrder.orderId}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</label>
                                    <p className="text-gray-700">{selectedOrder.date}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Items</label>
                                    <p className="text-gray-700">{selectedOrder.items} Items</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Customer</label>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="w-10 h-10 rounded-full bg-brand-turmeric/20 text-brand-mahogany flex items-center justify-center font-bold">
                                        {(selectedOrder.customer?.name || (typeof selectedOrder.customer === 'string' ? selectedOrder.customer : '?')).charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{selectedOrder.customer?.name || selectedOrder.customer}</p>
                                        <p className="text-sm text-gray-500">{selectedOrder.customer?.phone || ''}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Update Status</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedOrder.status === status
                                                ? 'bg-brand-mahogany text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{selectedOrder.total}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Tax (5%)</span>
                                    <span className="font-medium">₹{(selectedOrder.total * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Total Amount</span>
                                    <span className="font-bold text-xl text-brand-mahogany">₹{(selectedOrder.total * 1.05).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
