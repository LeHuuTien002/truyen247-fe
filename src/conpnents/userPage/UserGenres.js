import {Link, useNavigate, useParams} from "react-router-dom";
import {getComicsByGenre} from "../../services/comicService";
import React, {useEffect, useState} from "react";
import '../../css/Home.css';
import {getAllGenreName} from "../../services/genreService";

const UserGenres = () => {
    const token = localStorage.getItem("token");

    const {genreName} = useParams(); // Lấy tên thể loại từ URL
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

    const [selectedGenre, setSelectedGenre] = useState("Tất cả");
    const loadComicsByGenreName = async () => {
        const genreQuery = selectedGenre === "Tất cả" ? "Tất cả" : `?genreName=${selectedGenre}`;
        try {
            const data = await getComicsByGenre(genreQuery);
            console.log("comics", data)
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    useEffect(() => {
        loadComicsByGenreName();
    }, [selectedGenre]);

    useEffect(() => {
        setSelectedGenre(genreName)
    }, [genreName]);

    const [genreList, setGenreList] = useState([]);
    const loadGenreNameList = async () => {
        try {
            const data = await getAllGenreName();
            setGenreList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    useEffect(() => {
        loadGenreNameList();
    }, []);

    return (
        <div className="bg-dark container pt-1 pb-1">
                <p> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                    <i className="bi bi-chevron-double-right small"></i>
                    <span className="text-warning"> Thể loại</span>
                </p>
            <h4 className="text-warning text-center">TẤT CẢ THỂ LOẠI TRUYỆN</h4>
            <div className="container mt-1">
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-8 mt-1">
                        <div className="row mb-3">
                            {currentRows?.length > 0 ? (currentRows.map((comic, index) => (
                                <div key={index} onClick={() => handleNavigateComicDetailClick(comic.id)}
                                     className="col-6 col-sm-6 col-md-4 col-lg-3 mt-1 hover-text">
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
                    <div className="col-0 col-sm-0 col-md-0 col-lg-4 mt-3 border p-3">
                        <h6 className="text-warning">Thể loại</h6>
                        <hr/>
                        <span
                            className={`text-decoration-none hover-text ${selectedGenre === "Tất cả" ? "text-warning" : ""}`}
                            onClick={() => setSelectedGenre("Tất cả")}
                        >
                                Tất cả
                            </span>
                        <hr/>
                        <div className="row">
                            {genreList.map((genre, index) => (
                                <div key={index} className="col-6 text-start">
                                            <span
                                                className={`d-block text-decoration-none py-1 border-bottom hover-text ${selectedGenre === genre.genreName ? "text-warning" : ""}`}
                                                onClick={() => setSelectedGenre(genre.genreName)}
                                            >
                                                {genre.genreName}
                                            </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserGenres;