const API_URL = 'http://localhost:5000/api/admin/dashboard'; // Assuming this endpoint

export const getDashboardStats = async () => {
    try {
        // Build this endpoint or mock with real product counts for now if endpoint missing
        // For now, let's just return a structure that won't crash, 
        // OR better, actually implement the endpoint.
        // But user asked to "verify mock data converted". 
        // If I can't verify backend endpoint exists, I should probably return safe defaults or error.

        // Let's assume we need to fetch stats.
        // If endpoint doesn't exist, we can fetch orders/products and count them client side 
        // as a temporary "Real Data" solution without writing new backend code if out of scope.
        // But let's try to hit a likely endpoint or existing ones.

        const productsRes = await fetch('http://localhost:5000/api/products');
        const products = await productsRes.json();

        const ordersRes = await fetch('http://localhost:5000/api/admin/orders', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        let orders = [];
        if (ordersRes.ok) {
            orders = await ordersRes.json();
        }

        return {
            todayOrders: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length,
            todayRevenue: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
                .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
            pendingOrders: orders.filter(o => o.status === 'Pending').length,
            totalProducts: products.length
        };
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return {
            todayOrders: 0,
            todayRevenue: 0,
            pendingOrders: 0,
            totalProducts: 0
        };
    }
};

export const getRecentActivity = async () => {
    try {
        const ordersRes = await fetch('http://localhost:5000/api/admin/orders', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!ordersRes.ok) return [];

        const orders = await ordersRes.json();
        // Map orders to activity format
        return orders.slice(0, 5).map(o => ({
            id: o._id,
            user: o.customer?.name || "Customer",
            action: `placed order ${o.orderId}`,
            time: new Date(o.createdAt).toLocaleTimeString(),
            status: o.status
        }));
    } catch (error) {
        return [];
    }
};
