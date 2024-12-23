import {Link, useNavigate, useParams} from "react-router-dom";
import {getComicsByGenre} from "../../services/comicService";
import React, {useEffect, useState} from "react";
import '../../css/Home.css';
import {getAllGenreName} from "../../services/genreService";
import Pagination from "../utils/Pagination";

const UserGenres = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {genreName} = useParams(); // Lấy tên thể loại từ URL
    const [comicList, setComicList] = useState([]);
    const [filteredData, setFilteredData] = useState(comicList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(comicList);
    }, [comicList]);

    const totalPages = Math.ceil(comicList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };

    const [selectedGenre, setSelectedGenre] = useState("Tất cả");
    const loadComicsByGenreName = async () => {
        setLoading(true)
        const genreQuery = selectedGenre === "Tất cả" ? "Tất cả" : `?genreName=${selectedGenre}`;
        try {
            const data = await getComicsByGenre(genreQuery);
            console.log("comics", data)
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
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
        setLoading(true)
        try {
            const data = await getAllGenreName();
            console.log("genres: ", data)
            setGenreList(data);
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        loadGenreNameList();
    }, []);

    return (
        <div className="bg-dark container pt-1 pb-1">
            {loading && (
                <div className="overlay">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <p><Link to="/" className="text-decoration-none">Trang chủ </Link>
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
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handleClick}
                            rowsPerPage={rowsPerPage}
                        />
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