import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {Link, useNavigate} from "react-router-dom";
import {resetPassword} from "../services/userService";
import Alert from "./utils/Alert";

const ResetPassword = () => {
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [token, setToken] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const resetToken = params.get("token");
        setToken(resetToken);
    }, [location]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const data = await resetPassword(token, newPassword);
            if (data.status === 200) {
                setNewPassword('');
                setSuccessMessage(data.message)
            } else {
                setErrorMessage(data.message);
            }
        } catch (e) {
            setErrorMessage(e.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container pt-5 pb-5 bg-dark">
            <span> <Link to="/login" className="text-decoration-none">Đăng nhập </Link>
                <i className="bi bi-chevron-double-right"></i>
                <span className="text-warning"> Đặt lại mật khẩu</span>
            </span>
            {successMessage && (
                <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')}/>
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
            <form className="container p-4" onSubmit={handleSubmit}>
                <h2 className="text-warning text-center">Đặt lại mật khẩu</h2>
                <div className="mt-3">
                    <label className="form-label" htmlFor="email">Mật khẩu mới:</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            id="email"
                            placeholder="Nhập mật khẩu mới"
                            name="email"
                            required/>
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="password-addon"
                            onClick={togglePasswordVisibility}
                            style={{borderRadius: '0 0.25rem 0.25rem 0'}}
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-slash-fill"></i>
                            ) : (
                                <i className="bi bi-eye-fill"></i>
                            )}
                        </button>
                    </div>
                </div>
                <button type="submit"
                        className="btn btn-outline-warning form-control mt-2">{loading ? 'Đang gửi...' : 'Gửi'}</button>
            </form>
        </div>
    );
};

export default ResetPassword;
