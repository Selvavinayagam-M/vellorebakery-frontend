import axios from 'axios';

// Create Axios instance
// Get Base URL from env or default
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure it ends with /api to prevent 404s if user forgets it in Env Vars
if (!baseURL.endsWith('/api')) {
    // Remove trailing slash if present then append /api
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

