import apiClient from '../app/apiClient';

export const getAllOrders = async (params) => {
    // Backend route is router.get('/', protect, admin, getOrders);
    const response = await apiClient.get('/orders', { params });
    return response.data;
};

export const getOrderById = async (id) => {
   
    const response = await apiClient.get('/orders');
    return response.data.find(o => o._id === id || o.id === id);
};

export const getMyOrders = async () => {
    // Backend: router.get('/myorders', protect, getUserOrders);
    const response = await apiClient.get('/orders/myorders');
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
};

export const getDashboardMetrics = async () => {
    try {
        const response = await apiClient.get('/orders/dashboard');
        return response.data;
    } catch (error) {
        return { todayOrders: 0, todayRevenue: 0, activeOrders: 0, deliveredOrders: 0, lowStockCount: 0 };
    }
};

export const trackOrder = async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/status`);
    return response.data;
};

// Mapped version for table display
export const getOrders = async () => {
    try {
        const data = await getAllOrders();
        return data.map(order => ({
            id: order._id, // MongoDB ID
            orderId: order.orderId, // Display ID
            customer: order.customer || { name: 'Guest', phone: '' },
            customerId: order.customer?._id || 'guest',
            customerPhone: order.customer?.phone || '',
            date: new Date(order.createdAt).toLocaleDateString(),
            createdAt: order.createdAt,
            total: order.totalAmount,
            status: order.status,
            paymentMode: order.paymentMode || (order.paymentStatus === 'PAID' ? 'ONLINE' : 'COD'),
            paymentStatus: order.paymentStatus || 'PENDING',
            items: order.items,
            itemCount: order.items.length
        }));
    } catch (error) {
        return [];
    }
};

export const ordersService = {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrders,
    getMyOrders,
    updateOrderStatus,
    getDashboardMetrics,
    trackOrder
};

export default ordersService;

