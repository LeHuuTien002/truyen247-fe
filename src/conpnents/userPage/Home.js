import {Link, useNavigate} from "react-router-dom";
import {getAllComicsIsActive} from "../../services/comicService";
import React, {useEffect, useState} from "react";
import '../../css/Home.css';
import {getHistoryByUser, getRecentLogsByUser, removeHistory} from "../../services/historyService";
import {getUserId} from "../utils/auth";

const Home = () => {
    const token = localStorage.getItem("token");
    const [comicList, setComicList] = useState([]);
    const [filteredData, setFilteredData] = useState(comicList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(comicList); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [comicList]);

    const totalPages = Math.ceil(comicList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigate = useNavigate();
    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };

    const loadComic = async () => {
        try {
            const data = await getAllComicsIsActive();
            console.log(data)
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    useEffect(() => {
        loadComic();
    }, []);


    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const fetchRecentLogsByUser = async () => {
        try {
            const data = await getRecentLogsByUser(getUserId(), token);
            console.log("history:", data);
            setHistoryList(data); // Cập nhật danh sách yêu thích
        } catch (error) {
            console.error("Error fetching history comics:", error);
        } finally {
            setLoading(false); // Tắt trạng thái tải
        }
    };
    useEffect(() => {
        fetchRecentLogsByUser();
    }, [token]);

    const handleRemoveFavorite = async (id) => {
        try {
            await removeHistory(id, token); // Gửi yêu cầu xóa
            setHistoryList(historyList.filter((history) => history.id !== id)); // Cập nhật danh sách
        } catch (error) {
            console.error("Error removing favorite comic:", error);
        }
    };

    const handleNavigatePages = (comicId, chapterId) => {
        navigate(`/comics/${comicId}/chapters/${chapterId}/pages`);
    };

    return (
        <div className="bg-dark container pt-1 pb-1">
                <div className="container">
                    <h3 className="text-warning">Truyen247 đề cử</h3>
                    <div id="demo" className="carousel slide mt-3" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#demo" data-bs-slide-to="0"
                                    className="active bg-light"></button>
                            <button className="bg-light" type="button" data-bs-target="#demo"
                                    data-bs-slide-to="1"></button>
                            <button className="bg-light" type="button" data-bs-target="#demo"
                                    data-bs-slide-to="2"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img
                                    src="https://i.pinimg.com/736x/6a/99/f7/6a99f7ba6ce7273491dd8903a8b600f0.jpg"
                                    alt="Doraemon" className="d-block"
                                    loading="lazy"
                                    style={{width: "100%"}}/>
                                <div className="carousel-caption text-white">
                                    <h3>One Piece</h3>
                                    <p>Ta đã trở lại !</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img
                                    loading="lazy"
                                    src="https://i.pinimg.com/originals/40/65/ad/4065ad52e0b968c6fb152d4bcbfd3ac9.jpg"
                                    alt="Chicago" className="d-block" style={{width: "100%"}}/>
                                <div className="carousel-caption text-white">
                                    <h3>Conan</h3>
                                    <p>Thank you, Chicago!</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img
                                    loading="lazy"
                                    src="https://i.pinimg.com/originals/bf/ea/a7/bfeaa7ed50da2cad0528cc8d3076b051.jpg"
                                    alt="One piece" className="d-block" style={{width: "100%"}}/>
                                <div className="carousel-caption text-white">
                                    <h3>One piece</h3>
                                    <p>We love the Big Apple!</p>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#demo"
                                data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#demo"
                                data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-8 mt-3">
                            <h5 className="text-warning">Truyen247 - Truyện tranh online </h5>
                            <div className="row mb-3">
                                {currentRows?.length > 0 ? (currentRows.map((comic, index) => (
                                    <div key={index} onClick={() => handleNavigateComicDetailClick(comic.id)}
                                         className="col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                                        <div className="card comic-card">
                                            <div className="image-container">
                                                <img className="card-img-top object-fit-cover comic-image"
                                                     loading="lazy"
                                                     src={comic.thumbnail}
                                                     alt={comic.name}
                                                     style={{width: "100%"}}/>
                                            </div>
                                            <div className="view-count d-flex justify-content-center p-1">
                                                <div>
                                                    <i className="bi bi-eye me-1 text-warning"></i>
                                                    <span className="text-warning">{comic.views}</span>
                                                </div>
                                                <div className="ms-2">
                                                    <i className="bi bi-chat-dots-fill me-1 text-warning"></i>
                                                    <span className="text-warning">{comic.numberOfComment}</span>
                                                </div>
                                                <div className="ms-2">
                                                    <i className="bi bi-heart-fill me-1 text-danger"></i>
                                                    <span className="text-danger">{comic.favorites}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <span className="card-title fs-6"><strong>{comic.name}</strong></span>
                                        </div>
                                    </div>
                                ))) : (<tr>
                                    <td colSpan="5" className="text-center">Không tìm thấy kết quả</td>
                                </tr>)}
                            </div>
                            <nav>
                                <ul className="pagination justify-content-center">
                                    {/* Nút Previous */}
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
                                            <i className="bi bi-chevron-left"></i> {/* Mũi tên trái */}
                                        </button>
                                    </li>

                                    {/* Trang đầu tiên */}
                                    {currentPage > 3 && (
                                        <>
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => handleClick(1)}>
                                                    1
                                                </button>
                                            </li>
                                            <li className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                        </>
                                    )}

                                    {/* Các trang xung quanh trang hiện tại */}
                                    {Array.from({length: totalPages}, (_, i) => {
                                        const page = i + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 2 && page <= currentPage + 2)
                                        ) {
                                            return (
                                                <li key={i}
                                                    className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handleClick(page)}>
                                                        {page}
                                                    </button>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}

                                    {/* Trang cuối cùng */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            <li className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => handleClick(totalPages)}>
                                                    {totalPages}
                                                </button>
                                            </li>
                                        </>
                                    )}

                                    {/* Nút Next */}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
                                            <i className="bi bi-chevron-right"></i> {/* Mũi tên phải */}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-0 col-sm-0 col-md-0 col-lg-4 mt-3 container">
                            <div className="row">
                                <div className="col col-sm col-md col-lg">
                                    <h6 className="text-warning">Lịch sử đọc tại Truyen247</h6>
                                </div>
                                <div className="col col-sm col-md col-lg text-end">
                                    <Link to="/history" className="text-warning text-decoration-none">Xem tất
                                        cả</Link>
                                </div>
                            </div>
                            {historyList?.length > 0 ? (historyList.map((history) => (
                                <div key={history.id}
                                     className="row mt-4 hover-text">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-4"
                                         onClick={() => handleNavigateComicDetailClick(history.comicId)}>
                                        <div className="card comic-card">
                                            <div className="image-container">
                                                <img className="card-img-top object-fit-cover comic-image"
                                                     loading="lazy"
                                                     src={history.comicThumbnail}
                                                     alt={history.comicName}
                                                     style={{width: "100%"}}/>
                                            </div>
                                            <div className="view-count d-flex justify-content-center p-1">
                                                <div>
                                                    <i className="bi bi-eye me-1 text-warning"></i>
                                                    <span className="text-warning">{history.views}</span>
                                                </div>
                                                <div className="ms-1">
                                                    <i className="bi bi-chat-dots-fill me-1 text-warning"></i>
                                                    <span className="text-warning">{history.numberOfComment}</span>
                                                </div>
                                                <div className="ms-1">
                                                    <i className="bi bi-heart-fill me-1 text-danger"></i>
                                                    <span className="text-danger">{history.favorites}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-9 col-sm-9 col-md-9 col-lg-8">
                                        <h6>{history.comicName}</h6>
                                        <span
                                            onClick={() => handleNavigatePages(history.comicId, history.chapterId)}><strong>Đọc tiếp chapter {history.chapterNumber} ></strong></span>
                                        <button
                                            onClick={() => handleRemoveFavorite(history.id)}
                                            className="btn btn-outline-danger d-block mt-1 fs-6"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))) : (<p>
                                <span className="text-center">Không tìm thấy kết quả</span>
                            </p>)}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Home;