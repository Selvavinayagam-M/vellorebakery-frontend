import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../settings/settingsSlice';
import { Save, Bell, Shield, Store, Truck } from 'lucide-react';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settings);

    // Sync form with store updates
    React.useEffect(() => {
        if (settings) {
            setFormData(prev => ({ ...prev, ...settings }));
        }
    }, [settings]);

    // Local state for form management
    const [formData, setFormData] = useState(settings);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        dispatch(updateSettings(formData)).then(() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-brand-mahogany text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-mahogany/90 transition-all shadow-md active:scale-95"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            {saved && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50">
                    <div className="bg-white/20 p-1 rounded-full"><Save size={14} /></div>
                    Settings saved successfully!
                </div>
            )}

            <div className="space-y-6">
               

                {/* Delivery & Tax */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Truck size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Delivery & Tax</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enableDelivery"
                                    checked={formData.enableDelivery}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-mahogany"></div>
                            </label>
                            <span className="text-sm font-medium text-gray-700">Enable Delivery</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                            <input
                                type="number"
                                name="deliveryFee"
                                disabled={!formData.enableDelivery}
                                value={formData.deliveryFee}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${formData.notifications ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                <div>
                                    <p className="font-medium text-gray-800">Email Notifications</p>
                                    <p className="text-xs text-gray-500">Receive emails for new orders and low stock.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="notifications"
                                    checked={formData.notifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-mahogany"></div>
                            </label>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;


