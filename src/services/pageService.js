import axios from "axios";

const getPagesByChapterId = async (comicId, token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/comic/chapters/${comicId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const createPage = async (id, formData, token) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/admin/comic/chapter/${id}/create`,
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
const deletePage = async (chapterId, pageId, token) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/comic/chapter/${chapterId}/pages/${pageId}`, {
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

const getAllPageByChapterId = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/public/comic/chapter/${id}/pages`)
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const getPageByChapterId = async (id, token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/comic/chapter/${id}/pages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

export {getPagesByChapterId, createPage, getAllPageByChapterId, deletePage, getPageByChapterId};

