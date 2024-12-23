import axios from 'axios';
import apiUrl from "../config";

const API_BASE_URL = `${apiUrl}/api/favorites`;

export const getFavorites = async (userId, token) => {
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

export const addFavorite = async (userId, comicId, token) => await axios.post(`${API_BASE_URL}/${userId}/${comicId}`, {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const removeFavorite = async (userId, comicId, token) => await axios.delete(`${API_BASE_URL}/${userId}/${comicId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const checkIsFavorite = (userId, comicId, token) => {
    return axios.get(`${API_BASE_URL}/${userId}/${comicId}/is-favorite`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};