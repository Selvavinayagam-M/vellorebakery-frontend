const API_URL = 'http://localhost:5000/api/orders';

// Internal helper to fetch raw data
export const fetchAllOrders = async () => {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const getOrders = async () => {
    try {
        const data = await fetchAllOrders();

        // Map backend data to frontend model
        return data.map(order => ({
            id: order._id, // MongoDB ID
            orderId: order.orderId, // Display ID
            // Return full customer object (or structured object) so UI can access .name, .phone
            customer: order.customer || { name: 'Guest', phone: '' },
            customerId: order.customer?._id || 'guest', // If customer ref exists
            customerPhone: order.customer?.phone || '',
            // customerEmail: order.customer?.email || '', // If available
            date: new Date(order.createdAt).toLocaleDateString(),
            createdAt: order.createdAt, // Keep raw for sorting/filtering
            total: order.totalAmount,
            status: order.status,
            paymentMode: order.paymentMode || (order.paymentStatus === 'PAID' ? 'ONLINE' : 'COD'), // Fallback if missing
            paymentStatus: order.paymentStatus || 'PENDING',
            items: order.items,
            itemCount: order.items.length
        }));
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
        if (!response.ok) throw new Error('Failed to update status');
        return await response.json();
    } catch (error) {
        throw error; // Throw to let component handle success/failure
    }
};
