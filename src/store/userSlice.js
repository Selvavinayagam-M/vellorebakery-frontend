import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../modules/user/service/user.service';

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

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (updates) => {
        // mock id 'u1' for now since auth state might not have id if we reload
        // but normally we get it from state
        const response = await userService.updateProfile('u1', updates);
        return response.updates;
    }
);

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    currentUser: user || null,
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
                state.isAuthenticated = true;
                state.currentUser = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser = { ...state.currentUser, ...action.payload };
                }
            });
    }
});

export const { logout, updateProfileSync } = userSlice.actions;
export default userSlice.reducer;
