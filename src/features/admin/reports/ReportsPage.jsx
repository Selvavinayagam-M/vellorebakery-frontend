import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Download, TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchReports } from './adminReportsSlice';
import { exportReports } from '../../../services/reports.service';

const ReportsPage = () => {
    const dispatch = useDispatch();
    const reports = useSelector((state) => state.adminReports) || {};
    const { dailySales = [], monthlyRevenue = 0, totalOrders = 0, topProducts = [], totalCustomers = 0 } = reports;

    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);

    // Simple visual bar chart since we don't have libraries
    const maxSales = dailySales.length > 0 ? Math.max(...dailySales.map(d => d.sales)) : 1000;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
                <div className="flex gap-3">
                    <select className="border border-gray-300 rounded-lg py-2 px-4 text-sm outline-none focus:border-brand-mahogany">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                    </select>

                    <button
                        onClick={() => exportReports()}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors active:scale-95"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-50 text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-gray-500 text-sm">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{monthlyRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+8.2%</span>
                    </div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-gray-500 text-sm">Pending COD</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{reports.pendingCOD ? reports.pendingCOD.toLocaleString() : '0'}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+4.1%</span>
                    </div>
                    <p className="text-gray-500 text-sm">Total Customers</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart Visualization */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-brand-mahogany" />
                        Sales Overview
                    </h3>
                    <div className="h-64 w-full">
                        {dailySales.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Bar
                                        dataKey="sales"
                                        fill="#6D3D1F"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                        activeBar={{ fill: '#4A2c20' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <TrendingUp size={48} className="mb-2 opacity-20" />
                                <p>No sales data available for this period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full font-bold text-gray-400 border border-gray-200 shadow-sm text-sm">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <p className="font-bold text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.totalSold || product.sales || 0} orders</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-brand-mahogany">₹{product.revenue ? product.revenue.toLocaleString() : (product.sales * 0).toLocaleString()}</span>
                                    <span className="text-xs text-green-600 font-medium">Trending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;


