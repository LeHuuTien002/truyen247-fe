import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginWithGoogle, register} from "../actions/auth";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {isEmail} from "validator";
import Alert from "./utils/Alert";
import {setMessage} from "../actions/message";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger">
                Trường này là bắt buộc!
            </div>
        )
    }
}
const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger">
                Đây không phải là một Email hợp lệ.
            </div>
        )
    }
}
const validUsername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger">
                Tên người dùng phải có từ 3 đến 20 ký tự.
            </div>
        )
    }
}
const validPassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger">
                Mật khẩu phải dài từ 6 đến 40 ký tự.
            </div>
        )
    }
}
const RegisterForm = () => {
    const {isLoggedIn, user: currentUser} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const form = useRef();
    const checkBtn = useRef();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const {message} = useSelector(state => state.message);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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
    const handleRegister = (e) => {
        e.preventDefault();

        setSuccessful(false);

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu không trùng khớp!");
            return;
        }

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(register(username, email, password))
                .then(() => {
                    setSuccessful(true);
                    setSuccessMessage(message)
                    navigate("/login")
                    alert("Đăng ký thành công!");
                    window.location.reload();
                })
                .catch(() => {
                    setErrorMessage(message)
                    setSuccessful(false);
                });
        }
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
        console.error("Google Login Failed");
    };

    // Tự động chuyển hướng nếu đã đăng nhập
    useEffect(() => {
        if (isLoggedIn) {
            if (currentUser && currentUser.roles.includes('ROLE_ADMIN')) {
                navigate('/admin'); // Chuyển đến /admin nếu là ADMIN
            } else {
                navigate('/'); // Chuyển đến trang chủ nếu không phải ADMIN
            }
        }
    }, [isLoggedIn, currentUser, navigate]);

    return (
        <div className="container bg-dark p-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right"></i>
                <span className="text-warning"> Đăng ký</span>
            </span>
            <Form onSubmit={handleRegister} ref={form} className="container p-4">
                {!successful && (
                    <>
                        <h2 className="text-warning text-center">Đăng ký</h2>
                        <div className="mb-3 mt-3">
                            <label htmlFor="username">Tên tài khoản:</label>
                            <Input
                                type="text"
                                className="form-control"
                                id="email"
                                value={username}
                                onChange={onChangeUsername}
                                validations={[required, validUsername]}
                                name="username"/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label htmlFor="email">Email:</label>
                            <Input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={onChangeEmail}
                                validations={[required, validEmail]}
                                value={email}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pwd">Mật khẩu:</label>
                            <Input
                                type="password"
                                className="form-control"
                                id="pwd"
                                name="password"
                                value={password}
                                onChange={onChangePassword}
                                validations={[required, validPassword]}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rpwd">Nhập lại mật khẩu:</label>
                            <Input
                                type="password"
                                className="form-control"
                                id="rpwd"
                                onChange={onChangeConfirmPassword}
                                validations={[required]}
                                value={confirmPassword}
                                name="confirmPassword"
                            />
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
                        <CheckButton style={{display: "none"}} ref={checkBtn}/>
                    </>
                )}
                {successMessage && (
                    <Alert
                        message={successMessage}
                        type="success"
                        onClose={() => setSuccessMessage('')}
                    />
                )}
                {errorMessage && (
                    <Alert
                        message={errorMessage}
                        type="danger"
                        onClose={() => setErrorMessage('')}
                    />
                )}

                <CheckButton style={{display: "none"}} ref={checkBtn}/>
            </Form>
        </div>
    )
}

export default RegisterForm;