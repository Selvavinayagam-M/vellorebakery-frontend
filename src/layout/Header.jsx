import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, ShoppingBag, LogOut, User, Menu, X, ChevronDown, MapPin, Phone, Instagram, Facebook, Search, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleCart } from '../features/ui/uiSlice';
import { logout } from '../features/auth/userSlice';
import MegaMenu from '../components/MegaMenu';
import { LOGO_IMAGES } from '../assets/images';
const logoImg = LOGO_IMAGES.main;

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const { totalItems } = useSelector((state) => state.cart);
    const { currentUser } = useSelector((state) => state.user);
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveMegaMenu(null);
        setShowMobileSearch(false);
        setUserMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setShowMobileSearch(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Sweets', path: '/sweets', category: 'sweets' },
        { name: 'Snacks', path: '/snacks', category: 'snacks' },
        { name: 'Bakery', path: '/bakery', category: 'bakery' },
        { name: 'Gifting', path: '/gifting', category: 'gifting' },
    ];

    // Check if we are on the home page
    const isHome = location.pathname === '/';
    const useSolidHeader = !isHome || isScrolled;

    // Dynamic classes based on scroll state or page
    const headerClasses = useSolidHeader
        ? "bg-white/95 backdrop-blur-md shadow-md py-2"
        : "bg-gradient-to-b from-black/80 to-transparent py-4";

    const textColorClass = useSolidHeader ? "text-brand-turmeric" : "text-white";
    const topBarClass = useSolidHeader ? "bg-brand-mahogany text-brand-turmeric" : "bg-transparent text-brand-turmeric/90";
    const navLinkClass = useSolidHeader
        ? "text-gray-600 hover:text-brand-mahogany hover:border-brand-turmeric"
        : "text-white/90 hover:text-white hover:border-brand-turmeric";
    const ctaClass = useSolidHeader
        ? "bg-brand-mahogany text-brand-turmeric hover:bg-brand-jaggery"
        : "bg-brand-turmeric text-brand-mahogany hover:bg-white";

    // Logo Filter/Class
    const logoClass = useSolidHeader
        ? "h-28"
        : "h-40 drop-shadow-lg";

    const searchIconClass = useSolidHeader ? "text-gray-400" : "text-white/70";
    const searchInputClass = useSolidHeader
        ? "bg-gray-100 border-transparent text-gray-800 focus:bg-white focus:ring-1 focus:ring-brand-turmeric"
        : "bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 border";

    const userIconClass = useSolidHeader
        ? "bg-white text-brand-mahogany border-brand-turmeric" // Scrolled: White bg, Brown icon, Gold border
        : "bg-white/10 text-white border-brand-turmeric"; // Default: Glass bg, White icon, Gold border

    return (
        <>
            {/* Header Fixed Wrapper */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'scrolled' : ''}`}>
                {/* 1. TOP BAR (Utility Layer) */}
                <div className={`hidden md:flex h-[40px] px-4 items-center text-xs font-medium transition-colors duration-500 relative z-[60] ${topBarClass}`}>
                    <div className="container mx-auto flex items-center h-full relative">
                        {/* Left: Location/Contact */}
                        <div className="flex items-center space-x-6">
                            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 cursor-default">
                                <MapPin size={12} /> {settings.city || 'Vellore'} & Surroundings
                            </span>
                            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 cursor-default">
                                <Phone size={12} /> {settings.contactPhone}
                            </span>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center space-x-6 ml-auto relative z-[100]">
                            <div className="relative z-[101] pointer-events-auto">
                                <Link to="/track-order" className="hover:opacity-100 transition-opacity opacity-90 cursor-pointer font-bold block py-1">Track Order</Link>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex items-center gap-4">
                                <Link to="/profile?tab=favourites" className="flex items-center gap-1.5 hover:scale-105 transition-transform group">
                                    <Heart size={14} />
                                    <span>Wishlist</span>
                                </Link>

                                {currentUser ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center gap-1.5 focus:outline-none hover:text-brand-mahogany transition-colors"
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${userIconClass}`}>
                                                <User size={16} />
                                            </div>
                                            <span className={`text-sm font-bold ${textColorClass}`}>{currentUser?.name?.split(' ')[0]}</span>
                                            <ChevronDown size={14} className={textColorClass} />
                                        </button>

                                        <AnimatePresence>
                                            {userMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                        <p className="text-sm font-bold text-gray-800 truncate">{currentUser?.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                                                    </div>

                                                    {['admin', 'superadmin'].includes(currentUser?.role) ? (
                                                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mahogany transition-colors">
                                                            <User size={16} /> Dashboard
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mahogany transition-colors">
                                                                <User size={16} /> My Account
                                                            </Link>
                                                            <Link to="/profile?tab=orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mahogany transition-colors">
                                                                <ShoppingBag size={16} /> My Orders
                                                            </Link>
                                                        </>
                                                    )}

                                                    <div className="h-px bg-gray-100 my-1"></div>
                                                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                                        <LogOut size={16} /> Logout
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link to="/login" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current hover:bg-white/10 ${textColorClass}`}>
                                        <span className="font-bold text-sm">Login</span>
                                    </Link>
                                )}
                                <button
                                    onClick={() => dispatch(toggleCart())}
                                    className="flex items-center gap-1.5 hover:scale-105 transition-transform group ml-2"
                                >
                                    <div className="relative">
                                        <ShoppingCart size={14} />
                                        {totalItems > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-brand-turmeric text-black text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full shadow-sm">
                                                {totalItems}
                                            </span>
                                        )}
                                    </div>
                                    <span>Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN HEADER (Sticky/Transparent) */}
                <nav
                    className={`w-full transition-all duration-500 relative ${useSolidHeader ? 'border-b border-transparent' : 'border-none'} ${headerClasses}`}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                >
                    {/* 
                        Mobile: Grid Layout (3 columns) for perfect center alignment 
                        Desktop: Flex Layout for standard row
                    */}
                    <div className="container mx-auto px-4 grid grid-cols-3 items-center md:flex md:items-start md:justify-between">

                        {/* Mobile Menu Button - Column 1 (Left) */}
                        <div className="md:hidden justify-self-start">
                            <button
                                className={`p-1 ${textColorClass}`}
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                        </div>

                        {/* Logo - Column 2 (Center on Mobile, Left on Desktop) */}
                        <div className="justify-self-center md:justify-self-start">
                            <Link to="/" className="flex flex-col justify-center relative z-20">
                                {/* 
                                    Logo Container Sizing:
<<<<<<< HEAD
                                    Mobile: h-12 to h-16
                                    Tablet: h-10 to h-12 (controlled via img sizing mostly, wrapper constrains pos)
                                    Desktop: h-10
                                */}
                                <div className={`transition-all duration-500 relative ${useSolidHeader ? 'w-16 md:w-24 lg:w-24 h-12 md:h-10' : 'w-24 md:w-28 lg:w-36 h-16 md:h-10'}`}>
                                    <img
                                        src={logoImg}
                                        alt="Vellore Sweets Logo"
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-0 md:translate-x-0 md:translate-y-0 max-w-none transition-all duration-500 object-contain ${useSolidHeader ? 'h-16 md:h-24 lg:h-28' : 'h-20 md:h-28 lg:h-40 drop-shadow-lg'}`}
=======
                                    Mobile: h-12 to h-16 (smaller to fit)
                                    Desktop: h-10 (existing placeholder logic preserved or adjusted if needed, utilizing absolute positioning)
                                */}
                                <div className={`transition-all duration-500 relative ${useSolidHeader ? 'w-16 md:w-24 h-12 md:h-10' : 'w-24 md:w-36 h-16 md:h-10'}`}>
                                    <img
                                        src={logoImg}
                                        alt="Vellore Sweets Logo"
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-0 md:translate-x-0 md:translate-y-0 max-w-none transition-all duration-500 object-contain ${useSolidHeader ? 'h-16 md:h-28' : 'h-20 md:h-40 drop-shadow-lg'}`}
>>>>>>> 63c95fa90c53ffc457388675af0d65e5476b0090
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* CENTER: Navigation (Desktop Only) */}
                        <div className="hidden md:flex items-center space-x-1 pt-3 relative z-50">
                            <Link
                                to="/"
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-full transition-all ${location.pathname === '/' ? (useSolidHeader ? 'text-brand-mahogany bg-brand-turmeric/10' : 'text-white bg-white/20 backdrop-blur-sm') : navLinkClass}`}
                            >
                                Home
                            </Link>
                            {navLinks.map((link) => {
                                const isActive = location.pathname.startsWith(link.path);
                                return (
                                    <div key={link.name} className="relative" onMouseEnter={() => setActiveMegaMenu(link.category)}>
                                        <Link
                                            to={link.path}
<<<<<<< HEAD
                                            className={`px-2 lg:px-4 py-2 text-xs lg:text-sm font-bold uppercase tracking-wide rounded-full transition-all flex items-center gap-1 ${isActive || activeMegaMenu === link.category ? (useSolidHeader ? 'text-brand-mahogany bg-brand-turmeric/10' : 'text-white bg-white/20 backdrop-blur-sm') : navLinkClass}`}
=======
                                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-full transition-all flex items-center gap-1 ${isActive || activeMegaMenu === link.category ? (useSolidHeader ? 'text-brand-mahogany bg-brand-turmeric/10' : 'text-white bg-white/20 backdrop-blur-sm') : navLinkClass}`}
>>>>>>> 63c95fa90c53ffc457388675af0d65e5476b0090
                                        >
                                            {link.name} {link.name !== 'Gifting' && <ChevronDown size={14} strokeWidth={2} />}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT: Search (Desktop) & CTA / Mobile Icons - Column 3 (Right) */}
                        <div className="justify-self-end flex items-center gap-4 md:pt-3">
<<<<<<< HEAD
                            {/* Desktop Search - Hidden on Tablet (md), Visible on Desktop (lg) */}
                            <div className="hidden md:flex md:w-32 lg:w-56">
=======
                            {/* Desktop Search */}
                            <div className="hidden md:flex w-56">
>>>>>>> 63c95fa90c53ffc457388675af0d65e5476b0090
                                <div className="relative group w-full">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchIconClass}`} size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className={`w-full pl-9 pr-4 py-2 rounded-full text-sm focus:outline-none transition-all placeholder-current ${searchInputClass}`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

<<<<<<< HEAD
                            {/* Mobile/Tablet Icons - Hidden on Tablet (md) now that search bar is visible */}
=======
                            {/* Mobile Icons */}
>>>>>>> 63c95fa90c53ffc457388675af0d65e5476b0090
                            <div className={`flex md:hidden items-center gap-3 ${textColorClass}`}>
                                <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
                                    <Search size={22} />
                                </button>
                                <button onClick={() => dispatch(toggleCart())} className="relative">
                                    <ShoppingCart size={22} />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-brand-turmeric text-black text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar Expansion */}
                    <AnimatePresence>
                        {showMobileSearch && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-white px-4 pb-4 md:hidden border-b border-gray-100 overflow-hidden"
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search..."
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-turmeric"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-brand-turmeric rounded-full text-white" onClick={handleSearch}>
                                        <Search size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <MegaMenu
                        isOpen={!!activeMegaMenu}
                        activeCategory={activeMegaMenu}
                        onClose={() => setActiveMegaMenu(null)}
                    />
                </nav>
            </header>

            {/* Mobile Sidebar Menu (Offcanvas) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            {/* Mobile Menu Header */}
                            <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-brand-mahogany text-brand-turmeric">
                                <div>
                                    <h2 className="font-serif font-bold text-xl tracking-wide text-brand-turmeric">Explore</h2>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-brand-turmeric/80 hover:text-brand-turmeric">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Links */}
                            <div className="flex-grow overflow-y-auto py-4">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-sm font-bold text-gray-800 border-l-4 border-brand-turmeric bg-brand-turmeric/5">HOME</Link>

                                <div className="mt-4 mb-2 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Shop By Category</div>
                                {navLinks.map(link => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-6 py-3 text-sm font-medium text-gray-600 hover:text-brand-mahogany hover:bg-gray-50 flex justify-between items-center group"
                                    >
                                        {link.name}
                                        <ChevronDown size={14} className="-rotate-90 text-gray-300 group-hover:text-brand-turmeric transition-colors" />
                                    </Link>
                                ))}

                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <Link to="/track-order" className="block px-6 py-3 text-sm text-gray-600 hover:text-brand-mahogany">Track Order</Link>
                                    <Link to="/help" className="block px-6 py-3 text-sm text-gray-600 hover:text-brand-mahogany">Help & Support</Link>
                                </div>
                            </div>

                            {/* Mobile Bottom User Info */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                {currentUser ? (
                                    <div className="space-y-3">
                                        <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" onClick={() => setMobileMenuOpen(false)}>
                                            <div className="w-10 h-10 rounded-full bg-brand-turmeric text-brand-mahogany flex items-center justify-center font-bold">
                                                {currentUser?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{currentUser?.name || 'My Account'}</p>
                                                <p className="text-xs text-gray-500">View orders & profile</p>
                                            </div>
                                        </Link>
                                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-sm font-bold shadow-sm">
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" onClick={() => setMobileMenuOpen(false)}>
                                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Login / Signup</p>
                                            <p className="text-xs text-gray-500">Access your account</p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Layout Spacer for Fixed Header (Non-Home Only) */}
            {!isHome && (
                <div className="h-[72px] md:h-[112px] bg-white w-full"></div>
            )}
        </>
    );
};

export default Header;

