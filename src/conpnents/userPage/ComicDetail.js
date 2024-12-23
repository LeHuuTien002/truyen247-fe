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
import Pagination from "../utils/Pagination";

const ComicDetail = () => {
    const navigate = useNavigate();

    const [chapterList, setChapterList] = useState([]);
    const [filteredData, setFilteredData] = useState(chapterList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const token = localStorage.getItem("token");
    const {comicId} = useParams();
    const [comicDetail, setComicDetail] = useState(null);
    const [genreList, setGenreList] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = getUserId();

    useEffect(() => {
        setFilteredData(chapterList);
    }, [chapterList]);

    const totalPages = Math.ceil(chapterList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleReplySubmit = async () => {
        setLoading(true);
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
            setReplyContent("");
            setReplyTo(null);
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddComment = async (e) => {
        setLoading(true)
        e.preventDefault();
        const comment = {comicId, userId, content};
        try {
            const data = await addComment(comment, token);
            setContent("");
            await loadComments();
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteComment = async (id) => {
        setLoading(true)
        try {
            const data = await deleteComment(id, userId, token);
            setContent("");
            await loadComments();
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    const loadComments = async () => {
        setLoading(true)
        try {
            const data = await fetchComments(comicId, token);
            setComments(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadComments();
    }, [comicId]);

    const minChapterNumber = Math.min(...chapterList.map(chapter => chapter.chapterNumber));
    const maxChapterNumber = Math.max(...chapterList.map(chapter => chapter.chapterNumber));

    const minChapter = chapterList.find(chapter => chapter.chapterNumber === minChapterNumber);
    const maxChapter = chapterList.find(chapter => chapter.chapterNumber === maxChapterNumber);

    const fetchIsFavorite = async () => {
        setLoading(true)
        try {
            const response = await checkIsFavorite(getUserId(), comicId, token);
            setIsFavorite(response.data);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchIsFavorite();
    }, [comicId]);

    const handleFavoriteClick = async () => {
        setLoading(true)
        try {
            if (isFavorite) {
                await removeFavorite(getUserId(), comicId, token);
                await loadComic();
            } else {
                await addFavorite(getUserId(), comicId, token);
                await loadComic();
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(chapterList);
        } else {
            const filtered = chapterList.filter((item) => {
                if (!isNaN(searchTerm)) {
                    return item.chapterNumber && item.chapterNumber === parseInt(searchTerm);
                } else {
                    return item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
            setFilteredData(filtered);
        }
        setCurrentPage(1);
    };

    const loadComic = async () => {
        setLoading(true)
        try {
            const data = await getComicById(comicId);
            console.log(data)
            setComicDetail(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    const loadChapter = async () => {
        setLoading(true)
        try {
            const data = await getChaptersByComicId(getUserId(), comicId, token);
            const sortedData = data.sort((a, b) => b.chapterNumber - a.chapterNumber);
            console.log("chapters:", sortedData);
            setChapterList(sortedData);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    const loadGenreByComicId = async () => {
        setLoading(true)
        try {
            const data = await getAllGenreByComicId(comicId);
            setGenreList(data.genres)
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadComic();
        loadChapter();
        loadGenreByComicId();
    }, [comicId]);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const displayedText = isExpanded ? comicDetail?.content : comicDetail?.content.slice(0, 200) + (comicDetail?.content.length > 200 ? "..." : "");

    const [isAscending, setIsAscending] = useState(true);

    const handleSort = () => {
        const sortedChapters = [...chapterList].sort((a, b) => {
            return isAscending ? a.chapterNumber - b.chapterNumber : b.chapterNumber - a.chapterNumber; // Tăng dần/giảm dần theo chapterNumber
        });
        setChapterList(sortedChapters);
        setIsAscending(!isAscending);
    };

    const handleNavigateMinChapter = () => {
        navigate(`/comics/${comicId}/chapters/${minChapter.id}/pages`);
    };

    const handleNavigateMaxChapter = () => {
        navigate(`/comics/${comicId}/chapters/${maxChapter.id}/pages`);
    };

    const handleNavigatePages = (id) => {
        navigate(`/comics/${comicId}/chapters/${id}/pages`);
    };
    const [expandedComments, setExpandedComments] = useState({});

    const toggleReplies = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };
    const renderComments = (commentList, depth = 0) => {
        return commentList.map((comment) => {
            const isExpanded = expandedComments[comment.id] || false;

            return (
                <div className="container">
                    {loading && (
                        <div className="overlay">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <div
                        key={comment.id}
                        className="position-relative row g-2 mb-1 align-items-start mt-1"
                        style={{marginLeft: `${depth * 10}px`}}
                    >
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

                        <div className="col-auto">
                            <img
                                src={comment.user.picture === null ? avatar : comment.user.picture}
                                alt="Avatar"
                                className="rounded-circle img-fluid"
                                style={{width: "40px", height: "40px"}}
                            />
                        </div>

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

                            {comment.replies && comment.replies.length > 0 && (
                                <span
                                    className="text-warning d-block mt-2"
                                    style={{cursor: "pointer", fontSize: "0.9rem"}}
                                    onClick={() => toggleReplies(comment.id)}
                                >
                    {isExpanded ? "Thu gọn phản hồi" : "Xem các phản hồi"}
                </span>
                            )}

                            {isExpanded && comment.replies && renderComments(comment.replies, depth + 1)}
                        </div>
                    </div>
                </div>
            )
        });
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
            <p><Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Chi tiết truyện</span>
            </p>
            <h5 className="text-center mt-3">{comicDetail?.name}</h5>
            <div className="text-center mt-3">
                <span>[Cập nhật lúc: {new Date(comicDetail?.updateAt).toLocaleString()}]</span>
            </div>
            <div className="row mt-3">
                <div
                    className="col-12 col-sm-12 col-md-12 col-lg-2 mt-3 d-flex d-sm-flex d-md-block justify-content-center justify-content-sm-center justify-content-md-start">
                    <img className="col-sm-10 col-lg-12 card" loading="lazy" src={comicDetail?.thumbnail}/>
                </div>
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
                                onClick={handleSort}
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
                            {isAscending ? "▲" : "▼"}
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
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handleClick}
                        rowsPerPage={rowsPerPage}
                    />
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