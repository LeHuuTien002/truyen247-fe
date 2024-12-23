import axios from "axios";
import apiUrl from "../config";

export const createPayment = async (userId, amount, paymentCode, paymentMethod, token) => {
    try {
        const response = await axios.post(`${apiUrl}/api/payments/create`,
            {userId, amount, paymentCode, paymentMethod},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

export const getPaymentsByUser = async (userId, token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/payments/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};

export const getPendingPayments = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/admin/payments/pending`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};

export const getPayments = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/admin/payments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};
