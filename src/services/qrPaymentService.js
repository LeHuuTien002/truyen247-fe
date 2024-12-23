import axios from "axios";
import apiUrl from "../config";

export const createQRCode = async (bankName, cardName, cardNumber, paymentContent, amount, file, token) => {
    try {
        const formData = new FormData();
        const request = {
            bankName: bankName,
            cardName: cardName,
            cardNumber: cardNumber,
            paymentContent: paymentContent,
            amount: amount
        };
        formData.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));

        formData.append("file", file);
        const response = await axios.post(`${apiUrl}/api/admin/QRPayment`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
        return response.data;
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}

export const deleteQRCode = async (id, token) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/admin/QRPayment/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi không xác định.");
    }
}

export const updateQRCode = async (id, bankName, cardName, cardNumber, paymentContent, amount, file, token) => {
    try {
        const formData = new FormData();
        const request = {
            id: id,
            bankName: bankName,
            cardName: cardName,
            cardNumber: cardNumber,
            paymentContent: paymentContent,
            amount: amount
        };
        formData.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));

        formData.append("file", file);
        const response = await axios.put(`${apiUrl}/api/admin/QRPayment/${id}`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
        return response.data;
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}

export const getAllQRCodes = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/QRPayment`)
        return response.data;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi không xác định.")
    }
}
