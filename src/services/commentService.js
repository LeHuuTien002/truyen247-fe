import axios from "axios";
import apiUrl from "../config";

const API_BASE_URL = `${apiUrl}/api/comments`;

export const addComment = async (comment, token) => {
    try {
        const response = await axios.post(API_BASE_URL,
            comment,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
};

export const replyToComment = async (payload,token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reply`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response.data);
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
};

export const deleteComment = async (id, userId,token) => {
    if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`,
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


export const fetchComments = async (comicId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/comments/${comicId}`)
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}