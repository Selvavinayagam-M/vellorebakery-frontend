import { getDashboardMetrics, getOrders } from '../../../../services/orders.service';

export const getDashboardStats = getDashboardMetrics;

export const getRecentActivity = async () => {
    const orders = await getOrders();
    return orders.slice(0, 5).map(o => ({
        id: o.id, // mapped id in service
        user: o.customer?.name || "Customer",
        message: `New order placed: ${o.orderId}`,
        type: 'order',
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        status: o.status
    }));
};

