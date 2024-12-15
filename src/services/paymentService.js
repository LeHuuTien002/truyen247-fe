import axios from "axios";

// Tạo giao dịch thanh toán
export const createPayment = async (userId, amount, paymentCode, paymentMethod, token) => {
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
