import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/favorites';
const token = localStorage.getItem('token');

export const getFavorites = async (userId) => {
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

export const addFavorite = async (userId, comicId) => axios.post(`${API_BASE_URL}/${userId}/${comicId}`, {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const removeFavorite = async (userId, comicId) => axios.delete(`${API_BASE_URL}/${userId}/${comicId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const checkIsFavorite = (userId, comicId) => {
    return axios.get(`${API_BASE_URL}/${userId}/${comicId}/is-favorite`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};