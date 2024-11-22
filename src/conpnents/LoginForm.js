import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {login} from "../actions/auth";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Alert from "./utils/Alert";
import {setMessage} from "../actions/message";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger">
                Trường này là bắt buộc!
            </div>
        )
    }
}

const validatePassword = (value) => {
    if (value.length < 6) {
        return (
            <div className="alert alert-danger">
                Mật khẩu phải có ít nhất 6 ký tự.
            </div>
        )
    }
}
const LoginForm = () => {
    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(email, password))
                .then((response) => {
                    // Dùng response trả về từ action login để kiểm tra vai trò
                    if (response && response.roles && response.roles.includes('ROLE_ADMIN')) {
                        navigate('/admin'); // Chuyển đến trang /admin nếu là ADMIN
                    } else {
                        navigate('/'); // Chuyển đến trang chủ nếu không phải ADMIN
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
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
                <span className="text-warning"> Đăng nhập</span>
            </span>
            {message && (
                <Alert
                    message={message}
                    type="danger"
                    onClose={() => setMessage('')}
                />
            )}
            <Form onSubmit={handleLogin} ref={form} className="container p-4">
                <h2 className="text-warning text-center">Đăng nhập</h2>
                <div className="mb-3 mt-3">
                    <label htmlFor="email">Email:</label>
                    <Input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={onChangeEmail}
                        value={email}
                        validations={[required]}
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
                        validations={[required, validatePassword]}/>
                </div>
                <div className="form-check mb-3 text-end">
                    <label className="form-check-label me-3">
                        <Link className="text-decoration-none text-warning" to="/repassword">Quên mật khẩu </Link>
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
                <button type="submit" className="btn btn-outline-danger form-control">Đăng nhập bằng tài khoản google
                </button>
                <CheckButton style={{display: "none"}} ref={checkBtn}/>
            </Form>
        </div>
    )
}

export default LoginForm;