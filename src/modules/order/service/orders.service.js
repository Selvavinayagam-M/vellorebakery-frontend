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
    }
};
