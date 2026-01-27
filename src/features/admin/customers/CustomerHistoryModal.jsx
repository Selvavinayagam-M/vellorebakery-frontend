import React from 'react';
import { X, Package, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerHistoryModal = ({ isOpen, onClose, orders, loading, customerName }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-serif font-bold text-gray-800">Order History</h2>
                            <p className="text-sm text-gray-500">For {customerName}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <span className="w-8 h-8 border-4 border-brand-maroon border-t-transparent rounded-full animate-spin"></span>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id || order.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-brand-maroon block">{order.orderId}</span>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <Calendar size={12} className="mr-1" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-brand-gold/20 text-brand-mahogany'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            {order.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium pt-2 border-t border-dashed border-gray-100">
                                            <span>Total: ₹{order.totalAmount}</span>
                                            <span className="text-gray-400">{order.paymentMode}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p>No orders found for this customer.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CustomerHistoryModal;
