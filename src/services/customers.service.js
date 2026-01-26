import apiClient from '../app/apiClient';

export const getAllCustomers = async (params) => {
    const response = await apiClient.get('/auth/users', { params });
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await apiClient.get(`/users/${id}`); // Note: backend route for GET /users/:id is missing too, but priority is list.
    // If detail needed, would need another route. Assuming list is priority.
    return response.data;
};

// Alias and extra methods
export const getCustomers = getAllCustomers;

export const toggleCustomerStatusService = async (id) => {
    // Assuming backend endpoint
    const response = await apiClient.patch(`/auth/users/${id}/toggle-status`);
    return response.data;
};

export const fetchCustomerOrders = async (id) => {
    const response = await apiClient.get(`/orders/user/${id}`);
    return response.data;
};

export default {
    getAllCustomers,
    getCustomers,
    getCustomerById,
    getCustomerById,
    toggleCustomerStatusService,
    fetchCustomerOrders
};

