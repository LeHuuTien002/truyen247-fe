import axios from "axios";

const getChapterById = async (id, token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/comic/chapters/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const createPage = async (id, pageNumber, imageUrl, token) => {
    try {
        const formData = new FormData();
        // Tạo đối tượng ComicRequest và chuyển thành Blob
        const pageRequest = {
            pageNumber: pageNumber
        };
        formData.append("pageRequest", new Blob([JSON.stringify(pageRequest)], {type: "application/json"}));

        // Thêm file vào formData
        formData.append("file", imageUrl);
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

const updatePage = async (pageId, pageNumber, imageUrl, token) => {
    try {
        const formData = new FormData();
        // Tạo đối tượng ComicRequest và chuyển thành Blob
        const pageRequest = {
            id: pageId,
            pageNumber: pageNumber
        };
        formData.append("pageRequest", new Blob([JSON.stringify(pageRequest)], {type: "application/json"}));

        // Thêm file vào formData
        formData.append("file", imageUrl);
        const response = await axios.put(`http://localhost:8080/api/admin/comic/chapter/pages/${pageId}/update`,
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

const getAllPageByChapterId = async (id, token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/comic/chapter/${id}/pages`,
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

export {getChapterById, createPage, getAllPageByChapterId, updatePage, deletePage};

