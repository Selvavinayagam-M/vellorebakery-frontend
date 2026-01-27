import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/auth.service';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await userService.login(email, password);
            return response; // response IS the user object with token now
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await userService.register(name, email, password);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserDetails = createAsyncThunk(
    'user/updateUserDetails',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userService.updateProfile(userData);
            return response;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message;
            return rejectWithValue(message);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getMe();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const token = localStorage.getItem('userToken');
let user = null;
try {
    user = JSON.parse(localStorage.getItem('user'));
} catch (e) {
    console.error('Failed to parse user from local storage');
}

const initialState = {
    currentUser: user,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.currentUser = null;
            state.error = null;
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
        },
        // Keep simple sync update for optimistic or partial updates if needed
        updateProfileSync: (state, action) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                const user = action.payload;
                // CUSTOMER ONLY
                if (user.role !== 'admin' && user.role !== 'superadmin') {
                    state.isAuthenticated = true;
                    state.currentUser = user;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.currentUser = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentUser) {
                    state.currentUser = action.payload; // Payload is the full updated user object
                    // Update local storage
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.currentUser = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.currentUser = null;
                // If token is invalid, clear it
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
            });
    }
});

export const { logout, updateProfileSync } = userSlice.actions;
export default userSlice.reducer;


