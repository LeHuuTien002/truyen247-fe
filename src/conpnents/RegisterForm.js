import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginWithGoogle, register} from "../actions/auth";
import Alert from "./utils/Alert";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {setMessage} from "../actions/message";

const RegisterForm = () => {
    const {isLoggedIn, user: currentUser} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {message} = useSelector(state => state.message);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formSuccess, setFormSuccess] = useState(false);

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    }
    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    }
    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    }
    const onChangeConfirmPassword = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordConfirm = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    }
    const handleResetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }
    const handleRegister = (e) => {
        e.preventDefault();
        setFormSuccess(false)
        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu không trùng khớp!");
            return;
        }
        dispatch(register(username, email, password))
            .then(() => {
                setFormSuccess(true)
                handleResetForm();
            })
            .catch(() => {
                setFormSuccess(false)
            });
    }
    const handleSuccess = async (credentialResponse) => {
        setLoading(true)
        const idToken = credentialResponse.credential;
        dispatch(loginWithGoogle(idToken)).then((response) => {
            if (response && response.roles && response.roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/')
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false)
        });
    };

    const handleError = () => {
        setErrorMessage("Đăng nhập Google không thành công")
    };

    useEffect(() => {
        if (isLoggedIn) {
            if (currentUser && currentUser.roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [isLoggedIn, currentUser, navigate]);

    return (
        <div className="container bg-dark pt-5 pb-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right"></i>
                <span className="text-warning"> Đăng ký</span>
            </span>
            <form onSubmit={handleRegister} className="container p-4">
                <h2 className="text-warning text-center">Đăng ký</h2>
                <div className="mb-3 mt-3">
                    <label htmlFor="username">Tên tài khoản:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        value={username}
                        onChange={onChangeUsername}
                        required
                        minLength={3}
                        name="username"/>
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={onChangeEmail}
                        required
                        value={email}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pwd">Mật khẩu:</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="pwd"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                            required
                            minLength={6}
                        />
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
                <div className="mb-3">
                    <label htmlFor="rpwd">Nhập lại mật khẩu:</label>
                    <div className="input-group">
                        <input
                            type={showPasswordConfirm ? 'text' : 'password'}
                            className="form-control"
                            id="rpwd"
                            onChange={onChangeConfirmPassword}
                            required
                            minLength={6}
                            value={confirmPassword}
                            name="confirmPassword"
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="password-addon"
                            onClick={togglePasswordConfirm}
                            style={{borderRadius: '0 0.25rem 0.25rem 0'}}
                        >
                            {showPasswordConfirm ? (
                                <i className="bi bi-eye-slash-fill"></i>
                            ) : (
                                <i className="bi bi-eye-fill"></i>
                            )}
                        </button>
                    </div>
                </div>
                <div className="form-check mb-3 text-end">
                    <label className="form-check-label">
                        <Link className="text-decoration-none text-warning" to="/login">Đăng nhập</Link>
                    </label>
                </div>
                <button type="submit" className="btn btn-outline-warning form-control mb-3">Đăng ký</button>
                <GoogleOAuthProvider
                    clientId="874486330422-7ujmtvsvp104ufmdsmld2h3vil53av44.apps.googleusercontent.com">
                    <div>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </div>
                </GoogleOAuthProvider>
                {errorMessage && (
                    <Alert message={errorMessage} type='danger' onClose={() => setErrorMessage('')}/>
                )}
                {message && (
                    <Alert message={message} type={formSuccess ? 'success' : 'danger'}
                           onClose={() => dispatch(setMessage(''))}/>
                )}
            </form>
        </div>
    )
}

export default RegisterForm;