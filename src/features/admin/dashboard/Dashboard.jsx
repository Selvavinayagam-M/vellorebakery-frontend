import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from './adminDashboardSlice';
import { ShoppingBag, CreditCard, Clock, CheckCircle } from 'lucide-react';
import StatCard from './StatCard';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, recentActivity, status, inventoryStatus } = useSelector(state => state.adminDashboard);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDashboardData());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening at Vellore Sweets today.</p>
                </div>
                <div className="flex gap-2">
                    <span className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-md text-gray-600 shadow-sm">
                        Last updated: Just now
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Orders"
                    value={stats.todayOrders}
                    icon={ShoppingBag}
                    trend="up"
                    trendValue="+12%"
                    color="text-blue-600"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${stats.todayRevenue.toLocaleString()}`}
                    icon={CreditCard}
                    trend="up"
                    trendValue="+8%"
                    color="text-green-600"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.activeOrders || stats.pendingOrders} // Use active or pending depending on backend response
                    icon={Clock}
                    trend="down"
                    trendValue="-2%"
                    color="text-orange-500"
                />
                <StatCard
                    title="Delivered"
                    value={stats.deliveredOrders}
                    icon={CheckCircle}
                    trend="up"
                    trendValue="+5%"
                    color="text-teal-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex gap-4 items-start">
                                <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${activity.type === 'order' ? 'bg-blue-50 text-blue-600' :
                                    activity.type === 'stock' ? 'bg-red-50 text-red-600' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                    {activity.type === 'order' && <ShoppingBag size={16} />}
                                    {activity.type === 'stock' && <Clock size={16} />}
                                    {activity.type === 'user' && <CheckCircle size={16} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Status Card - Real Data */}
                <div className={`rounded-xl shadow-lg p-6 text-white relative overflow-hidden ${(inventoryStatus?.healthPercentage < 50 || inventoryStatus?.outOfStockCount > 0) ? 'bg-gradient-to-br from-red-500 to-red-700' :
                    (inventoryStatus?.lowStockCount > 0 || inventoryStatus?.healthPercentage < 80) ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                        'bg-gradient-to-br from-green-500 to-green-700'
                    }`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Clock size={120} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">Inventory Status</h3>

                    {inventoryStatus ? (
                        <>
                            <p className="font-medium text-sm mb-6 relative z-10 opacity-90">{inventoryStatus.message}</p>
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm relative z-10 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Inventory Health</span>
                                    <span className="font-bold text-xl">{inventoryStatus.healthPercentage}%</span>
                                </div>
                                <div className="text-xs opacity-75 mt-1">
                                    {inventoryStatus.outOfStockCount} Out of Stock • {inventoryStatus.lowStockCount} Low Stock
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center">Loading Status...</div>
                    )}

                    <button
                        onClick={() => navigate('/admin/inventory')}
                        className="w-full py-2 bg-white text-gray-800 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors relative z-10"
                    >
                        Manage Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


