import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { loginUser, registerUser } from '../../store/userSlice';
import { showToast } from '../../store/uiSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { items } = useSelector((state) => state.cart);
    const { currentUser, loading, error } = useSelector((state) => state.user);

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [currentUser, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const action = isLogin
            ? loginUser({ email, password: password || 'password123' })
            : registerUser({ name, email, password });

        dispatch(action)
            .unwrap()
            .then((userInfo) => {
                dispatch(showToast({ message: isLogin ? `Welcome back, ${userInfo.name}!` : `Welcome to Vellore Sweets, ${userInfo.name}!` }));

                // Smart Redirection Logic
                let destination = '/'; // Default

                if (userInfo.role === 'admin') {
                    destination = '/admin/dashboard';
                } else if (location.state?.from?.pathname) {
                    destination = location.state.from.pathname;
                } else if (items.length > 0) {
                    // Check if cart has items -> go to checkout/cart
                    destination = '/cart';
                }

                navigate(destination, { replace: true });
            })
            .catch((err) => {
                dispatch(showToast({ message: err || (isLogin ? 'Login failed' : 'Registration failed'), type: 'error' }));
            });
    };

    return (
        <div className="min-h-screen bg-brand-maroon/5 flex items-center justify-center p-4">
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
                <div className="bg-brand-maroon p-6 text-center text-white">
                    <h2 className="text-3xl font-serif font-bold mb-2">Vellore Sweets</h2>
                    <p className="text-brand-gold opacity-90">Experience the Royal Taste</p>
                </div>

                <div className="p-8">
                    <div className="flex justify-center space-x-6 mb-8 border-b">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`pb-2 text-lg font-medium transition-colors ${isLogin ? 'text-brand-maroon border-b-2 border-brand-maroon' : 'text-gray-400'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`pb-2 text-lg font-medium transition-colors ${!isLogin ? 'text-brand-maroon border-b-2 border-brand-maroon' : 'text-gray-400'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode='popLayout'>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Input
                                        id="name"
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mb-4"
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {isLogin && (
                            <div className="text-right">
                                <a href="#" className="text-sm text-brand-maroon hover:underline">Forgot Password?</a>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="primary" className="w-full mt-6" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {isLogin ? 'Logging in...' : 'Creating Account...'}
                                </span>
                            ) : (
                                isLogin ? 'Login' : 'Create Account'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        By continuing, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
