import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toggleActive, deleteProduct, fetchProducts } from '../../../store/adminProductsSlice';
import { AdminPageHeader, AdminSearchFilter } from '../shared/AdminComponents';
import fallbackImage from '../../../assets/images/curatedbakerycombos/familyteatime.png';

const ProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, isLoading } = useSelector(state => state.adminProducts);
    const [searchQuery, setSearchQuery] = useState('');

    React.useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    return (
        <div>
            <AdminPageHeader
                title="Products"
                description="Manage your sweets and snacks inventory."
                actionLabel="Add Product"
                onAction={() => navigate('/admin/products/add')}
            />

            <AdminSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Product</th>
                                <th className="px-6 py-4 whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 whitespace-nowrap">Price / Weight</th>
                                <th className="px-6 py-4 whitespace-nowrap">Stock Status</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id || item.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image || fallbackImage}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">₹{item.price}</span> / {item.unit || 'Kg'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.stock > 0 ? (
                                                <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                                    In Stock ({item.stock})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => dispatch(toggleActive(item.id || item._id))}
                                                className={`p-1.5 rounded-md transition-colors ${!item.isArchived ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                {!item.isArchived ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/products/edit/${item.id || item._id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id || item._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle size={48} className="text-gray-300 mb-4" />
                                            <p className="text-lg font-medium">No products found</p>
                                            <p className="text-sm">Try adjusting your search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards (SaaS Style) */}
                <div className="md:hidden">
                    {filteredItems.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <div key={item._id || item.id} className="p-4 bg-white flex flex-col gap-3">
                                    <div className="flex gap-4 items-start">
                                        {/* Image (Fixed 48px) */}
                                        <img
                                            src={item.image || fallbackImage}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                        />

                                        {/* Content (Stacked) */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className="font-bold text-gray-900 truncate text-sm">{item.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                                <span className="capitalize">{item.category}</span>
                                                <span>•</span>
                                                <span className={item.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                                    {item.stock} in stock
                                                </span>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                ₹{item.price} / {item.unit || 'Kg'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Row (Bottom, Full Width) */}
                                    <div className="flex items-center gap-3 border-t border-gray-50 pt-3 mt-1">
                                        <button
                                            onClick={() => navigate(`/admin/products/edit/${item.id}`)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id || item._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <AlertCircle size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No products found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
