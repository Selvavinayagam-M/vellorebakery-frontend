import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash } from 'lucide-react';
import { addProduct, updateProduct } from '../../../store/adminProductsSlice';
import ProductImageUpload from './ProductImageUpload';
import { AdminPageHeader } from '../shared/AdminComponents';

const AddEditProduct = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.adminProducts);

    // Initial State
    const initialState = {
        name: '',
        category: 'sweets',
        description: '',
        ingredients: '',
        shelfLife: '',
        storageInstructions: '',
        variants: [{ weight: '250g', price: '' }],
        flags: {
            isFresh: false,
            isBestseller: false,
            isFestivalSpecial: false,
            isEggless: true,
            isSugarFree: false,
        },
        inStock: true,
        stockQuantity: 10,
    };

    const [formData, setFormData] = useState(initialState);
    const [images, setImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    // Load Data if Edit Mode
    useEffect(() => {
        if (isEditMode) {
            const product = items.find(p => p.id === id);
            if (product) {
                setFormData(product);
                // Handle image logic - ensuring array format
                const loadedImages = product.image ? [product.image, ...(product.additionalImages || [])] : [];
                setImages(loadedImages);
            } else {
                navigate('/admin/products');
            }
        }
    }, [id, isEditMode, items, navigate]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFlagChange = (flag) => {
        setFormData(prev => ({
            ...prev,
            flags: { ...prev.flags, [flag]: !prev.flags[flag] }
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({ ...prev, variants: [...prev.variants, { weight: '', price: '' }] }));
    };

    const removeVariant = (index) => {
        const newVariants = [...formData.variants];
        newVariants.splice(index, 1);
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || formData.variants.some(v => !v.price)) {
            alert('Please fill in required fields');
            return;
        }

        try {
            // Upload Main Image to Cloudinary if it's a File
            let imageUrl = formData.image;
            let imagePublicId = formData.imagePublicId;

            const currentMainImage = images[primaryImageIndex];

            // Helper to check if we need to upload
            const needsUpload = (currentMainImage instanceof File) || (typeof currentMainImage === 'object' && currentMainImage?.file);

            if (needsUpload) {
                const { uploadToCloudinary } = await import('../../../shared/services/cloudinary.service');
                const fileToUpload = currentMainImage instanceof File ? currentMainImage : currentMainImage.file;

                const result = await uploadToCloudinary(fileToUpload, formData.name);
                imageUrl = result.url;
                imagePublicId = result.publicId;
            } else if (typeof currentMainImage === 'string') {
                imageUrl = currentMainImage;
                // keep existing imagePublicId
            }

            // Prepare Payload
            // Backend expects flat structure: price, weight, stock
            const primaryVariant = formData.variants[0] || { price: 0, weight: 'N/A' };

            const payload = {
                ...formData,
                price: parseFloat(primaryVariant.price),
                weight: primaryVariant.weight,
                stock: parseInt(formData.stockQuantity),
                image: imageUrl,
                imagePublicId: imagePublicId,
                // We are not handling additionalImages upload in this snippet for brevity
                additionalImages: [],
            };

            const action = isEditMode ? updateProduct(payload) : addProduct(payload);

            dispatch(action)
                .unwrap()
                .then(() => {
                    navigate('/admin/products');
                })
                .catch((error) => {
                    console.error("Failed to save product", error);
                    alert("Failed to save product: " + (error.message || error));
                });
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product: " + error.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <AdminPageHeader
                title={isEditMode ? "Edit Product" : "Add New Product"}
                description={isEditMode ? `Editing: ${formData.name}` : "Create a new item for your menu."}
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Details Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Basic Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Mysore Pak"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric"
                                >
                                    <option value="sweets">Sweets</option>
                                    <option value="snacks">Snacks</option>
                                    <option value="bakery">Bakery</option>
                                    <option value="savouries">Savouries</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                                <input
                                    type="text"
                                    name="shelfLife"
                                    value={formData.shelfLife}
                                    onChange={handleChange}
                                    placeholder="e.g. 5 Days"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric h-24"
                                    placeholder="Describe the product..."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleChange}
                                    placeholder="e.g. Ghee, Sugar, Flour..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Product Images</h3>
                        <ProductImageUpload
                            images={images}
                            setImages={setImages}
                            primaryImageIndex={primaryImageIndex}
                            setPrimaryImageIndex={setPrimaryImageIndex}
                        />
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                            <h3 className="font-bold text-gray-800">Weights & Pricing</h3>
                            <button type="button" onClick={addVariant} className="text-sm text-brand-mahogany font-medium flex items-center gap-1 hover:underline">
                                <Plus size={14} /> Add Variant
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.variants.map((variant, index) => (
                                <div key={index} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Weight / Size</label>
                                        <input
                                            type="text"
                                            value={variant.weight}
                                            onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                            placeholder="e.g. 500g"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                    {formData.variants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-[1px]"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Status & Visibility</h3>

                        <div className="space-y-4">
                            {/* Stock Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">In Stock</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, inStock: !prev.inStock }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.inStock ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {formData.inStock && (
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                        name="stockQuantity"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    />
                                </div>
                            )}

                            <hr className="border-gray-100" />

                            {/* Flags */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.flags.isFresh}
                                        onChange={() => handleFlagChange('isFresh')}
                                        className="rounded text-brand-mahogany focus:ring-brand-mahogany"
                                    />
                                    <span className="text-sm text-gray-700">Fresh Today</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.flags.isBestseller}
                                        onChange={() => handleFlagChange('isBestseller')}
                                        className="rounded text-brand-mahogany focus:ring-brand-mahogany"
                                    />
                                    <span className="text-sm text-gray-700">Bestseller</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.flags.isFestivalSpecial}
                                        onChange={() => handleFlagChange('isFestivalSpecial')}
                                        className="rounded text-brand-mahogany focus:ring-brand-mahogany"
                                    />
                                    <span className="text-sm text-gray-700">Festival Special</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.flags.isEggless}
                                        onChange={() => handleFlagChange('isEggless')}
                                        className="rounded text-brand-mahogany focus:ring-brand-mahogany"
                                    />
                                    <span className="text-sm text-gray-700">Eggless</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.flags.isSugarFree}
                                        onChange={() => handleFlagChange('isSugarFree')}
                                        className="rounded text-brand-mahogany focus:ring-brand-mahogany"
                                    />
                                    <span className="text-sm text-gray-700">Sugar Free</span>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-brand-mahogany text-white rounded-lg font-medium hover:bg-brand-jaggery transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {isEditMode ? 'Update Product' : 'Save Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="w-full py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEditProduct;
