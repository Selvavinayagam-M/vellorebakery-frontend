import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    isCartOpen: false,
    isFilterOpen: false,
    isMobileMenuOpen: false,
    modal: {
        isOpen: false,
        type: null, // 'LOGIN', 'SIGNUP', 'SUCCESS', etc.
        data: null,
    },
    toast: {
        isOpen: false,
        message: '',
        type: 'success', // 'success', 'error', 'info'
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        toggleFilter: (state) => {
            state.isFilterOpen = !state.isFilterOpen;
        },
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
        },
        openModal: (state, action) => {
            state.modal = {
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data || null,
            };
        },
        closeModal: (state) => {
            state.modal.isOpen = false;
            state.modal.type = null;
            state.modal.data = null;
        },
        showToast: (state, action) => {
            state.toast = {
                isOpen: true,
                message: action.payload.message,
                type: action.payload.type || 'success',
            };
        },
        hideToast: (state) => {
            state.toast.isOpen = false;
        },
    },
});

export const {
    setLoading,
    toggleCart,
    toggleFilter,
    toggleMobileMenu,
    openModal,
    closeModal,
    showToast,
    hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
