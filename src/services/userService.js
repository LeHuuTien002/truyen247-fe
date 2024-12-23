import axios from 'axios';
import apiUrl from "../config";

export const forgotPassword = async (email) => {
    console.log(email)
    try {
        const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, null, {
            params: {email}
        })
        return response.data;
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${apiUrl}/api/auth/reset-password`, null, {
            params: {token, newPassword}
        })
        return response.data;
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}

export const changePassword = async (email, oldPassword, newPassword, token) => {
    try {
        const response = await axios.put(`${apiUrl}/api/users/change-password`, {email, oldPassword, newPassword}, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}

export const getUserById = async (userId, token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

export const createUserAvatar = async (id, formData, token) => {
    try {
        const response = await axios.post(`${apiUrl}/api/users/${id}/avatar`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
        return {
            success: response.data
        };
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

export const getAllUser = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/admin/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

export const updateUser = async (id, active, token) => {
    try {
        const response = await axios.put(`${apiUrl}/api/admin/users/${id}`,
            {active},
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        console.log(response.data)
        return {
            success: response.data,
        };
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

export const deleteUser = async (id, token) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return {
            success: response.data,
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}