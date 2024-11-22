import axios from "axios";

const token = localStorage.getItem("token");

const createChapter = async (id, title, chapterNumber) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/admin/comic/${id}/chapters/create`,
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

const updateChapterByComicId = async (comicId, chapterId, title, chapterNumber) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/admin/comic/${comicId}/chapters/${chapterId}`, {
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

const deleteChapter = async (comicId, chapterId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/comic/${comicId}/chapters/${chapterId}`, {
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

const getChaptersByComicId = async (comicId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/comic/${comicId}/chapters/list`, {
            headers: {
                authorization: `Bearer ${token}`,
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

export {createChapter, getChaptersByComicId, updateChapterByComicId, deleteChapter};