import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/public/users';

export const getUserById = async (userId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`, {
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
        const response = await axios.post(`http://localhost:8080/api/public/users/${id}/avatar`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
        return {
            success: response.data.body,
        };
    } catch (error) {
        // Trả về lỗi nếu có
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

// Admin
export const getAllUser = async (token) => {
    try {
        const response = await axios.get("http://localhost:8080/api/admin/users",
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
        const response = await axios.put(`http://localhost:8080/api/admin/users/${id}`,
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
        const response = await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
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