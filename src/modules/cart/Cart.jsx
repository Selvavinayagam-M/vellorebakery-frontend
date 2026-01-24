import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '../../shared/components/Button';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4"
        >
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-grow text-center sm:text-left">
                <h3 className="font-serif font-bold text-gray-900">{item.name}</h3>
                <p className="text-gray-500 text-sm">Unit Price: ₹{item.price}</p>
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))}
                    className="p-2 hover:bg-gray-50 text-gray-500"
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="p-2 hover:bg-gray-50 text-gray-500"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="font-bold text-brand-maroon w-20 text-right">
                ₹{item.price * item.quantity}
            </div>

            <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
                <Trash2 size={18} />
            </button>
        </motion.div>
    );
};

const Cart = () => {
    const { items, totalAmount, deliveryCharge } = useSelector((state) => state.cart);
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any sweets yet.</p>
                <Link to="/products">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold text-brand-black mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        <AnimatePresence mode='popLayout'>
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-serif font-bold text-xl mb-6">Order Summary</h3>

                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charge</span>
                                    <span className="text-green-600">{totalAmount > 1000 ? 'FREE' : `₹${deliveryCharge}`}</span>
                                </div>
                                {totalAmount <= 1000 && (
                                    <p className="text-xs text-blue-500 mt-1">Add ₹{1000 - totalAmount} more for free delivery.</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center font-bold text-lg text-brand-maroon">
                                    <span>Total</span>
                                    <span>₹{totalAmount + (totalAmount > 1000 ? 0 : deliveryCharge)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                            </div>

                            <Button
                                className="w-full flex items-center justify-center space-x-2"
                                onClick={() => navigate('/checkout')}
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={18} />
                            </Button>

                            <div className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center space-x-2">
                                <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Secure Payment</span>
                                <span>•</span>
                                <span>100% Authentic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
