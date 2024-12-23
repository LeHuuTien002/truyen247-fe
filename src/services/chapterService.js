import axios from "axios";
import apiUrl from "../config";

const createChapter = async (id, title, chapterNumber, token) => {
    try {
        const response = await axios.post(`${apiUrl}/api/admin/comic/${id}/chapters/create`,
            {title, chapterNumber},
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

const updateChapterByComicId = async (comicId, chapterId, title, chapterNumber, token) => {
    try {
        const response = await axios.put(`${apiUrl}/api/admin/comic/${comicId}/chapters/${chapterId}`, {
            title,
            chapterNumber
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return {success: response.data.body};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.')
        }
    }
}

const deleteChapter = async (comicId, chapterId, token) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/admin/comic/${comicId}/chapters/${chapterId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return {success: response.data.body};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.')
        }
    }
}

const getAllChapter = async (comicId, token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/admin/comic/${comicId}/chapters/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.')
        }
    }
}

const getChaptersByComicId = async (userId, comicId, token) => {
    if (userId === null) {
        try {
            const response = await axios.get(`${apiUrl}/api/public/chapters/${comicId}`)
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Đã xảy ra lỗi không xác định.')
            }
        }
    } else {
        try {
            const response = await axios.get(`${apiUrl}/api/chapters/${comicId}`, {
                params: {userId},
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Đã xảy ra lỗi không xác định.')
            }
        }
    }
}

export {createChapter, getChaptersByComicId, updateChapterByComicId, deleteChapter, getAllChapter};