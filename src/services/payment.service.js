import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment';

const createOrder = async (amount) => {
    const response = await axios.post(`${API_URL}/create-order`, { amount });
    return response.data;
};

const verifyPayment = async (paymentData) => {
    const response = await axios.post(`${API_URL}/verify`, paymentData);
    return response.data;
};

export const paymentService = {
    createOrder,
    verifyPayment
};
