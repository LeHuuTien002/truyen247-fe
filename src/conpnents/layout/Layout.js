import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../../actions/message";
import {logout} from "../../actions/auth";
import EventBus from "../../common/EventBus";
import AuthVerify from "../../common/AuthVerify";
import {getAllGenreName} from "../../services/genreService";
import chunkArray from "../utils/chunkArray";
import {getAllComicsIsActive} from "../../services/comicService";

const Layout = () => {
    const token = localStorage.getItem("token");

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
        navigate('/')
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

    const [genreList, setGenreList] = useState([]);
    const loadGenreNameList = async () => {
        try {
            const data = await getAllGenreName();
            setGenreList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    const genreGroups = chunkArray(genreList, 3);
    useEffect(() => {
        loadGenreNameList();
    }, []);

    const [comicList, setComicList] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
        setSearchTerm('');
        setSuggestions([]);
    };

    const handleReset = () => {
        if (searchTerm.trim() === '') {
            return false;
        } else {
            setSearchTerm('');
            setSuggestions([]);
            return true;
        }
    }

    const loadComic = async () => {
        try {
            const data = await getAllComicsIsActive();
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    useEffect(() => {
        loadComic();
    }, []);
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setSuggestions([]);
        } else {
            const filteredSuggestions = comicList.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        }
    };
    return (
        <>
            <div>
                {<AuthVerify logOut={logOut}/>}
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <div className="container ps-4 pe-4">
                        <Link className="navbar-brand" to="/">
                            <h1 className="text-warning">Truyen247</h1>
                        </Link>
                        <div className="d-flex justify-content-end collapse navbar-collapse">
                            <div className="flex-grow-1 ps-5 pe-5 d-none d-sm-block d-md-block d-lg-block">
                                <div className="position-relative">
                                    <div className="d-flex">
                                        <input
                                            value={searchTerm}
                                            onChange={handleInputChange}
                                            className="form-control me-2"
                                            type="text"
                                            placeholder="Tìm truyện..."
                                            required
                                        />
                                        <Link to={`/search/${searchTerm}`} onClick={(e) => {
                                            if (!handleReset()) {
                                                e.preventDefault();
                                            }
                                        }}
                                              className="btn btn-outline-warning"
                                              type="button">Search
                                        </Link>
                                    </div>
                                    {suggestions.length > 0 && (
                                        <ul className="list-group position-absolute w-100 mt-1 shadow"
                                            style={{zIndex: 1050}}>
                                            {suggestions.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="list-group-item list-group-item-action"
                                                    style={{cursor: "pointer"}}
                                                    onClick={() => handleNavigateComicDetailClick(item.id)}
                                                >
                                                    <strong>{item.name}</strong> - {item.author}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="d-none d-sm-none d-md-block d-lg-block">
                                <Link to={'/premium'}
                                      className="text-decoration-none text-default hover-text me-3 d-flex"
                                      title="Nâng cấp tài khoản">
                                    <i className="bi bi-magic"></i>
                                    <span className="ms-1"> Premium</span>
                                </Link>
                            </div>
                            <div className="d-none d-sm-block d-md-block d-lg-block nav-item dropdown">
                                <span className=" dropdown-menu-end text-end">
                                    <a className="text-decoration-none dropdown-toggle text-default hover-text" href="#"
                                       role="button"><i className="bi bi-person-fill"></i> Tài khoản</a>
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
            </div>
            <div className="bg-danger sticky-top">
                <nav className="container navbar navbar-expand-sm navbar-dark">
                    <div className="container ps-4 pe-4">
                        <a className="navbar-brand" href="#"><i className="bi bi-house-fill"></i></a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapsibleNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="collapsibleNavbar">
                            <ul className="navbar-nav">
                                <div className="d-block col d-sm-none d-md-none d-lg-none">
                                    <div className="d-flex mt-2">
                                        <input
                                            value={searchTerm}
                                            onChange={handleInputChange}
                                            className="form-control me-2"
                                            type="text"
                                            placeholder="Tìm truyện..."
                                        />
                                        <Link to={`/search/${searchTerm}`} onClick={() => handleReset()}
                                              className="btn btn-outline-warning"
                                              type="button">Search
                                        </Link>
                                    </div>
                                </div>
                                <li className="nav-item">
                                    <Link to={'/favorites'} className="nav-link" href="#">TRUYỆN YÊU THÍCH</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={'/history'} className="nav-link" href="#">LỊCH SỬ</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button"
                                    >THỂ LOẠI</a>
                                    <ul className="dropdown-menu">
                                        {genreGroups.map((group, index) => (
                                            <li key={index}>
                                                <div className="d-flex justify-content-between">
                                                    {group.map((genre) => (
                                                        <Link to={`/genre/${genre.genreName}`} key={genre.genreId}
                                                              className="dropdown-item"
                                                              href="#">{genre.genreName}</Link>
                                                    ))}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <div className="d-flex d-block col d-sm-none d-md-none d-lg-none">
                                    <Link to={'/premium'} className="text-decoration-none hover-text me-3"
                                          title="Nâng cấp tài khoản">
                                        <i className="bi bi-magic"></i>
                                        <span> Premium</span>
                                    </Link>
                                </div>
                                <div className="d-block d-sm-none d-md-none d-lg-none">
                                    <div className="nav-item dropdown dropdown-menu-end">
                                        <a className="nav-link dropdown-toggle text-white" href="#" role="button"
                                           data-bs-toggle="dropdown"><i className="bi bi-person-fill"></i> Tài khoản</a>
                                        <ul className="dropdown-menu" style={{zIndex: 9999}}>
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
                                        </ul>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <Outlet/>
            <div className="container-fluid bg-dark d-flex justify-content-center pt-4 pb-3">
                <div className="row container">
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
        </>
    )
}

export default Layout;