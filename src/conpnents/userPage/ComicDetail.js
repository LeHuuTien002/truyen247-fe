import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getComicById} from "../../services/comicService";
import {getAllGenreByComicId} from "../../services/genreService";
import SearchBar from "../SearchBar";
import {getChaptersByComicId} from "../../services/chapterService";
import {timeSince} from "../utils/timeUtils";
import {addFavorite, checkIsFavorite, removeFavorite} from "../../services/favoriteService";
import {getUserId} from "../utils/auth";
import {addComment, deleteComment, fetchComments, replyToComment} from "../../services/commentService";
import avatar from './anonymous.png'

const ComicDetail = () => {
    const [chapterList, setChapterList] = useState([]);
    const [filteredData, setFilteredData] = useState(chapterList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(chapterList); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [chapterList]);

    const totalPages = Math.ceil(chapterList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const token = localStorage.getItem("token");
    const {comicId} = useParams();
    const [comicDetail, setComicDetail] = useState(null);
    const [genreList, setGenreList] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [replyTo, setReplyTo] = useState(null);

    const userId = getUserId();

    const handleReplySubmit = async () => {
        if (replyContent.trim() === "") {
            alert("Bạn hãy nhập nội dung!");
            return;
        }
        if (!replyTo || !replyContent) return;
        const payload = {
            parentCommentId: replyTo,
            comicId: comicId,
            userId: userId,
            content: replyContent,
        };
        try {
            const data = await replyToComment(payload, token);
            await loadComments();
            // Reset nội dung phản hồi và trạng thái form
            setReplyContent("");
            setReplyTo(null);
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        const comment = {comicId, userId, content};
        try {
            const data = await addComment(comment, token);
            setContent("");
            await loadComments();
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const data = await deleteComment(id, userId, token);
            setContent("");
            await loadComments();
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadComments = async () => {
        try {
            const data = await fetchComments(comicId, token);
            setComments(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadComments();
    }, [comicId]);

    // Lấy `chapterNumber` nhỏ nhất, lớn nhất
    const minChapterNumber = Math.min(...chapterList.map(chapter => chapter.chapterNumber));
    const maxChapterNumber = Math.max(...chapterList.map(chapter => chapter.chapterNumber));
    // Tìm ID tương ứng
    const minChapter = chapterList.find(chapter => chapter.chapterNumber === minChapterNumber);
    const maxChapter = chapterList.find(chapter => chapter.chapterNumber === maxChapterNumber);

    // Kiểm tra xem truyện này có được yêu thích hay không
    const fetchIsFavorite = async () => {
        try {
            const response = await checkIsFavorite(getUserId(), comicId, token);
            setIsFavorite(response.data); // true hoặc false
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    useEffect(() => {
        fetchIsFavorite();
    }, [comicId]);

    // Xử lý khi bấm nút yêu thích/bỏ yêu thích
    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                // Gửi yêu cầu xóa yêu thích
                await removeFavorite(getUserId(), comicId, token);
                await loadComic();
            } else {
                // Gửi yêu cầu thêm yêu thích
                await addFavorite(getUserId(), comicId, token);
                await loadComic();
            }

            // Đảo trạng thái yêu thích
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(chapterList); // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
        } else {
            const filtered = chapterList.filter((item) => {
                if (!isNaN(searchTerm)) {
                    // Nếu searchTerm là số, tìm kiếm theo chapterNumber
                    return item.chapterNumber && item.chapterNumber === parseInt(searchTerm);
                } else {
                    // Nếu searchTerm là chuỗi, tìm kiếm theo title
                    return item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
            setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
        }
        setCurrentPage(1); // Reset về trang đầu tiên sau khi tìm kiếm
    };

    const loadComic = async () => {
        try {
            const data = await getComicById(comicId);
            console.log(data)
            setComicDetail(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadChapter = async () => {
        try {
            const data = await getChaptersByComicId(getUserId(), comicId, token);
            const sortedData = data.sort((a, b) => b.chapterNumber - a.chapterNumber);
            setChapterList(sortedData);
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadGenreByComicId = async () => {
        try {
            const data = await getAllGenreByComicId(comicId);
            setGenreList(data.genres)
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadComic();
        loadChapter();
        loadGenreByComicId();
    }, [comicId]);

    const [isExpanded, setIsExpanded] = useState(false);

    // Hàm xử lý khi nhấn nút
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Nếu văn bản ngắn hơn `maxLength`, hiển thị toàn bộ
    const displayedText = isExpanded ? comicDetail?.content : comicDetail?.content.slice(0, 200) + (comicDetail?.content.length > 200 ? "..." : "");

    // Trạng thái sắp xếp: true = tăng dần, false = giảm dần
    const [isAscending, setIsAscending] = useState(true);

    // Hàm xử lý sắp xếp
    const handleSort = () => {
        const sortedChapters = [...chapterList].sort((a, b) => {
            return isAscending ? a.chapterNumber - b.chapterNumber : b.chapterNumber - a.chapterNumber; // Tăng dần/giảm dần theo chapterNumber
        });
        setChapterList(sortedChapters); // Cập nhật danh sách đã sắp xếp
        setIsAscending(!isAscending); // Đổi trạng thái sắp xếp
    };

    const handleNavigateMinChapter = () => {
        navigate(`/comics/${comicId}/chapters/${minChapter.id}/pages`);
    };

    const handleNavigateMaxChapter = () => {
        navigate(`/comics/${comicId}/chapters/${maxChapter.id}/pages`);
    };

    const navigate = useNavigate();
    const handleNavigatePages = (id) => {
        navigate(`/comics/${comicId}/chapters/${id}/pages`);
    };
    const [expandedComments, setExpandedComments] = useState({});

    // Hàm xử lý khi nhấn "Xem các phản hồi"
    const toggleReplies = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Đảo ngược trạng thái mở/đóng
        }));
    };
    const renderComments = (commentList, depth = 0) => {
        return commentList.map((comment) => {
            const isExpanded = expandedComments[comment.id] || false; // Kiểm tra trạng thái mở/đóng

            return (
                <div className="container">
                    <div
                        key={comment.id}
                        className="position-relative row g-2 mb-1 align-items-start mt-1"
                        style={{marginLeft: `${depth * 10}px`}} // Giảm thụt lề
                    >
                        {/* Đường kẻ nối bình luận con */}
                        {depth > 0 && (
                            <div
                                className="position-absolute border-start"
                                style={{
                                    top: "0",
                                    left: "-10px",
                                    width: "0.5px",
                                    height: "100%",
                                    borderColor: "#ddd",
                                }}
                            ></div>
                        )}

                        {/* Avatar */}
                        <div className="col-auto">
                            <img
                                src={comment.user.picture === null ? avatar : comment.user.picture}
                                alt="Avatar"
                                className="rounded-circle img-fluid"
                                style={{width: "40px", height: "40px"}}
                            />
                        </div>

                        {/* Comment Content */}
                        <div className="col">
                            <div className="p-2 rounded-3 bg-secondary">
                                <h6
                                    className="m-0 fw-bold text-white"
                                    style={{fontSize: "1rem"}}
                                >
                                    {comment.user.username}
                                </h6>
                                <p className="m-0 text-white" style={{fontSize: "0.95rem"}}>
                                    {comment.content}
                                </p>
                            </div>
                            <div
                                className="d-flex flex-wrap mt-1 align-items-center text-secondary"
                                style={{fontSize: "0.85rem"}}
                            >
                                <span className="me-3">{timeSince(comment.createAt)}</span>
                                <span
                                    className="me-3"
                                    style={{cursor: "pointer"}}
                                    onClick={() => alert("Thích")}
                                >
                    Thích
                </span>
                                <span
                                    className="me-3"
                                    style={{cursor: "pointer"}}
                                    onClick={() => setReplyTo(comment.id)}
                                >
                    Phản hồi
                </span>
                                {comment.user.id === userId && (
                                    <span
                                        className="text-danger"
                                        style={{cursor: "pointer"}}
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                        Xóa
                    </span>
                                )}
                            </div>

                            {/* Render reply form if replyTo matches comment ID */}
                            {replyTo === comment.id && (
                                <div className="mt-3">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="form-control"
                        placeholder="Viết phản hồi..."
                        rows={2}
                        required
                    ></textarea>
                                    <div className="mt-2 d-flex justify-content-end">
                                        <button
                                            onClick={handleReplySubmit}
                                            type="submit"
                                            className="btn btn-primary btn-sm me-2"
                                        >
                                            Gửi
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setReplyTo(null)}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Show replies toggle button */}
                            {comment.replies && comment.replies.length > 0 && (
                                <span
                                    className="text-warning d-block mt-2"
                                    style={{cursor: "pointer", fontSize: "0.9rem"}}
                                    onClick={() => toggleReplies(comment.id)}
                                >
                    {isExpanded ? "Thu gọn phản hồi" : "Xem các phản hồi"}
                </span>
                            )}

                            {/* Render nested replies */}
                            {isExpanded && comment.replies && renderComments(comment.replies, depth + 1)}
                        </div>
                    </div>
                </div>

            )
        });
    };
    return (
        <div className="container bg-dark pt-1 pb-1">
            <p><Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Chi tiết truyện</span>
            </p>
            <h5 className="text-center mt-3">{comicDetail?.name}</h5>
            <div className="text-center mt-3">
                <span>[Cập nhật lúc: {new Date(comicDetail?.updateAt).toLocaleString()}]</span>
            </div>
            <div className="row mt-3">
                <div className="col-12 col-sm-12 col-md-12 col-lg-2 mt-3">
                    <img className="col-12 card" loading="lazy" src={comicDetail?.thumbnail}/></div>
                <div className="col-0 col-sm-0 col-md-0 col-lg-6 mt-3 d-flex">
                    <div className="pe-3">
                        <span className="d-block text-warning"><i className="bi bi-person-fill"></i> Tên khác:</span>
                        <span className="d-block text-warning mt-3"><i
                            className="bi bi-person-fill"></i> Tác giả:</span>
                        <span className="d-block text-warning mt-3"><i className="bi bi-wifi"></i> Tình trạng: </span>
                        <span className="d-block text-warning mt-3"><i
                            className="bi bi-tags-fill"></i> Thể loại: </span>
                        <span className="d-block text-warning mt-3"><i className="bi bi-eye me-1 text-warning"></i> Lượt xem: </span>
                        <span className="d-block text-warning mt-3"><i
                            className="bi bi-heart-fill me-1 text-warning"></i> Lượt thích: </span>

                        <button onClick={() => handleNavigateMinChapter()} type="button"
                                className="btn btn-outline-warning d-block mt-3">Đọc từ đầu
                        </button>
                        <button onClick={() => handleNavigateMaxChapter()} type="button"
                                className="btn btn-outline-warning d-block mt-3">Đọc mới nhất
                        </button>
                    </div>
                    <div>
                        <span className="d-block">{comicDetail?.otherName}</span>
                        <span className="d-block mt-3">{comicDetail?.author}</span>
                        <span className="d-block mt-3"> {comicDetail?.status}</span>
                        <span className="d-block mt-3">{genreList?.map((genre, index) => (
                            <span key={index}>{genre.name}{index !== genreList.length - 1 && " - "}</span>
                        ))}</span>
                        <span className="d-block mt-3"> {comicDetail?.views === null ? 0 : comicDetail?.views}</span>
                        <span className="d-block mt-3"> {comicDetail?.favorites}</span>
                        <button type="button"
                                onClick={handleFavoriteClick}
                                className={`btn ${isFavorite ? "btn-warning" : "btn-outline-warning "} d-block mt-3`}><i
                            className="bi bi-heart"></i>{isFavorite ? " Bỏ yêu thích" : " Yêu thích"}
                        </button>
                    </div>
                </div>
                <div className="col-0 col-sm-0 col-md-0 col-lg-4 mt-3">
                    <span className="text-warning">Tóm tắt: </span>
                    <span>{displayedText}</span>
                    {comicDetail?.content.length > 200 && (
                        <button
                            onClick={toggleExpand}
                            className="text-warning"
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                            }}
                        >
                            {isExpanded ? "Ẩn bớt" : "Xem thêm >"}
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-5 text-warning">
                <h4><i className="bi bi-list-task"></i> DANH SÁCH CHƯƠNG</h4>
                <SearchBar onSearch={handleSearch}/>
                <div className="table-responsive text-center">
                    <table className="table table-dark table-hover table-bordered">
                        <thead>
                        <tr>
                            <th
                                className="col-auto text-center"
                                onClick={handleSort} // Thêm sự kiện click để sắp xếp
                                style={{
                                    padding: "10px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    position: "relative",
                                }}
                            >
                                Số chương
                                <span
                                    style={{
                                        marginLeft: "10px",
                                        fontSize: "12px",
                                        color: "yellow",
                                    }}
                                >
                            {isAscending ? "▲" : "▼"} {/* Hiển thị icon ▲/▼ */}
                        </span>
                            </th>
                            <th className="col-auto">Tiêu đề</th>
                            <th className="col-auto">Cập nhật</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentRows?.length > 0 ? (currentRows.map((chapter) => (
                            <tr className="cursor-pointer" key={chapter?.id}>
                                <td onClick={() => handleNavigatePages(chapter?.id)}
                                    className="hover-text">Chapter {chapter?.chapterNumber}</td>
                                <td>{chapter?.title}</td>
                                <td>{timeSince(chapter?.updateAt)}</td>
                            </tr>
                        ))) : (<tr>
                            <td colSpan="5" className="text-center">Không tìm thấy kết quả</td>
                        </tr>)}
                        </tbody>
                    </table>
                    <nav>
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
            </div>
            <div className="mt-3">
                <form onSubmit={handleAddComment}>
                    <label htmlFor="comment">Comments:</label>
                    <textarea
                        value={content}
                        required
                        onChange={(e) => setContent(e.target.value)}
                        className="form-control" rows="3"
                        id="comment" name="text"
                    >
                        </textarea>
                    <button className="btn btn-outline-warning mt-2">Bình luận</button>
                </form>
            </div>
            <div>
                <div className="mt-3">
                    <button type="button" className="btn btn-outline-warning" data-bs-toggle="collapse"
                            data-bs-target="#demo"><i className="bi bi-chat-dots-fill"></i> Xem các bình luận
                    </button>
                    <div id="demo" className="collapse">
                        <div className="mt-4">
                            <div>{renderComments(comments)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComicDetail;