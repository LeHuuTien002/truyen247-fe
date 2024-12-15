import axios from "axios";

export const createQRCode = async (bankName, cardName, cardNumber, paymentContent, amount, file, token) => {
    try {
        const formData = new FormData();
        // Tạo đối tượng ComicRequest và chuyển thành Blob
        const request = {
            bankName: bankName,
            cardName: cardName,
            cardNumber: cardNumber,
            paymentContent: paymentContent,
            amount: amount
        };
        formData.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));

        // Thêm file vào formData
        formData.append("file", file);
        const response = await axios.post('http://localhost:8080/api/admin/QRPayment',
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
        const response = await axios.delete(`http://localhost:8080/api/admin/QRPayment/${id}`, {
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
        // Tạo đối tượng ComicRequest và chuyển thành Blob
        const request = {
            id: id,
            bankName: bankName,
            cardName: cardName,
            cardNumber: cardNumber,
            paymentContent: paymentContent,
            amount: amount
        };
        formData.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));

        // Thêm file vào formData
        formData.append("file", file);
        const response = await axios.put(`http://localhost:8080/api/admin/QRPayment/${id}`,
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
        const response = await axios.get(`http://localhost:8080/api/public/QRPayment`)
        return response.data;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi không xác định.")
    }
}
