import axios from 'axios';

const token = localStorage.getItem('token');

const getAllGenre = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/admin/genres', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!'); // Ném lỗi để xử lý ở component
    }
};

const getAllGenreName = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/genres', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!'); // Ném lỗi để xử lý ở component
    }
};

const getAllGenreByComicId = async (comicId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/comic/${comicId}/genres`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tải dữ liệu!');
    }
}

// Hàm tạo thể loại mới
const createGenre = async (name, description) => {
    try {
        const response = await axios.post('http://localhost:8080/api/admin/genres',
            {name, description},
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

// Hàm cập nhật thể loại
const updateGenre = async (id, name, description) => {
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

        return {success: response.data.body}; // Trả về kết quả thành công và danh sách mới
    } catch (error) {
        // Trả về lỗi nếu có
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Đã xảy ra lỗi không xác định.');
        }
    }
};

const deleteGenre = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/genres/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        // Gọi hàm fetchTheLoai để làm mới danh sách
        return {success: response.data.body}; // Trả về kết quả thành công và danh sách mới
    } catch (error) {
        throw new Error('Đã xảy ra lỗi không xác định.');
    }
}
export {getAllGenre, updateGenre, createGenre, deleteGenre, getAllGenreByComicId, getAllGenreName};

