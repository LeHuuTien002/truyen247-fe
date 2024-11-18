// src/utils/auth.js
export const getUserId = () => {
    try {
        const userString = localStorage.getItem("user"); // Lấy dữ liệu từ localStorage
        if (userString) {
            const userObject = JSON.parse(userString); // Chuyển chuỗi JSON thành object
            return userObject.id; // Trả về ID của người dùng
        }
        return null; // Không có dữ liệu user
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null; // Trả về null nếu có lỗi
    }
};
