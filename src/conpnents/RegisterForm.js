import {Link, useNavigate} from "react-router-dom";
import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {register} from "../actions/auth";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {isEmail} from "validator";
import Alert from "./Alert";
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
    const form = useRef();
    const checkBtn = useRef();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successful, setSuccessful] = useState(false);
    const {message} = useSelector(state => state.message);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            setError("Mật khẩu không trùng khớp!");
            return;
        }

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(register(username, email, password))
                .then(() => {
                    setSuccessful(true);
                    setMessage("Đã đăng ký thành công!");
                    navigate("/login")
                    alert("Đăng ký thành công!");
                    window.location.reload();
                })
                .catch(() => {
                    setSuccessful(false);
                });
        }
    }
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
                        <button type="submit" className="btn btn-outline-danger form-control mb-3">Đăng ký bằng tài
                            khoản google
                        </button>
                    </>
                )}
                {message && (
                    <Alert
                        message={message}
                        type="danger"
                        onClose={() => setMessage('')}
                    />
                )}
                {error && (
                    <Alert
                        message={error}
                        type="danger"
                        onClose={() => setError('')}
                    />
                )}

                <CheckButton style={{display: "none"}} ref={checkBtn}/>
            </Form>
        </div>
    )
}

export default RegisterForm;