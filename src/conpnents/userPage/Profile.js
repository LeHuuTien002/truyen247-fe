import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import avatar from './anonymous.png'
import {getUserId} from "../utils/auth";
import {createUserAvatar, getUserById} from "../../services/userService";
import Alert from "../utils/Alert";

const Profile = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadFetched, setLoadFetched] = useState(true);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [inputKey, setInputKey] = useState(Date.now());
    const [file, setFile] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleResetClick = () => {
        setPreviewUrls([])
        setInputKey(Date.now());
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreviewUrls([previewUrl]);
        } else {
            setPreviewUrls([]);
        }
    };

    const handleCreateSubmit = async (e) => {
        setErrorMessage('');
        setErrorMessage('');
        setLoading(true)
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        try {
            const {
                success: successMessage
            } = await createUserAvatar(getUserId(), formData, token);
            setSuccessMessage(successMessage);
            handleResetClick();
            await fetchUser();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    }
    const fetchUser = async () => {
        try {
            const data = await getUserById(getUserId(), token);
            console.log("user", data);
            setUser(data);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoadFetched(false)
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);

    if (loadFetched) {
        return (
            <div className="overlay">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container bg-dark pt-1 pb-1">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Thông tin chung</span>
            </span>
            <h4 className="text-warning text-center">THÔNG TIN CÁ NHÂN</h4>
            <div className="d-flex p-1 mt-3">
                <img src={user.picture === null ? avatar : user.picture} style={{width: "80px", height: "80px"}}
                     className="d-block" alt={'avatar'}/>
                <div className="d-flex flex-column justify-content-center flex-grow-1 ms-3">
                    <span>Tài khoản của</span>
                    <strong>{user.roles
                        .map((role) => role.replace("ROLE_", ""))
                        .join(", ")}</strong>
                </div>
            </div>
            <div className="border p-1 mt-3">
                <ul className="list-unstyled mb-0">
                    <li className="py-2 hover-li p-1" onClick={() => navigate('/favorites')}>
                        <i className="bi bi-bookmark me-2"></i>
                        <span className='text-decoration-none text-default'>Truyện theo dõi</span>
                    </li>
                    <li className="py-2 hover-li p-1" onClick={() => navigate('/history')}>
                        <i className="bi bi-bookmark me-2"></i>
                        <span>Lịch sử đọc truyện</span>
                    </li>
                    <li className="py-2 hover-li p-1" onClick={() => navigate('/change-password')}>
                        <i className="bi bi-key me-2"></i>
                        <span>Đổi mật khẩu</span>
                    </li>
                </ul>
            </div>

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
                    <img src={user?.picture === null ? avatar : user?.picture} style={{width: "80px", height: "80px"}}
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
                    {successMessage && (
                        <Alert message={successMessage} type='success' onClose={() => setSuccessMessage('')}/>
                    )}
                    {errorMessage && (
                        <Alert type="danger" message={errorMessage} onClose={() => setErrorMessage('')}/>
                    )}
                    {loading && (
                        <div className="overlay">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
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
                        <button type="submit"
                                className="btn btn-outline-warning form-control">{loading ? 'Đang upload Ảnh...' : 'Upload Ảnh'}
                        </button>
                    </form>
                    <span className="text-danger">Avatar tục tĩu sẽ bị khóa vĩnh viễn</span>
                </div>
            </div>
        </div>
    )
}

export default Profile;