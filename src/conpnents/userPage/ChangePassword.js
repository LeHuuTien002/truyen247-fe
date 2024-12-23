import {Link} from "react-router-dom";
import React, {useState} from "react";
import {changePassword} from "../../services/userService";
import Alert from "../utils/Alert";

const ChangePassword = () => {
    const token = localStorage.getItem('token');
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const toggleShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };
    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    }

    const handleResetForm = () => {
        setEmail("");
        setOldPassword("");
        setNewPassword("");
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const data = await changePassword(email, oldPassword, newPassword, token);
        if (data.status === 200) {
            setSuccessMessage(data.message);
            handleResetForm();
        } else {
            setErrorMessage(data.message);
        }
    }

    return (
        <div className="container pt-5 pb-5 bg-dark">
            <span> <Link to="/profile" className="text-decoration-none">Trang cá nhân </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Thay đổi mật khẩu</span>
            </span>

            {successMessage && (
                <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")}/>
            )}
            {errorMessage && (
                <Alert type="danger" message={errorMessage} onClose={() => setErrorMessage("")}/>
            )}
            <form className="container" onSubmit={handleChangePassword}>
                <div className="mb-3 mt-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label" htmlFor="oldPassword">Mật khẩu cũ:</label>
                    <div className="input-group">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            className="form-control"
                            id="oldPassword"
                            name="oldPassword"
                            required
                            onChange={(e) => setOldPassword(e.target.value)}
                            value={oldPassword}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="password-addon"
                            onClick={toggleShowOldPassword}
                            style={{borderRadius: '0 0.25rem 0.25rem 0'}}
                        >
                            {showOldPassword ? (
                                <i className="bi bi-eye-slash-fill"></i>
                            ) : (
                                <i className="bi bi-eye-fill"></i>
                            )}
                        </button>
                    </div>
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label" htmlFor="newPassword">Mật khẩu mới:</label>
                    <div className="input-group">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            required
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="password-addon"
                            onClick={toggleShowNewPassword}
                            style={{borderRadius: '0 0.25rem 0.25rem 0'}}
                        >
                            {showNewPassword ? (
                                <i className="bi bi-eye-slash-fill"></i>
                            ) : (
                                <i className="bi bi-eye-fill"></i>
                            )}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-outline-warning form-control mb-3">Đổi mật khẩu</button>
            </form>
        </div>
    )
}

export default ChangePassword