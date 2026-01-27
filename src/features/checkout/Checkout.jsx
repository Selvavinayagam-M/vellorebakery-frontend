import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Truck, Smartphone, Building, Banknote } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { setShippingAddress, setStep, checkoutSuccess } from '../../features/checkout/checkoutSlice';
import { createOrderSuccess } from '../../features/orders/orderSlice';
import { clearCart } from '../../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { paymentService } from '../../services/payment.service';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const AddressForm = ({ onNext }) => {
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: ''
    });

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || prev.name,
                email: currentUser.email || prev.email,
                phone: currentUser.phone || prev.phone
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
                <Input id="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                <Input id="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
            </div>
            <Input id="street" label="Street Address" value={formData.street} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
                <Input id="city" label="City" value={formData.city} onChange={handleChange} required />
                <Input id="state" label="State" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input id="zip" label="PIN Code" value={formData.zip} onChange={handleChange} required />
                <Input id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full mt-4">Continue to Payment</Button>
        </form>
    );
};

const PaymentForm = ({ onPaymentSuccess, onBack, amount, userDetails }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');

    const handleRazorpayPayment = async () => {
        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // 1. Create Order
            const orderData = await paymentService.createOrder(amount);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Fallback for dev
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Vellore Sweets",
                description: "Order Payment",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        // 2. Verify Payment
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        onPaymentSuccess('ONLINE');
                    } catch (err) {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: userDetails.name,
                    email: userDetails.email,
                    contact: userDetails.phone
                },
                theme: {
                    color: "#6b2d2d" // Brand Mahogany
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Start Error:", error);
            alert("Could not initiate payment.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (paymentMethod === 'online') {
            await handleRazorpayPayment();
        } else {
            // COD
            setTimeout(() => {
                setLoading(false);
                onPaymentSuccess('COD');
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>

            <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-brand-maroon bg-brand-maroon/5' : 'hover:border-gray-300'}`}>
                    <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mr-3 accent-brand-maroon h-5 w-5"
                    />
                    <CreditCard className="mr-3 text-gray-600" size={20} />
                    <span className="font-medium">Online Payment (Card, UPI, Netbanking)</span>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-brand-maroon bg-brand-maroon/5' : 'hover:border-gray-300'}`}>
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mr-3 accent-brand-maroon h-5 w-5"
                    />
                    <Banknote className="mr-3 text-gray-600" size={20} />
                    <span className="font-medium">Cash on Delivery</span>
                </label>
            </div>

            <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1" type="button">Back</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                </Button>
            </div>
        </form>
    );
};

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { step, shippingAddress } = useSelector((state) => state.checkout);
    const { items, totalAmount } = useSelector((state) => state.cart);
    const settings = useSelector((state) => state.settings);

    // Calculate Delivery
    const deliveryCharge = settings.enableDelivery ? settings.deliveryCharge : 0;
    const isFreeDelivery = totalAmount > (settings.freeDeliveryThreshold || 1000);
    const finalAmount = totalAmount + (isFreeDelivery ? 0 : deliveryCharge);

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleAddressSubmit = (address) => {
        dispatch(setShippingAddress(address));
        dispatch(setStep(2));
    };

    const handlePaymentSuccess = async (paymentMethod) => {
        try {
            // Construct Payload
            const orderPayload = {
                items: items.map(item => ({
                    product: item.productId || item.id,
                    qty: item.quantity,
                    price: item.price,
                    name: item.name,
                    weight: item.selectedWeight || (item.name.includes('(') ? item.name.split('(')[1].replace(')', '') : '')
                })),
                totalAmount: finalAmount,
                paymentMode: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
                customer: {
                    name: shippingAddress.name,
                    email: shippingAddress.email,
                    phone: shippingAddress.phone,
                    address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}`
                }
            };

            // Call API
            const createdOrder = await ordersService.createOrder(orderPayload);
            console.log("Order Placed:", createdOrder);

            // Update Redux / UI
            dispatch(createOrderSuccess(createdOrder));
            dispatch(checkoutSuccess());
            dispatch(clearCart());
            navigate('/order-success');
        } catch (error) {
            console.error("Order Placement Failed:", error);
            alert("Failed to place order: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-serif font-bold text-center mb-10 text-brand-maroon">Checkout</h1>

                <div className="flex justify-between max-w-md mx-auto mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-0 -translate-y-1/2"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="relative z-10 bg-white px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-colors ${step >= s ? 'bg-brand-gold border-brand-gold text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                {step > s ? <CheckCircle size={20} /> : s}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Card className="p-6">
                            <AnimatePresence mode='wait'>
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <AddressForm onNext={handleAddressSubmit} />
                                    </motion.div>
                                )}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <PaymentForm
                                            onPaymentSuccess={handlePaymentSuccess}
                                            onBack={() => dispatch(setStep(1))}
                                            amount={finalAmount}
                                            userDetails={shippingAddress}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Order Summary</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                                <div className="flex justify-between">
                                    <span>Total Items</span>
                                    <span>{useSelector(state => state.cart.totalItems)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-bold">{isFreeDelivery ? 'FREE' : `₹${deliveryCharge}`}</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-brand-maroon">
                                <span>Total to Pay</span>
                                <span>₹{finalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
