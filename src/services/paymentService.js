import axios from "axios";

// Tạo giao dịch thanh toán
export const createPayment = async (userId, amount, paymentCode, paymentMethod, token) => {
    console.log(userId, amount, paymentCode, paymentMethod, token);
    try {
        const response = await axios.post('http://localhost:8080/api/payments/create',
            {userId, amount, paymentCode, paymentMethod},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        return response.data;// Trả về kết quả thành công và danh sách mới
    } catch (error) {
        // Trả về lỗi nếu có
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

// Lấy danh sách thanh toán của một người dùng
export const getPaymentsByUser = async (userId, token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/payments/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!'); // Ném lỗi để xử lý ở component
    }
};

// Lấy danh sách thanh toán PENDING (Admin)
export const getPendingPayments = async (token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/payments/pending`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!'); // Ném lỗi để xử lý ở component
    }
};

// Xác nhận thanh toán (Admin)
export const confirmPayment = async (paymentId, premium, duration, token) => {
    console.log(paymentId, token)
    try {
        const response = await axios.post(`http://localhost:8080/api/admin/payments/${paymentId}/confirm`, {
                premium,
                duration
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        return {success: response.data.body};// Trả về kết quả thành công và danh sách mới
    } catch (error) {
        // Trả về lỗi nếu có
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

// Lấy chi tiết thanh toán
export const getPaymentById = async (paymentId, token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!'); // Ném lỗi để xử lý ở component
    }
};

// Xác minh thanh toán
export const confirmPayments = async (startDate, endDate, limit, token) => {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/admin/payments/confirm`,
            `startDate=${startDate}&endDate=${endDate}&limit=${limit}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};

// Lấy danh sách thanh toán
export const getPayments = async (token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/payments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};
