import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ordersService } from './service/orders.service';
import Button from '@/shared/components/Button';

const TrackOrderPage = () => {
    const [searchParams] = useSearchParams();
    const queryOrderId = searchParams.get('orderId');

    const [orderId, setOrderId] = useState(queryOrderId || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const steps = [
        { status: 'PLACED', label: 'Order Placed', icon: Clock },
        { status: 'PREPARING', label: 'Preparing', icon: Package },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
    ];

    const getStepStatus = (stepStatus, currentStatus) => {
        const statusOrder = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

        // Map old/compatibility statuses if needed
        let normalizedStatus = currentStatus;
        if (currentStatus === 'Pending') normalizedStatus = 'PLACED';
        if (currentStatus === 'Preparing') normalizedStatus = 'PREPARING';
        if (currentStatus === 'Out for Delivery') normalizedStatus = 'OUT_FOR_DELIVERY';
        if (currentStatus === 'Delivered') normalizedStatus = 'DELIVERED';
        if (currentStatus === 'Cancelled') normalizedStatus = 'CANCELLED';

        const currentIndex = statusOrder.indexOf(normalizedStatus);
        const stepIndex = statusOrder.indexOf(stepStatus);

        if (normalizedStatus === 'CANCELLED') return 'error';
        if (currentIndex >= stepIndex) return 'completed';
        return 'pending';
    };

    const handleTrack = async (e) => {
        e?.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const data = await ordersService.trackOrder(orderId.trim());
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval;

        if (queryOrderId) {
            handleTrack(); // Initial fetch

            // Auto Polling Logic
            interval = setInterval(() => {
                if (order && (order.status === 'DELIVERED' || order.status === 'CANCELLED')) {
                    clearInterval(interval);
                    return;
                }
                handleTrack();
            }, 10000); // Poll every 10 seconds
        }

        return () => clearInterval(interval);
    }, [queryOrderId]);

    return (
        <div className="min-h-screen bg-brand-cream/20 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold text-brand-mahogany mb-4">Track Your Order</h1>
                    <p className="text-gray-500">Enter your Order ID to see the current status of your delicious treats.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                placeholder="Enter Order ID (e.g., ORD-1234)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <Button type="submit" disabled={loading} className="md:w-32">
                            {loading ? 'Tracking...' : 'Track'}
                        </Button>
                    </form>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}
                </div>

                {/* Order Details */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        {/* Status Header */}
                        <div className="p-6 bg-brand-mahogany text-brand-cream flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <p className="text-brand-cream/60 text-sm">Order ID</p>
                                <p className="text-xl font-bold">{order.orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-brand-cream/60 text-sm">Estimated Delivery</p>
                                <p className="font-bold">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Auto Update Message */}
                        <div className="bg-blue-50 text-blue-700 text-center py-2 text-xs font-semibold flex items-center justify-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" /></svg>
                            </motion.div>
                            Live Updates: Status refreshes automatically every 10s
                        </div>

                        {/* Status Stepper */}
                        <div className="p-8 border-b border-gray-100">
                            <div className="relative flex justify-between">
                                {/* Connection Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                                    style={{
                                        width: `${order.status === 'Cancelled' ? 0 :
                                            (Math.max(0, steps.findIndex(s => s.status === order.status)) / (steps.length - 1)) * 100}%`
                                    }}
                                ></div>

                                {steps.map((step, index) => {
                                    const status = getStepStatus(step.status, order.status);
                                    const Icon = step.icon;

                                    return (
                                        <div key={index} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-white
                                                ${status === 'completed' ? 'border-green-500 text-green-500' :
                                                    status === 'pending' ? 'border-gray-200 text-gray-300' : 'border-brand-gold text-brand-gold'}`
                                            }>
                                                <Icon size={18} />
                                            </div>
                                            <p className={`mt-3 text-xs md:text-sm font-medium ${status === 'completed' ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            {order.status === 'Cancelled' && (
                                <div className="mt-6 text-center text-red-600 font-bold bg-red-50 p-2 rounded-lg">
                                    This order has been cancelled.
                                </div>
                            )}
                        </div>

                        {/* Order Timeline */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-serif font-bold text-lg mb-4 text-gray-800">Order Timeline</h3>
                                <div className="space-y-4 border-l-2 border-brand-gold/30 ml-2 pl-6 relative">
                                    {order.statusHistory.map((history, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-brand-gold border-2 border-white shadow-sm"></div>
                                            <p className="font-bold text-gray-800 text-sm">
                                                {history.status.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(history.date).toLocaleString()}
                                            </p>
                                            {history.note && <p className="text-xs text-gray-400 mt-1 italic">{history.note}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="p-6">
                            <h3 className="font-serif font-bold text-lg mb-4 text-gray-800">Order Summary</h3>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">₹{item.price * item.qty}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                <span className="text-gray-500">Total Amount</span>
                                <span className="text-2xl font-bold text-brand-mahogany">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
