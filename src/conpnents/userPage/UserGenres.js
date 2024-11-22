import {Link, useNavigate, useParams} from "react-router-dom";
import {getComicsByGenre} from "../../services/comicService";
import React, {useEffect, useState} from "react";
import '../../css/Home.css';
import {getAllGenreName} from "../../services/genreService";

const UserGenres = () => {
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
        <div className="bg-dark container">
            <div className="container p-5">
                <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                    <i className="bi bi-chevron-double-right small"></i>
                    <span className="text-warning"> Thể loại</span>
                </span>
                <h4 className="text-warning text-center">TẤT CẢ THỂ LOẠI TRUYỆN</h4>
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-8 mt-3">
                            <div className="row">
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
                                        </div>
                                        <div className="card-body">
                                            <span className="card-title fs-6"><strong>{comic.name}</strong></span>
                                        </div>
                                    </div>
                                ))) : (<tr>
                                    <td colSpan="5" className="text-center">Không tìm thấy kết quả</td>
                                </tr>)}
                            </div>
                            <nav className="mt-3">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from({length: totalPages}, (_, i) => (
                                        <li
                                            key={i}
                                            className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handleClick(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
                                            Next
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
        </div>
    )
}

export default UserGenres;