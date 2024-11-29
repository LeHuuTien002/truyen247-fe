import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import avatar from './anonymous.png'
import {getUserId} from "../utils/auth";
import {createUserAvatar, getUserById} from "../../services/userService";

const Profile = () => {
    const token = localStorage.getItem("token");
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState(null); // Dữ liệu user
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi
    const toggleMenu = () => {
        setIsVisible(!isVisible);
    };
    const [previewUrls, setPreviewUrls] = useState([]); // Lưu các URL để hiển thị ảnh xem trước
    const [inputKey, setInputKey] = useState(Date.now()); // Key để làm mới trường file
    const [file, setFile] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleResetClick = () => {
        setPreviewUrls([])
        setInputKey(Date.now()); // Đặt lại key để làm mới trường file
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; // Lấy file đầu tiên
        setFile(selectedFile);

        // Tạo URL để xem trước file
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreviewUrls([previewUrl]); // Lưu URL xem trước dưới dạng mảng (chỉ 1 file)
        } else {
            setPreviewUrls([]);
        }
    };

    const handleCreateSubmit = async (e) => {
        setErrorMessage('');
        setErrorMessage('');
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        try {
            const {
                success: successMessage
            } = await createUserAvatar(getUserId(), formData, token);
            setSuccessMessage(successMessage);
            handleResetClick();
            fetchUser();
        } catch (error) {
            setErrorMessage(error.message);
        }
    }
    const fetchUser = async () => {
        try {
            const response = await getUserById(getUserId());
            console.log(response)
            setUser(response); // Lưu dữ liệu user
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    // Fetch user data từ API
    useEffect(() => {
        fetchUser();
    }, [token]);

    // Loading state
    if (loading) {
        return <p>Loading...</p>;
    }

    // Error state
    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
        <div className="container bg-dark p-3">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Thông tin chung</span>
            </span>
            <div className="d-flex p-1 mt-3" onClick={toggleMenu}>
                <img src={user.picture === null ? avatar : user.picture} style={{width: "80px", height: "80px"}}
                     className="d-block" alt={'avatar'}/>
                <div className="d-flex flex-column justify-content-center flex-grow-1 ms-3">
                    <span>Tài khoản của</span>
                    <strong>{user.roles
                        .map((role) => role.replace("ROLE_", ""))
                        .join(", ")}</strong>
                </div>
                <span className="align-self-center">
                    <i className={`bi bi-chevron-${isVisible ? "up" : "down"}`}></i>
                </span>
            </div>
            {isVisible && (
                <div
                    className="bg-white text-dark mt-2 p-2 rounded shadow"
                    style={{
                        minWidth: "200px",
                        zIndex: "1000",
                        right: "0", // Căn sang phải cho giao diện đẹp
                    }}
                >
                    <ul className="list-unstyled mb-0">
                        <li className="py-2">
                            <i className="bi bi-bookmark me-2"></i>
                            <Link to={'/favorites'} className='text-decoration-none'>Truyện theo dõi</Link>
                        </li>
                        <li className="py-2">
                            <i className="bi bi-key me-2"></i>
                            <span>Đổi mật khẩu</span>
                        </li>
                        <li className="py-2">
                            <i className="bi bi-box-arrow-right me-2"></i>
                            <span>Thoát</span>
                        </li>
                    </ul>
                </div>
            )}
            <div className="mt-3">
                <h3 className="border-bottom pb-2">Thông tin chung</h3>
            </div>
            <div className="mt-3">
                <h5 className="border-start ps-2 border-5 border-danger">Thông tin tài khoản</h5>
            </div>
            <div className="p-3 d-flex border mt-1">
                <div className="d-flex flex-column">
                    <span>Họ và tên</span>
                    <span>Email</span>
                    <span>Tài khoản</span>
                    <span>Gói Premium</span>
                    <span>Ngày hết hạn</span>
                </div>
                <div className="d-flex flex-column ms-5">
                    <span>{user.username}</span>
                    <span>{user.email}</span>
                    <span>{user.registrationType}</span>
                    <span>{user.premium ? "Đã kích hoạt" : "Chưa kích hoạt"}</span>
                    <span>{user.premiumExpiryDate}</span>
                </div>
            </div>
            <div className="mt-3">
                <h5 className="border-start ps-2 border-5 border-danger">Avatar</h5>
            </div>
            <div className="p-3 d-flex border mt-1">
                <div>
                    <img src={user.picture === null ? avatar : user.picture} style={{width: "80px", height: "80px"}}
                         className="d-block" alt={'avatar'}/>
                    {previewUrls.length > 0 && (
                        <div className="mt-3">
                            <span className="mb-3">Ảnh Xem Trước</span>
                            <div className="d-flex flex-wrap gap-3">
                                {previewUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="shadow-sm border"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center ms-3">
                    <form className="" onSubmit={handleCreateSubmit}>
                        <div className="mb-3 input-group">
                            <label htmlFor="coverPhoto" className="input-group-text">Upload Ảnh: </label>
                            <input type="file"
                                   required
                                   onChange={handleFileChange}
                                   className="form-control"
                                   key={inputKey}
                                   id="coverPhoto"/>
                        </div>
                        <button type="submit" className="btn btn-outline-warning form-control">Upload Ảnh
                        </button>
                    </form>
                    <span className="text-danger">Avatar tục tĩu sẽ bị khóa vĩnh viễn</span>
                </div>
            </div>
        </div>
    )
}

export default Profile;