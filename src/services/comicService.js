import axios from "axios";

const createComic = async (name, otherName, status, content, author, activate, updatedGenres, file, token) => {
    try {
        const formData = new FormData();
        // Tạo đối tượng ComicRequest và chuyển thành Blob
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

        // Thêm file vào formData
        formData.append("file", file);
        const response = await axios.post('http://localhost:8080/api/admin/comics/create',
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

const updateComic = async (id, name, otherName, status, content, author, activate, updatedGenres, file,token) => {
    try {
        const formData = new FormData();
        // Tạo đối tượng ComicRequest và chuyển thành Blob
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

        // Thêm file vào formData
        formData.append("file", file);
        const response = await axios.put(`http://localhost:8080/api/admin/comics/${id}/update`,
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

const deleteComic = async (id,token) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/comics/${id}/delete`, {
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
        const response = await axios.get("http://localhost:8080/api/admin/comics/list",
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
        const response = await axios.get("http://localhost:8080/api/public/comics/list")
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const getComicById = async (comicId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/public/comics/${comicId}`)
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
}

const getComicsByGenre = async (genreName) => {
    let url = "http://localhost:8080/api/public/comics/list";
    if (genreName !== "Tất cả") {
        url = `http://localhost:8080/api/public/comics/genre${genreName}`;
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
        const response = await axios.get(`http://localhost:8080/api/public/comics/search?name=${comicName}`);
        return response.data;
    } catch (error) {
        throw new Error("Có lỗi xảy ra khi tải dữ liệu!");
    }
};


export {createComic, getAllComics, getComicById, updateComic, deleteComic, getComicsByGenre, searchComics, getAllComicsIsActive};