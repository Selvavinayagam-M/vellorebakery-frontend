import axios from 'axios';


let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


if (!baseURL.endsWith('/api')) {
   
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config) => {
        // Check if we are making a request from an Admin page
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const token = isAdminRoute
            ? localStorage.getItem('adminToken')
            : localStorage.getItem('userToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (Optional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle globally (e.g., redirect to login on 401)
        if (error.response?.status === 401) {
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

