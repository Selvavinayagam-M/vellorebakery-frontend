import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerSearch, toggleCustomerStatus, fetchCustomers, fetchCustomerOrders } from './adminCustomersSlice';
import { Search, Ban, CheckCircle, Mail, Phone, History } from 'lucide-react';
import CustomerHistoryModal from './CustomerHistoryModal';

const CustomersPage = () => {
    const dispatch = useDispatch();
    const { filteredCustomers, searchQuery, selectedCustomerOrders, historyLoading } = useSelector((state) => state.adminCustomers);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedCustomerName, setSelectedCustomerName] = useState('');

    React.useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleViewHistory = (customer) => {
        setSelectedCustomerName(customer.name);
        dispatch(fetchCustomerOrders(customer._id)); // Use _id from MongoDB
        setIsHistoryOpen(true);
    };

    return (
        <div className="space-y-6">
            <CustomerHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                orders={selectedCustomerOrders}
                loading={historyLoading}
                customerName={selectedCustomerName}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mahogany focus:border-transparent outline-none w-full"
                        value={searchQuery}
                        onChange={(e) => dispatch(setCustomerSearch(e.target.value))}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <div key={customer._id || customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${customer.status === 'Blocked' ? 'bg-red-100 text-red-600' : 'bg-brand-turmeric/20 text-brand-mahogany'
                                        }`}>
                                        {customer.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{customer.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {customer.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail size={16} className="mr-2 text-gray-400" />
                                    {customer.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone size={16} className="mr-2 text-gray-400" />
                                    {customer.phone || 'N/A'}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4 pt-4 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Orders</p>
                                    <p className="text-lg font-bold text-gray-900">{customer.ordersCount || 0}</p>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Spent</p>
                                    <p className="text-lg font-bold text-brand-mahogany">₹{customer.totalSpent || 0}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => handleViewHistory(customer)}
                                    className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <History size={16} />
                                    History
                                </button>
                                <button
                                    onClick={() => dispatch(toggleCustomerStatus(customer._id || customer.id))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${customer.status === 'Active'
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                >
                                    {customer.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                    {customer.status === 'Active' ? 'Block' : 'Unblock'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                        No customers found matching "{searchQuery}".
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomersPage;


