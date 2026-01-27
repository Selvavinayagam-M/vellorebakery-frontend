import { fetchAllOrders } from '../../orders/service/orders.service';

export const getReports = async () => {
    try {
        const orders = await fetchAllOrders();

        // 1. Calculate Revenue (Realized Revenue only) & Pending COD
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let monthlyRevenue = 0;
        let pendingCOD = 0;
        const uniqueCustomers = new Set();

        orders.forEach(order => {
            // For revenue: check if PAID.
            // (If paymentStatus is missing, fallback logic: ONLINE=PAID, COD=Pending unless Delivered)
            const isPaid = order.paymentStatus === 'PAID' ||
                (order.paymentMode === 'ONLINE' && !order.paymentStatus) ||
                (order.paymentMode === 'COD' && order.status === 'Delivered');

            // Check if this order belongs to current month (optional, assuming 'monthlyRevenue' implies current month)
            const date = new Date(order.createdAt);
            const isCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;

            if (isCurrentMonth && isPaid) {
                monthlyRevenue += (order.totalAmount || 0);
            }

            // Track pending COD (All time?) or just current month?
            // Usually "Pending" metrics are snapshot of *current* state regardless of time, or for specific period.
            // Let's assume global pending COD for dashboard utility, or current month if requested.
            // Requirement says "Pending COD amount tracked separately" but not specifically "Monthly".
            // Let's track ALL pending COD for actionable insight.
            if (order.paymentMode === 'COD' && order.paymentStatus !== 'PAID' && order.status !== 'Delivered' && order.status !== 'Cancelled') {
                pendingCOD += (order.totalAmount || 0);
            }

            // Track unique customers (Phone as ID, fallback to Name)
            const customerId = order.customer?.phone || order.customer?.name;
            if (customerId) {
                uniqueCustomers.add(customerId);
            }
        });

        // 2. Total Orders
        const totalOrders = orders.length;

        // 3. Daily Sales (Last 7 Days)
        const dailySales = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const daysSales = orders
                .filter(o => o.createdAt.startsWith(dateStr))
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            dailySales.push({ day: dayName, sales: daysSales });
        }

        // 4. Top Products
        const productStats = {};
        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const name = item.name || 'Unknown Product';
                    if (!productStats[name]) {
                        productStats[name] = { name, sales: 0 };
                    }
                    productStats[name].sales += (item.qty || 0);
                });
            }
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        return {
            revenue: monthlyRevenue,
            monthlyRevenue,
            revenue: monthlyRevenue,
            monthlyRevenue,
            pendingCOD,
            totalOrders,
            totalCustomers: uniqueCustomers.size, // New Field
            dailySales,
            topProducts,
            customerGrowth: []
        };
    } catch (error) {
        console.error('Error fetching reports:', error);
        return {
            monthlyRevenue: 0,
            totalOrders: 0,
            dailySales: [],
            topProducts: []
        };
    }
};

