import apiClient from '../app/apiClient';

export const login = async (email, password) => {
    // Accepted params form to match legacy call
    const credentials = { email, password };
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Also store user info if needed, though slice usually handles it
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const userData = { name, email, password };
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getProfile = async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
};

export const updateProfile = async (updates) => {
    const response = await apiClient.put('/auth/me', updates);
    return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};

// Default export object matches 'userService' usage pattern if imported as default
export const userService = {
    login,
    register,
    logout,
    getProfile,
    getMe,
    updateProfile
};

export default userService;

