import axios from 'axios';

// Create Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend URL is different
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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

