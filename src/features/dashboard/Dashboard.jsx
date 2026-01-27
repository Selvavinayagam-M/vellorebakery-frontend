import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../../../features/adminDashboardSlice';
import { ShoppingBag, CreditCard, Clock, CheckCircle } from 'lucide-react';
import StatCard from './StatCard';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, recentActivity, status } = useSelector(state => state.adminDashboard);

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

                {/* Mini Stats / Quick Actions */}
                <div className="bg-gradient-to-br from-brand-mahogany to-brand-jaggery rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShoppingBag size={120} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">Bestseller Alert</h3>
                    <p className="text-brand-turmeric font-medium text-sm mb-6 relative z-10">Mysore Pak is selling fast!</p>

                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm relative z-10 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Stock Remaining</span>
                            <span className="font-bold">12 kg</span>
                        </div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-turmeric h-full w-[20%]"></div>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-white text-brand-mahogany font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors relative z-10">
                        View Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

