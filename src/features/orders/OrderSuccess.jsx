import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Check, Truck, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
    useEffect(() => {
        // Fire confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const { currentOrder } = useSelector((state) => state.orders);

    const isCOD = currentOrder?.paymentMode === 'COD';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <Check size={40} strokeWidth={3} />
                </div>

                <h1 className="text-3xl font-serif font-bold text-brand-black mb-4">
                    {isCOD ? "Order Confirmed" : "Payment Successful"}
                </h1>

                <p className="text-gray-500 mb-8">
                    {isCOD
                        ? "Your order has been placed successfully. Please pay cash on delivery."
                        : "Your payment was successful and your order has been placed."
                    }
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left border border-gray-100">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Order ID</span>
                        <span className="font-mono font-medium">#{currentOrder ? currentOrder.orderId : `VSS-${Math.floor(100000 + Math.random() * 900000)}`}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Order Date</span>
                        <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                    </div>

                    {!isCOD && (
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 text-sm">Total Amount Paid</span>
                            <span className="font-medium text-gray-800">₹{currentOrder?.totalAmount}</span>
                        </div>
                    )}

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Payment Method</span>
                        <span className="font-medium text-gray-800">
                            {isCOD ? "Cash on Delivery" : "Online Payment"}
                        </span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="font-medium text-green-600">Confirmed</span>
                    </div>

                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-500 text-sm">Estimated Delivery</span>
                        <span className="font-medium text-brand-maroon">2 Days</span>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <Link to="/profile">
                        <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                            <Truck size={18} />
                            <span>Track Order</span>
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button className="w-full flex items-center justify-center space-x-2">
                            <Home size={18} />
                            <span>Continue Shopping</span>
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;

