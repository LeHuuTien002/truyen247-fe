import {Link, useNavigate} from "react-router-dom";
import Pagination from "../Pagination";
import React, {useEffect, useState} from "react";
import {getUserId} from "../utils/auth";
import {getHistoryByUser, removeHistory} from "../../services/historyService";

const History = () => {
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState([]); // Danh sách truyện yêu thích
    const [filteredData, setFilteredData] = useState(historyList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        // Lấy danh sách truyện yêu thích từ backend
        const fetchHistory = async () => {
            try {
                const data = await getHistoryByUser(getUserId());
                setHistoryList(data); // Cập nhật danh sách yêu thích
            } catch (error) {
                console.error("Error fetching favorite comics:", error);
            } finally {
                setLoading(false); // Tắt trạng thái tải
            }
        };

        fetchHistory();

        setFilteredData(historyList); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [historyList]);

    const totalPages = Math.ceil(historyList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

    // Xử lý khi bấm "Bỏ yêu thích"
    const handleRemoveFavorite = async (id) => {
        try {
            await removeHistory(id); // Gửi yêu cầu xóa
            setHistoryList(historyList.filter((history) => history.id !== id)); // Cập nhật danh sách
        } catch (error) {
            console.error("Error removing favorite comic:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Hiển thị trạng thái tải
    }

    if (historyList?.length === 0) {
        return <p>Không có truyện yêu thích nào!</p>; // Hiển thị khi không có truyện yêu thích
    }


    const handleNavigatePages = (comicId, chapterId) => {
        navigate(`/${comicId}/comicDetail/chapter/${chapterId}/pages`);
    };

    return (
        <div className="container bg-dark p-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Truyện yêu thích</span>
            </span>
            <div className="row">
                {currentRows?.length > 0 ? (currentRows.map((history) => (
                    <div key={history.id}
                         className="d-flex flex-column col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                        <div className="card comic-card">
                            <div className="image-container">
                                <img className="card-img-top object-fit-cover comic-image"
                                     loading="lazy"
                                     src={history.comicThumbnail}
                                     alt={history.comicName}
                                     style={{width: "100%"}}/>
                            </div>
                        </div>
                        <div className="card-body">
                            <span className="card-title fs-6"><strong>{history.comicName}</strong></span>
                        </div>
                        <div className="card-body">
                            <span onClick={() => handleNavigatePages(history.comicId, history.chapterId)}
                                  className="card-title fs-6"><strong>Đọc tiếp chapter {history.chapterNumber} ></strong></span>
                        </div>
                        <div className="card-body d-flex justify-content-center align-items-end">
                            <button
                                onClick={() => handleRemoveFavorite(history.id)}
                                className="btn btn-outline-danger"
                            >
                                Xóa
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
    )
}

export default History;