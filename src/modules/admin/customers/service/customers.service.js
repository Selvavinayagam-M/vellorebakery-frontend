const API_URL = 'http://localhost:5000/api/users'; // Admin User Management

export const getCustomers = async () => {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const toggleCustomerStatusService = async (id) => {
    return { id, status: 'Updated' };
};
