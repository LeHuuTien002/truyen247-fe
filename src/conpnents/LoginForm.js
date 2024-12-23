import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {login, loginWithGoogle} from "../actions/auth";

import Alert from "./utils/Alert";
import {setMessage} from "../actions/message";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

const LoginForm = () => {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const {message} = useSelector(state => state.message);
    const {isLoggedIn, user: currentUser} = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    }

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true);


        dispatch(login(email, password))
            .then((response) => {
                if (response && response.roles && response.roles.includes('ROLE_ADMIN')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

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
        console.error("Google Login Failed");
        setLoading(false)
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
                <span className="text-warning"> Đăng nhập</span>
            </span>
            {message && (
                <Alert message={message} type="danger" onClose={() => dispatch(setMessage(''))}/>
            )}
            <form onSubmit={handleLogin} className="p-4 container">
                <h2 className="text-warning text-center">Đăng nhập</h2>
                <div className="mb-3 mt-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={onChangeEmail}
                        value={email}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pwd" className="form-label">Mật khẩu:</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="pwd"
                            name="password"
                            aria-describedby="password-addon"
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

                <div className="form-check mb-3 text-end">
                    <label className="form-check-label me-3">
                        <Link className="text-decoration-none text-warning" to="/forgot-password">Quên mật khẩu </Link>
                    </label>
                    <label className="form-check-label">
                        <Link className="text-decoration-none text-warning" to="/register"> Đăng ký</Link>
                    </label>
                </div>
                <button disabled={loading} type="submit" className="btn btn-outline-warning form-control mb-3">
                    {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Đăng nhập</span>
                </button>
                <GoogleOAuthProvider
                    clientId="874486330422-7ujmtvsvp104ufmdsmld2h3vil53av44.apps.googleusercontent.com">
                    <div>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </div>
                </GoogleOAuthProvider>
            </form>
        </div>
    )
}

export default LoginForm;