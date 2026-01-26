import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash } from 'lucide-react';
import { addProduct, updateProduct } from './adminProductsSlice';
import { uploadToCloudinary } from '../../../services/cloudinary.service';
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
        subCategory: '',
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
        isGift: false,
    };

    const [formData, setFormData] = useState(initialState);
    const [images, setImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    // Load Data if Edit Mode
    useEffect(() => {
        if (isEditMode) {
            const product = items.find(p => (p.id === id) || (p._id === id));
            if (product) {
                // Manually construct form data because backend model is different from form state
                setFormData({
                    ...initialState, // Keep initial structure safe
                    ...product, // Overwrite with product data
                    // Propagate subCategory safely (backend might return subCategory or subcategory)
                    subCategory: product.subCategory || product.subcategory || '',
                    // Ensure variants exist. Backend is flat (price, weight), Frontend form uses variants array.
                    variants: product.variants || [{
                        weight: product.weight || '',
                        price: product.price || ''
                    }],
                    // Map stock to stockQuantity if needed
                    stockQuantity: product.stock || 0,
                    // Map inStock from isActive
                    inStock: product.isActive !== undefined ? product.isActive : true,
                    // Ensure flags exist or default
                    flags: { ...initialState.flags, ...product.flags },
                    isGift: product.isGift || false
                });

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
            // Prepare FormData (actually we should favor JSON now, but legacy code uses FormData wrapper)
            // Let's stick to FormData payload construction but with URL strings inside.
            const formDataPayload = new FormData();

            // Backend expects flat structure: price, weight, stock
            const primaryVariant = formData.variants[0] || { price: 0, weight: 'N/A' };

            formDataPayload.append('name', formData.name);
            formDataPayload.append('category', formData.category);

            // Ensure subCategory is sent, fallback to existing if missing in state but present in original
            const finalSubCategory = formData.subCategory || (isEditMode ? items.find(p => p.id === id || p._id === id)?.subCategory : '');
            if (!finalSubCategory) {
                alert("Please select a Sub Category");
                return;
            }
            formDataPayload.append('subCategory', finalSubCategory);

            formDataPayload.append('description', formData.description);
            formDataPayload.append('ingredients', formData.ingredients);
            formDataPayload.append('shelfLife', formData.shelfLife);
            // Append variants as JSON string if backend doesn't support array in FormData easily or if we only use flat fields
            formDataPayload.append('price', primaryVariant.price);
            formDataPayload.append('weight', primaryVariant.weight);
            // Default to 0 if empty string to avoid 400
            formDataPayload.append('stock', formData.stockQuantity === '' ? 0 : formData.stockQuantity);

            // Send flags as JSON string
            formDataPayload.append('flags', JSON.stringify(formData.flags));
            formDataPayload.append('isActive', formData.inStock);
            formDataPayload.append('isGift', formData.isGift);

            // IMAGE HANDLING LOGIC
            const currentMainImage = images[primaryImageIndex];
            let imageUrl = '';
            let imagePublicId = '';

            
            // 1. Check if it is a File (New Upload Needed)
            if (currentMainImage instanceof File) {
                // Upload to Cloudinary First
                console.log('Uploading image to Cloudinary...');
                const uploaded = await uploadToCloudinary(currentMainImage, formData.name);
                imageUrl = uploaded.url;
                imagePublicId = uploaded.publicId;

            } else if (currentMainImage?.file instanceof File) {
                // Handle nested file structure if any dropzone lib creates it
                const uploaded = await uploadToCloudinary(currentMainImage.file, formData.name);
                imageUrl = uploaded.url;
                imagePublicId = uploaded.publicId;
            } else if (typeof currentMainImage === 'string') {
                // Existing URL
                imageUrl = currentMainImage;
                imagePublicId = formData.imagePublicId || ''; // Keep existing if available
            } else if (currentMainImage?.preview) {
                // Blob preview but actual file might be lost? 
                // If using react-dropzone, the object IS the file with a preview property.
                if (currentMainImage instanceof File) {
                    const uploaded = await uploadToCloudinary(currentMainImage, formData.name);
                    imageUrl = uploaded.url;
                    imagePublicId = uploaded.publicId;
                }
            }

            // Append URL string, NOT File object
            if (imageUrl) {
                // Use 'imageUrl' to avoid Multer conflict with 'image' file field
                formDataPayload.append('imageUrl', imageUrl);
                if (imagePublicId) {
                    formDataPayload.append('imagePublicId', imagePublicId);
                }
            } else {
                alert("Please select an image");
                return;
            }

            if (isEditMode) {
                if (!id) {
                    alert("Error: Product ID is missing");
                    return;
                }
                console.log("Updating product with ID:", id);
                formDataPayload.append('id', id);
            }

            const action = isEditMode
                ? updateProduct({ id, data: formDataPayload })
                : addProduct(formDataPayload);

            dispatch(action)
                .unwrap()
                .then(() => {
                    if (location.state?.from === 'inventory') {
                        navigate('/admin/inventory');
                    } else {
                        navigate('/admin/products');
                    }
                })
                .catch((error) => {
                    console.error("Failed to save product", error);
                    alert("Failed to save product: " + (error.message || error));
                });
        } catch (error) {
            console.error("Failed to save product", error);
            console.error("Failed to save product", error);
            alert("Failed to save product: " + (error.response?.data?.message || error.message));
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
                                    <option value="gifting">Gifting</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-turmeric focus:border-brand-turmeric"
                                >
                                    <option value="">Select Sub Category</option>
                                    {formData.category === 'sweets' && (
                                        <>
                                            <option value="Ghee Sweets">Ghee Sweets</option>
                                            <option value="Milk Sweets">Milk Sweets</option>
                                            <option value="Dry Fruit Sweets">Dry Fruit Sweets</option>
                                        </>
                                    )}
                                    {formData.category === 'bakery' && (
                                        <>
                                            <option value="Cakes & Pastries">Cakes & Pastries</option>
                                            <option value="Breads & Buns">Breads & Buns</option>
                                            <option value="Cookies">Cookies</option>
                                        </>
                                    )}
                                    {formData.category === 'snacks' && (
                                        <>
                                            <option value="Savouries">Savouries</option>
                                            <option value="Hot Snacks">Hot Snacks</option>
                                            <option value="Chips & Crisps">Chips & Crisps</option>
                                        </>
                                    )}
                                    {formData.category === 'savouries' && (
                                        <>
                                            <option value="Mixtures">Mixtures</option>
                                            <option value="Murukku">Murukku</option>
                                            <option value="Sev">Sev</option>
                                        </>
                                    )}
                                    {formData.category === 'gifting' && (
                                        <>
                                            <option value="Gift Boxes">Gift Boxes</option>
                                            <option value="Assorted Sweets">Assorted Sweets</option>
                                            <option value="Custom Hampers">Custom Hampers</option>
                                        </>
                                    )}
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
                                <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-gray-100 mt-2">
                                    <input
                                        type="checkbox"
                                        name="isGift"
                                        checked={formData.isGift}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isGift: e.target.checked }))}
                                        className="rounded text-brand-mahogany focus:ring-brand-mahogany"
                                    />
                                    <span className="text-sm font-bold text-brand-mahogany">Available for Gifting</span>
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
                                onClick={() => {
                                    if (location.state?.from === 'inventory') {
                                        navigate('/admin/inventory');
                                    } else {
                                        navigate('/admin/products');
                                    }
                                }}
                                className="w-full py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default AddEditProduct;


