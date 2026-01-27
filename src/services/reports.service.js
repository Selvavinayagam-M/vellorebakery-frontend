import apiClient from '../app/apiClient';

export const getRevenueAnalytics = async (period = 'monthly') => {
    // Assuming backend endpoint exists
    const response = await apiClient.get(`/analytics/revenue`, { params: { period } });
    return response.data;
};

export const getTopSellingProducts = async () => {
    const response = await apiClient.get(`/analytics/top-products`);
    return response.data;
};

export const getReportsOverview = async () => {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
};

export const exportReports = async () => {
    try {
        const response = await apiClient.get('/analytics/export', {
            responseType: 'blob', // Important for file download
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Export Failed:", error);
        throw error;
    }
};

const reportsService = {
    getRevenueAnalytics,
    getTopSellingProducts,
    getReportsOverview,
    exportReports
};

export default reportsService;
