import axios from "axios";
import apiUrl from "../config";

const createComic = async (name, otherName, status, content, author, activate, updatedGenres, file, token) => {
    console.log(name, content, author, activate, updatedGenres, file, token);
    try {
        const formData = new FormData();
        const comicRequest = {
            name: name,
            otherName: otherName,
            status: status,
            content: content,
            author: author,
            activate: activate,
            genreIds: updatedGenres
        };
        formData.append("comicRequest", new Blob([JSON.stringify(comicRequest)], {type: "application/json"}));

        formData.append("file", file);
        const response = await axios.post(`${apiUrl}/api/admin/comics/create`,
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

const updateComic = async (id, name, otherName, status, content, author, activate, updatedGenres, file, token) => {
    console.log(id, name, content, author, activate, updatedGenres, file, token);
    try {
        const formData = new FormData();
        const comicRequest = {
            id: id,
            name: name,
            otherName: otherName,
            status: status,
            content: content,
            author: author,
            activate: activate,
            genreIds: updatedGenres
        };
        formData.append("comicRequest", new Blob([JSON.stringify(comicRequest)], {type: "application/json"}));

        formData.append("file", file);
        const response = await axios.put(`${apiUrl}/api/admin/comics/${id}/update`,
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

const deleteComic = async (id, token) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/admin/comics/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return {
            success: response.data.body,
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
}

// Admin
const getAllComics = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/admin/comics/list`,
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

// Public
const getAllComicsIsActive = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/comics/list`)
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const getComicById = async (comicId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/comics/${comicId}`)
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const getInfoComicForChapterList = async (comicId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/comics/${comicId}/chapters`)
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const getComicsByGenre = async (genreName) => {
    let url = `${apiUrl}/api/public/comics/list`;
    if (genreName !== "Tất cả") {
        url = `${apiUrl}/api/public/comics/genre${genreName}`;
    }
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
};

const searchComics = async (comicName) => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/comics/search`, {
            params: {name: comicName}
        });
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
};

const getTopComicView = async (userId, token) => {
    try {
        const response = await axios.get(`${apiUrl}/api/public/top-comics-view`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Lỗi từ phía server.");
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
};


export {
    createComic,
    getAllComics,
    getComicById,
    updateComic,
    deleteComic,
    getComicsByGenre,
    searchComics,
    getAllComicsIsActive,
    getInfoComicForChapterList,
    getTopComicView
};