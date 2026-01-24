import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleCart } from '../../store/uiSlice';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import Button from './Button';

const CartSidebar = () => {
    const { isCartOpen } = useSelector((state) => state.ui);
    const { items, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(toggleCart());
    };

    const handleCheckout = () => {
        handleClose();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-brand-coconut">
                            <h2 className="text-xl font-serif font-bold text-brand-mahogany flex items-center gap-2">
                                <ShoppingBag size={20} /> Your Cart ({items.length})
                            </h2>
                            <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                    <ShoppingBag size={48} className="text-gray-300 mb-4" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm mb-6">Looks like you haven't added any sweets yet.</p>
                                    <Button onClick={handleClose} variant="outline">Start Shopping</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm relative group">
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-serif font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mb-2">₹{item.price} x {item.quantity}</p>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-200 rounded-lg h-8">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-bold text-brand-mahogany ml-auto">₹{item.price * item.quantity}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-5 border-t border-gray-100 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-2xl font-bold text-brand-maroon">₹{totalAmount}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4 text-center">Shipping & taxes calculated at checkout</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={() => { handleClose(); navigate('/cart'); }} variant="outline" className="w-full">
                                        View Cart
                                    </Button>
                                    <Button onClick={handleCheckout} className="w-full">
                                        Checkout <ArrowRight size={16} className="ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
