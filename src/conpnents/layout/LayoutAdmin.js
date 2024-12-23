import {Link, Outlet, useLocation} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../../actions/message";
import {logout} from "../../actions/auth";
import EventBus from "../../common/EventBus";
import AuthVerify from "../../common/AuthVerify";

const LayoutAdmin = () => {
    const [showAdminBoard, setShowAdminBoard] = useState(false);

    const {user: currentUser} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    let location = useLocation();

    useEffect(() => {
        if (["/login", "/register"].includes(location.pathname)) {
            dispatch(clearMessage());
        }
    }, [dispatch, location]);

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch])

    useEffect(() => {
        if (currentUser) {
            setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
        } else {
            setShowAdminBoard(false);
        }

        EventBus.on("logout", () => {
            logOut();
        })
        return () => {
            EventBus.remove("logout");
        }
    }, [currentUser, logOut]);
    return (
        <div>
            {<AuthVerify logOut={logOut}/>}
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/admin">
                        <h1 className="text-warning">ADMIN BOARD</h1>
                    </Link>
                    <div className="d-flex justify-content-end collapse navbar-collapse">
                        <div className="d-none d-sm-block d-md-block d-lg-block nav-item dropdown">
                            <span className="dropdown dropdown-menu-end text-end">
                                <a className="text-decoration-none dropdown-toggle text-white" href="#"
                                   role="button"
                                ><i className="bi bi-person-fill"></i> Tài khoản</a>
                                    <ul className="dropdown-menu" style={{zIndex: 9999}}>
                                        {currentUser ? (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" href="#" to="/profile">
                                                        <i className="bi bi-person-fill"></i> Trang cá nhân
                                                    </Link>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#" onClick={logOut}>
                                                        <i className="bi bi-box-arrow-right"></i> Thoát
                                                    </a>
                                                </li>
                                            </>

                                        ) : (
                                            <>
                                                <li>
                                                    <Link to="/login" className="dropdown-item" href="#">
                                                        <i className="bi bi-person-fill"></i> Đăng nhập
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/register" className="dropdown-item" href="#">
                                                        <i className="bi bi-person-plus-fill"></i> Đăng ký
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </span>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="bg-danger sticky-top">
                <nav className="container navbar navbar-expand-sm navbar-dark">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapsibleNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="collapsibleNavbar">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" href="#" to='/admin/genres'>QUẢN LÝ THỂ LOẠI</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/comics" className="nav-link" href="#">QUẢN LÝ TRUYỆN</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/users" className="nav-link" href="#">QUẢN LÝ TÀI KHOẢN</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/payments" className="nav-link" href="#">QUẢN LÝ GIAO DỊCH</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/QRpayment" className="nav-link" href="#">QUẢN LÝ PHƯƠNG THỨC THANH
                                        TOÁN</Link>
                                </li>
                                <div className="d-block d-sm-none d-md-none d-lg-none">
                                    <div className="nav-item dropdown dropdown-menu-end">
                                        <a className="nav-link dropdown-toggle text-white" href="#" role="button"
                                           data-bs-toggle="dropdown"><i className="bi bi-person-fill"></i> Tài khoản</a>
                                        <ul className="dropdown-menu" style={{zIndex: 9999}}>
                                            {currentUser ? (
                                                <>
                                                    <li>
                                                        <Link className="dropdown-item" href="#" to="/profile">
                                                            <i className="bi bi-person-fill"></i> Trang cá nhân
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#" onClick={logOut}>
                                                            <i className="bi bi-box-arrow-right"></i> Thoát
                                                        </a>
                                                    </li>
                                                </>

                                            ) : (
                                                <>
                                                    <li>
                                                        <Link to="/login" className="dropdown-item" href="#">
                                                            <i className="bi bi-person-fill"></i> Đăng nhập
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/register" className="dropdown-item" href="#">
                                                            <i className="bi bi-person-plus-fill"></i> Đăng ký
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <Outlet/>
            <div className="container-fluid bg-dark d-flex justify-content-center">
                <div className="row container mt-2">
                    <div className="col-sm-3">
                        <h5 className="text-warning">Truyen247</h5>
                        <div>
                            <span className="text-warning">Giới thiệu</span> |
                            <span className="text-warning"> Liên hệ</span>
                        </div>
                        <div>
                            <span className="text-warning">Điều Khoản</span> |
                            <span className="text-warning"> Chính Sách Bảo Mật</span>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <h5>Liên hệ</h5>
                        <span className="d-block"> Email: <a className="text-warning">truyen247@gmail.com</a></span>
                        <span className="d-block"> Telegram: <a className="text-warning">@truyen247</a></span>
                        <span className="d-block"> Copyright © 2024 Truyen247</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutAdmin;