import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUserId} from "../utils/auth";
import {getFavorites, removeFavorite} from "../../services/favoriteService";
import Pagination from "../Pagination";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]); // Danh sách truyện yêu thích
    const [filteredData, setFilteredData] = useState(favorites);
    const navigate = useNavigate();

    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };
    useEffect(() => {
        // Lấy danh sách truyện yêu thích từ backend
        const fetchFavorites = async () => {
            try {
                const data = await getFavorites(getUserId());
                setFavorites(data); // Cập nhật danh sách yêu thích
            } catch (error) {
                console.error("Error fetching favorite comics:", error);
            } finally {
                setLoading(false); // Tắt trạng thái tải
            }
        };

        fetchFavorites();
        setFilteredData(favorites); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [favorites]);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);


    const totalPages = Math.ceil(favorites?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu


    // Xử lý khi bấm "Bỏ yêu thích"
    const handleRemoveFavorite = async (comicId) => {
        try {
            await removeFavorite(getUserId(), comicId); // Gửi yêu cầu xóa
            setFavorites(favorites.filter((comic) => comic.id !== comicId)); // Cập nhật danh sách
        } catch (error) {
            console.error("Error removing favorite comic:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Hiển thị trạng thái tải
    }

    if (favorites?.length === 0) {
        return <p>Không có truyện yêu thích nào!</p>; // Hiển thị khi không có truyện yêu thích
    }

    return (
        <div className="container bg-dark p-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Truyện yêu thích</span>
            </span>
            <div className="row">
                {currentRows?.length > 0 ? (currentRows.map((comic) => (
                    <div key={comic.comicId} onClick={() => handleNavigateComicDetailClick(comic.comicId)}
                         className="d-flex flex-column col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                        <div className="card comic-card">
                            <div className="image-container">
                                <img className="card-img-top object-fit-cover comic-image"
                                     loading="lazy"
                                     src={comic.comicThumbnail}
                                     alt={comic.comicName}
                                     style={{width: "100%"}}/>
                            </div>
                        </div>
                        <div className="card-body">
                            <span className="card-title fs-6"><strong>{comic.comicName}</strong></span>
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
                ))) : (<tr>
                    <td colSpan="5" className="text-center">Không tìm thấy kết quả</td>
                </tr>)}
            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handleClick={handleClick}
            />
        </div>
    );
}
export default Favorites;