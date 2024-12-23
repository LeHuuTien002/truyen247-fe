import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUserId} from "../utils/auth";
import {getFavorites, removeFavorite} from "../../services/favoriteService";
import Pagination from "../utils/Pagination";

const Favorites = () => {
    const token = localStorage.getItem("token");
    const [favorites, setFavorites] = useState([]); // Danh sách truyện yêu thích
    const [filteredData, setFilteredData] = useState(favorites);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };

    const fetchFavorites = async () => {
        setLoading(true)
        try {
            const data = await getFavorites(getUserId(), token);
            console.log("favorites", data);
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorite comics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    useEffect(() => {
        setFilteredData(favorites);
    }, [favorites]);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);


    const totalPages = Math.ceil(favorites?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRemoveFavorite = async (comicId) => {
        setLoading(true)
        try {
            await removeFavorite(getUserId(), comicId, token);
            setFavorites(favorites.filter((comic) => comic.id !== comicId));
        } catch (error) {
            console.error("Error removing favorite comic:", error);
        }finally {
            setLoading(false)
        }
    };

    if (loading === false && favorites?.length === 0) {
        return <div className="container bg-dark p-5">Không có truyện yêu thích nào!</div>
    }

    return (
        <div className="container bg-dark pt-1 pb-1">
            {loading && (
                <div className="overlay">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <p> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Truyện yêu thích</span>
            </p>
            <h4 className="text-warning text-center">TẤT CẢ TRUYỆN YÊU THÍCH</h4>
            <div className="row">
                {currentRows?.length > 0 ? (currentRows.map((comic) => (
                    <div key={comic.comicId}
                         className="d-flex flex-column col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                        <div onClick={() => handleNavigateComicDetailClick(comic.comicId)}>
                            <div className="card comic-card">
                                <div className="image-container">
                                    <img className="card-img-top object-fit-cover comic-image"
                                         loading="lazy"
                                         src={comic.comicThumbnail}
                                         alt={comic.comicName}
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
                                <span className="card-title fs-6"><strong>{comic.comicName}</strong></span>
                            </div>
                        </div>
                        <div className="card-body d-flex justify-content-center align-items-end">
                            <button
                                onClick={() => handleRemoveFavorite(comic.comicId)}
                                className="btn btn-outline-danger"
                            >
                                Bỏ yêu thích
                            </button>
                        </div>
                    </div>
                ))) : (
                    <div className="container bg-dark p-5">Không tìm thấy kết quả</div>)}
            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handleClick}
                rowsPerPage={rowsPerPage}
            />
        </div>
    );
}
export default Favorites;
