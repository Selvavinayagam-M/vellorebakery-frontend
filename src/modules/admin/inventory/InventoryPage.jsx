import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStock, toggleAvailability, fetchInventory } from '../../../store/adminInventorySlice';
import { Edit2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const InventoryPage = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.adminInventory);
    const [editingId, setEditingId] = useState(null);
    const [tempStock, setTempStock] = useState('');

    React.useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    const startEditing = (item) => {
        setEditingId(item.id);
        setTempStock(item.stock);
    };

    const saveStock = (id) => {
        dispatch(updateStock({ id, stock: tempStock }));
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Inventory Management</h1>
                <button className="w-full md:w-auto bg-brand-mahogany text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium hover:bg-brand-mahogany/90 transition-colors shadow-sm active:scale-95">
                    + Add New Product
                </button>
            </div>

            <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:overflow-hidden md:border md:border-gray-100">
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-100 md:border-0">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Product Name</th>
                                <th className="px-6 py-4 whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap">Stock Level</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Availability</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status === 'In Stock' && <CheckCircle size={12} />}
                                            {item.status === 'Low Stock' && <AlertCircle size={12} />}
                                            {item.status === 'Out of Stock' && <XCircle size={12} />}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === item.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={tempStock}
                                                    onChange={(e) => setTempStock(e.target.value)}
                                                    className="w-20 border border-brand-mahogany rounded px-2 py-1 text-sm outline-none"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && saveStock(item.id)}
                                                />
                                                <button onClick={() => saveStock(item.id)} className="text-green-600 text-xs font-bold hover:underline">Save</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEditing(item)}>
                                                <span className="font-semibold text-gray-700">{item.stock}</span>
                                                <span className="text-gray-400 text-xs">{item.unit}</span>
                                                <Edit2 size={14} className="text-gray-300 group-hover:text-brand-mahogany transition-colors" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={item.status !== 'Out of Stock'}
                                                onChange={() => dispatch(toggleAvailability(item.id))}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-mahogany"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button className="text-brand-mahogany text-sm font-medium hover:underline" onClick={() => startEditing(item)}>
                                            Update Stock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.category}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={item.status !== 'Out of Stock'}
                                        onChange={() => dispatch(toggleAvailability(item.id))}
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-mahogany"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Stock:</span>
                                    {editingId === item.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={tempStock}
                                                onChange={(e) => setTempStock(e.target.value)}
                                                className="w-16 border border-brand-mahogany rounded px-2 py-1 text-sm outline-none"
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && saveStock(item.id)}
                                            />
                                            <button onClick={() => saveStock(item.id)} className="text-green-600 text-xs font-bold">Save</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 group" onClick={() => startEditing(item)}>
                                            <span className="font-bold text-gray-900">{item.stock}</span>
                                            <span className="text-xs text-gray-500">{item.unit}</span>
                                            <Edit2 size={12} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {item.status === 'In Stock' && <CheckCircle size={10} />}
                                    {item.status === 'Low Stock' && <AlertCircle size={10} />}
                                    {item.status === 'Out of Stock' && <XCircle size={10} />}
                                    {item.status}
                                </span>
                            </div>

                            <button
                                onClick={() => startEditing(item)}
                                className="w-full flex justify-center items-center gap-2 py-2.5 bg-gray-50 text-brand-mahogany font-medium rounded-lg text-sm hover:bg-gray-100 transition-colors active:scale-95"
                            >
                                <Edit2 size={14} />
                                {editingId === item.id ? 'Editing Stock...' : 'Update Stock'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
