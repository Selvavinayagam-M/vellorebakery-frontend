import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from './userSlice';
import { User, Phone, MapPin, Calendar, Clock, Save, Shield } from 'lucide-react';
import { showToast } from '../../features/ui/uiSlice';
import { Navigate } from 'react-router-dom';
import Input from '../../components/Input';

const AccountDetails = ({ isEmbedded = false }) => {
    const dispatch = useDispatch();
    const { currentUser, loading } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                phone: currentUser.phone || '',
                addressLine: currentUser.address?.line || '',
                city: currentUser.address?.city || '',
                state: currentUser.address?.state || '',
                pincode: currentUser.address?.pincode || ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare Payload
        const payload = {
            name: formData.name,
            phone: formData.phone,
            address: {
                line: formData.addressLine,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            }
        };

        try {
            await dispatch(updateUserDetails(payload)).unwrap();
            dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
            setIsEditing(false);
        } catch (error) {
            dispatch(showToast({ message: error || 'Failed to update profile', type: 'error' }));
        }
    };

    if (!currentUser) {
        return <div className="p-8 text-center">Loading Profile...</div>;
    }

    if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return (
        <div className={isEmbedded ? "" : "container mx-auto px-4 py-8 max-w-4xl"}>
            {!isEmbedded && (
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-800">Account Details</h1>
                        <p className="text-gray-500 mt-1">Manage your profile and preferences</p>
                    </div>
                </div>
            )}

            {/* Embedded Header Actions */}
            <div className={`flex justify-end mb-4 ${!isEmbedded ? 'hidden' : ''}`}>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-brand-mahogany text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-mahogany/90 transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Standalone Edit Button (Desktop Header style) */}
            {!isEmbedded && !isEditing && (
                <div className="absolute top-8 right-4 hidden md:block">
                    {/* Positioned relative to container if needed, but flex above handles it. 
                        Actually the flex header above handles it for standalone. 
                        Let's stick to the flex header above for standalone. 
                    */}
                </div>
            )}

            {!isEmbedded && (
                <div className="flex justify-end -mt-16 mb-8 relative z-10">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-brand-mahogany text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-mahogany/90 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Section 1: Personal Information */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-brand-mahogany/10 text-brand-mahogany rounded-lg">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400">(Read-only)</span></label>
                            <input
                                type="email"
                                value={currentUser.email}
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Address */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Default Address</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                            <input
                                type="text"
                                name="addressLine"
                                value={formData.addressLine}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Street, Apartment, etc."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-mahogany outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Metadata */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Account Metadata</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-full"><Shield size={16} /></div>
                            <div>
                                <p className="font-bold text-gray-900">User ID</p>
                                <p className="font-mono text-xs">{currentUser._id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-full"><Calendar size={16} /></div>
                            <div>
                                <p className="font-bold text-gray-900">Joined On</p>
                                <p>{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-full"><Clock size={16} /></div>
                            <div>
                                <p className="font-bold text-gray-900">Last Login</p>
                                <p>{currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : 'Today'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {isEditing && (
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-brand-mahogany text-white rounded-lg font-bold hover:bg-brand-mahogany/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AccountDetails;
