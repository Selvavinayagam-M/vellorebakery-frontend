import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Zap } from 'lucide-react';
import Button from '../../shared/components/Button';
import { addToCart } from '../../store/cartSlice';
import { showToast } from '../../store/uiSlice';
import { fetchProductById, clearProductDetails } from '../../store/productDetailsSlice';
import CloudinaryImage from '../../shared/components/CloudinaryImage';
import { COMBO_IMAGES } from '../../assets/images';
const fallbackImage = COMBO_IMAGES.familyTeaTime;

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentProduct: product, loading, error } = useSelector((state) => state.productDetails);

    const [quantity, setQuantity] = useState(1);
    const [selectedWeight, setSelectedWeight] = useState('500g');
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
        return () => {
            dispatch(clearProductDetails());
        };
    }, [id, dispatch]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    // Mock weights and price multipliers
    const weights = [
        { label: '250g', multiplier: 0.5 },
        { label: '500g', multiplier: 1 },
        { label: '1kg', multiplier: 1.9 } // slight discount on 1kg
    ];

    const currentPrice = Math.round(product.price * (weights.find(w => w.label === selectedWeight)?.multiplier || 1));

    const handleAddToCart = () => {
        dispatch(addToCart({
            ...product,
            id: `${product.id}-${selectedWeight}`, // unique id for variant
            name: `${product.name} (${selectedWeight})`,
            price: currentPrice,
            quantity
        }));
        dispatch(showToast({ message: `Added ${quantity} ${product.name} (${selectedWeight}) to cart` }));
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="container mx-auto px-4 py-8">
                <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-brand-maroon mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Products
                </Link>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Image Gallery */}
                    <div className="lg:w-1/2">
                        <div className="mb-4 rounded-2xl overflow-hidden shadow-lg h-[500px] relative bg-gray-50">
                            <CloudinaryImage
                                publicId={product.imagePublicId || 'laddu_sample'}
                                url={product.image || fallbackImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                width={800}
                                height={800}
                            />
                        </div>
                        {/* Thumbnails (Mock same image for now) */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[0, 1, 2].map((idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-maroon ring-2 ring-brand-maroon/20' : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <CloudinaryImage
                                        publicId={product.imagePublicId || 'laddu_sample'}
                                        url={product.image || fallbackImage}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        width={100}
                                        height={100}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2">
                        <span className="text-brand-gold font-bold tracking-wider text-sm uppercase mb-2 block">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-black mb-4">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full text-green-700 font-bold border border-green-200">
                                <span>{product.rating}</span>
                                <Star size={14} className="ml-1 fill-current" />
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500 text-sm">154 Reviews</span>
                        </div>

                        <div className="text-3xl font-bold text-brand-maroon mb-6">
                            ₹{currentPrice} <span className="text-lg text-gray-400 font-normal ml-2">/ {selectedWeight}</span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {product.description} Prepared using traditional recipes handed down through generations, ensuring you get the authentic taste of Vellore in every bite.
                        </p>

                        {/* Weight Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Weight</label>
                            <div className="flex flex-wrap gap-3">
                                {weights.map((w) => (
                                    <button
                                        key={w.label}
                                        onClick={() => setSelectedWeight(w.label)}
                                        className={`px-6 py-2 rounded-lg border font-medium transition-all ${selectedWeight === w.label
                                            ? 'bg-brand-maroon text-white border-brand-maroon shadow-md'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-maroon/50'
                                            }`}
                                    >
                                        {w.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <Truck size={20} className="text-brand-gold" />
                                <span className='text-black'>Fast Delivery</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <ShieldCheck size={20} className="text-brand-gold" />
                                <span className='text-black'>Quality Assured</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-gray-100 text-gray-600"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-medium text-lg text-black">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-gray-100 text-gray-600"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <Button
                                size="lg"
                                className="flex-grow flex items-center justify-center space-x-2"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag size={20} />
                                <span>Add to Cart</span>
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="flex-grow flex items-center justify-center space-x-2 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
                                onClick={() => {
                                    handleAddToCart();
                                    navigate('/checkout');
                                }}
                            >
                                <Zap size={20} />
                                <span>Buy Now</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
