import {Link} from "react-router-dom";
import React, {useState} from "react";
import {forgotPassword} from "../services/userService";
import Alert from "./utils/Alert";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const data = await forgotPassword(email);
            if (data.status === 200) {
                setSuccessMessage(data.message);
                setEmail('');
            } else {
                setErrorMessage(data.message);
            }
        } catch (e) {
            setErrorMessage(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container bg-dark pt-5 pb-5">
            <span> <Link to="/login" className="text-decoration-none">Đăng nhập </Link>
                <i className="bi bi-chevron-double-right"></i>
                <span className="text-warning"> Quên mật khẩu</span>
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
            <form className="container p-1" onSubmit={handleSubmit}>
                <h2 className="text-warning text-center">Quên mật khẩu</h2>
                <div className="mt-3">
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           className="form-control" id="email" placeholder="Nhập email đăng ký tài khoản" name="email"
                           required/>
                </div>
                <button type="submit" className="btn btn-outline-warning form-control mt-2">{loading ? 'Đang gửi...' : 'Gửi'}</button>
            </form>
        </div>
    )
}

export default ForgotPassword;