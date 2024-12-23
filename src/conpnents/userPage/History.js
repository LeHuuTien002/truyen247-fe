import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUserId} from "../utils/auth";
import {getHistoryByUser, removeHistory} from "../../services/historyService";
import Pagination from "../utils/Pagination";

const History = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState([]); // Danh sách truyện yêu thích
    const [filteredData, setFilteredData] = useState(historyList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const data = await getHistoryByUser(getUserId(), token);
            console.log("history", data);
            setHistoryList(data);
        } catch (error) {
            console.error("Error fetching history comics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [token]);

    useEffect(() => {
        setFilteredData(historyList);
    }, [historyList]);

    const totalPages = Math.ceil(historyList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleRemoveFavorite = async (id) => {
        setLoading(true)
        try {
            await removeHistory(id, token);
            setHistoryList(historyList.filter((history) => history.id !== id));
        } catch (error) {
            console.error("Error removing favorite comic:", error);
        }finally {
            setLoading(false)
        }
    };


    if (loading === false && historyList?.length === 0) {
        return <div className="container bg-dark p-5">Không có lịch sử đọc nào!</div>
    }

    const handleNavigatePages = (comicId, chapterId) => {
        navigate(`/comics/${comicId}/chapters/${chapterId}/pages`);
    };
    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };
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
                <span className="text-warning"> Lịch sử đọc</span>
            </p>
            <h4 className="text-warning text-center">TẤT CẢ LỊCH SỬ ĐỌC TRUYỆN</h4>
            <div className="row">
                {currentRows?.length > 0 ? (currentRows.map((history) => (
                    <div key={history.id}
                         className="d-flex flex-column col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                        <div className="card comic-card"
                             onClick={() => handleNavigateComicDetailClick(history.comicId)}>
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
                                <div className="ms-2">
                                    <i className="bi bi-chat-dots-fill me-1 text-warning"></i>
                                    <span className="text-warning">{history.numberOfComment}</span>
                                </div>
                                <div className="ms-2">
                                    <i className="bi bi-heart-fill me-1 text-danger"></i>
                                    <span className="text-danger">{history.favorites}</span>
                                </div>
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
                onPageChange={handleClick}
                rowsPerPage={rowsPerPage}
            />
        </div>
    )
}

export default History;
