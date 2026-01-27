import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <motion.div
            whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
            </div>

            <div className="flex items-center text-xs font-medium">
                {trend === 'up' ? (
                    <span className="text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                        <ArrowUpRight size={14} className="mr-1" />
                        {trendValue}
                    </span>
                ) : (
                    <span className="text-red-600 flex items-center bg-red-50 px-2 py-0.5 rounded-full">
                        <ArrowDownRight size={14} className="mr-1" />
                        {trendValue}
                    </span>
                )}
                <span className="text-gray-400 ml-2">vs yesterday</span>
            </div>
        </motion.div>
    );
};

export default StatCard;


