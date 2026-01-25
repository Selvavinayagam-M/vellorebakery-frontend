const API_URL = 'http://localhost:5000/api/orders';

export const ordersService = {
    createOrder: async (orderData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Optional if we want to associate with user
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to place order');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    trackOrder: async (orderId) => {
        try {
            const response = await fetch(`${API_URL}/track/${orderId}`);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to track order');
                } else {
                    throw new Error(`Order not found or API unavailable (Status: ${response.status})`);
                }
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};
