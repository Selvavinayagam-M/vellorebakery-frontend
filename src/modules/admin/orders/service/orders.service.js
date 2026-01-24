const API_URL = 'http://localhost:5000/api/admin/orders'; // Assuming real endpoint

export const getOrders = async () => {
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

export const updateOrderStatusService = async (id, status) => {
    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });
        return await response.json();
    } catch (error) {
        return null;
    }
};
