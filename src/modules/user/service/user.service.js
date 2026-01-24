const API_URL = 'http://localhost:5000/api/auth';

export const userService = {
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();

            // Save token
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Also save user info for persistence if needed, but redux handles state
                localStorage.setItem('user', JSON.stringify(data));
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userId, updates) => {
        // ... (Keep existing or update if backend has profile update)
        // For now, keeping as mock or placeholder as backend update endpoint wasn't requested/verified
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, updates });
            }, 500);
        });
    }
};
