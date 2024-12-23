import axios from 'axios';
import apiUrl from "../config";

const API_BASE_URL = `${apiUrl}/api/history`;

export const removeHistory = async (historyId, token) => axios.delete(`${API_BASE_URL}/${historyId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const getHistoryByUser = async (userId,token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

export const getRecentLogsByUser = async (userId,token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recent-logs-by-user`,
            {
                params: {userId},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Lỗi từ phía server.");
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
};


export const checkHistoryExists = async (userId, comicId,token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/exists`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId,
                comicId,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi kiểm tra lịch sử:', error.message);
        throw error;
    }
};

export const createHistory = async (historyData,token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, historyData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo lịch sử:', error.message);
        throw error;
    }
};

export const updateHistory = async (historyData,token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/update`, historyData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật lịch sử:', error.message);
        throw error;
    }
};
