import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './userSlice';

// Helper to check admin role
const isAdmin = (user) => user?.role === 'admin' || user?.role === 'superadmin';

// Initial Load
const token = localStorage.getItem('adminToken');
let adminUser = null;
try {
    adminUser = JSON.parse(localStorage.getItem('adminUser'));
} catch (e) {
    console.error('Failed to parse admin user');
}

const initialState = {
    adminUser: adminUser,
    isAuthenticated: !!(token && isAdmin(adminUser)),
    loading: false,
    error: null,
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        logoutAdmin: (state) => {
            state.isAuthenticated = false;
            state.adminUser = null;
            state.error = null;
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                // ONLY update if it is an admin
                if (isAdmin(action.payload)) {
                    state.isAuthenticated = true;
                    state.adminUser = action.payload;
                    // Token storage is handled in auth.service.js already
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
