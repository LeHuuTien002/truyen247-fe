import axios from 'axios';
import apiUrl from "../config";

const getAllGenre = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/genres`);
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};

const getAllGenreName = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/genres-name`);
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
};

const getAllGenreByComicId = async (comicId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/comic/${comicId}/genres`)
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
}


const createGenre = async (name, description, token) => {
    try {
        const response = await axios.post(`${apiUrl}/api/admin/genres`,
            {name, description},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        return {success: response.data.body};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

const updateGenre = async (id, name, description, token) => {
    try {
        const response = await axios.put(
            `http://localhost:8080/api/admin/genres/${id}`,
            {name, description},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {success: response.data.body};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
};

const deleteGenre = async (id, token) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/genres/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return {success: response.data.body};
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}
export {getAllGenre, updateGenre, createGenre, deleteGenre, getAllGenreByComicId, getAllGenreName};

