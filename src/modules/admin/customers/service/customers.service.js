import { fetchAllOrders } from '../../orders/service/orders.service';

export const getCustomers = async () => {
    try {
        const orders = await fetchAllOrders();

        const customerMap = new Map();

        orders.forEach(order => {
            const customerName = order.customer?.name || 'Guest';
            const customerPhone = order.customer?.phone || 'N/A';
            const customerEmail = order.customer?.email || 'N/A';
            // Use phone as unique identifier if available, otherwise name + phone fallback
            const key = customerPhone !== 'N/A' ? customerPhone : customerName;

            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    id: key, // Use key as ID for frontend key props
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    orders: 0,
                    totalSpent: 0,
                    status: 'Active', // Default status
                    lastOrder: null
                });
            }

            const customer = customerMap.get(key);
            customer.orders += 1;
            customer.totalSpent += (order.totalAmount || 0);
            if (!customer.lastOrder || new Date(order.createdAt) > new Date(customer.lastOrder)) {
                customer.lastOrder = order.createdAt;
            }
        });

        return Array.from(customerMap.values());
    } catch (error) {
        console.error('Error deriving customers:', error);
        return [];
    }
};

export const toggleCustomerStatusService = async (id) => {
    // Since we don't have a real customer DB yet, just return success
    return { id, status: 'Updated' };
};
