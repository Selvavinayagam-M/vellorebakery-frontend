export const getDashboardStats = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/orders/dashboard', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard stats');

        return await response.json();
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return {
            todayOrders: 0,
            todayRevenue: 0,
            pendingOrders: 0,
            pendingCOD: 0, // Add explicit COD
            activeOrders: 0,
            deliveredOrders: 0,
            totalProducts: 0
        };
    }
};

export const getRecentActivity = async () => {
    try {
        const ordersRes = await fetch('http://localhost:5000/api/orders/admin', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!ordersRes.ok) return [];

        const orders = await ordersRes.json();
        // Map orders to activity format
        return orders.slice(0, 5).map(o => ({
            id: o._id,
            user: o.customer?.name || "Customer",
            message: `New order placed: ${o.orderId}`,
            type: 'order',
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: o.status
        }));
    } catch (error) {
        console.error("Recent Activity Error:", error);
        return [];
    }
};
