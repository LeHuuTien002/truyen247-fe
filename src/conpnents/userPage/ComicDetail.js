import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getComicById} from "../../services/comicService";
import {getAllGenreByComicId} from "../../services/genreService";
import SearchBar from "../SearchBar";
import {getChaptersByComicId} from "../../services/chapterService";
import {timeSince} from "../utils/timeUtils";
import {addFavorite, checkIsFavorite, removeFavorite} from "../../services/favoriteService";

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

    // Lấy chuỗi JSON từ localStorage
    const userString = localStorage.getItem("user");
    // Chuyển chuỗi JSON thành object
    const userObject = JSON.parse(userString);
    // Truy cập id
    const userId = userObject?.id;

    useEffect(() => {
        // Kiểm tra xem truyện này có được yêu thích hay không
        const fetchIsFavorite = async () => {
            try {
                const response = await checkIsFavorite(userId, comicId);
                setIsFavorite(response.data); // true hoặc false
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };

        fetchIsFavorite();
    }, [userId, comicId]);

    // Xử lý khi bấm nút yêu thích/bỏ yêu thích
    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                // Gửi yêu cầu xóa yêu thích
                await removeFavorite(userId, comicId);
            } else {
                // Gửi yêu cầu thêm yêu thích
                await addFavorite(userId, comicId);
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
            const data = await getComicById(comicId, token);
            setComicDetail(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadChapter = async () => {
        try {
            const data = await getChaptersByComicId(comicId, token);
            const sortedData = data.sort((a, b) => b.chapterNumber - a.chapterNumber);
            setChapterList(sortedData);
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadGenreByComicId = async () => {
        try {
            const data = await getAllGenreByComicId(comicId, token);
            setGenreList(data.genres)
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadComic();
        loadChapter();
        loadGenreByComicId();
    }, [token, comicId]);

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
            return isAscending ? a.id - b.id : b.id - a.id; // Tăng dần/giảm dần theo id
        });
        setChapterList(sortedChapters); // Cập nhật danh sách đã sắp xếp
        setIsAscending(!isAscending); // Đổi trạng thái sắp xếp
    };

    const navigate = useNavigate();
    const handleNavigatePages = (id) => {
        navigate(`/${comicId}/comicDetail/chapter/${id}/pages`);
    };
    return (
        <div className="container bg-dark p-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right"></i>
                <span className="text-warning"> Chi tiết truyện</span>
            </span>
            <h5 className="text-center mt-3">{comicDetail?.name}</h5>
            <div className="text-center mt-3">
                <span>[Cập nhật lúc: {comicDetail?.updateAt}]</span>
            </div>
            <div className="row mt-3">
                <div className="col-12 col-sm-12 col-md-12 col-lg-2 mt-3">
                    <img className="col-12 card" loading="lazy" src={comicDetail?.thumbnail}/></div>
                <div className="col-0 col-sm-0 col-md-0 col-lg-6 mt-3 d-flex">
                    <div className="pe-3">
                        <span className="d-block text-warning"><i className="bi bi-person-fill"></i>Tên khác:</span>
                        <span className="d-block text-warning mt-3"><i className="bi bi-person-fill"></i>Tác giả:</span>
                        <span className="d-block text-warning mt-3"><i className="bi bi-wifi"></i> Tình trạng: </span>
                        <span className="d-block text-warning mt-3"><i
                            className="bi bi-tags-fill"></i> Thể loại: </span>
                        <button type="button" className="btn btn-outline-warning d-block mt-3">Đọc từ đầu</button>
                        <button type="button" className="btn btn-outline-warning d-block mt-3">Đọc mới nhất</button>
                    </div>
                    <div>
                        <span className="d-block">{comicDetail?.otherName}</span>
                        <span className="d-block mt-3">{comicDetail?.author}</span>
                        <span className="d-block mt-3"> {comicDetail?.status}</span>
                        <span className="d-block mt-3">{genreList?.map((genre, index) => (
                            <span key={index}>{genre.name}{index !== genreList.length - 1 && " - "}</span>
                        ))}</span>
                        <button type="button"
                                onClick={handleFavoriteClick}
                                className={`btn ${isFavorite ? "btn-warning" : "btn-outline-warning "} d-block mt-3`}><i
                            className="bi bi-heart"></i>{isFavorite ? "Bỏ yêu thích" : " Yêu thích"}
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
                <form>
                    <div className="mb-3 mt-3">
                        <label htmlFor="comment">Comments:</label>
                        <textarea className="form-control" rows="3" id="comment" name="text"></textarea>
                    </div>
                    <button type="submit" className="btn btn-outline-warning">Submit</button>
                </form>
            </div>
            <div>
                <div className="mt-3">
                    <button type="button" className="btn btn-outline-warning" data-bs-toggle="collapse"
                            data-bs-target="#demo"><i class="bi bi-chat-dots-fill"></i> Xem các bình luận
                    </button>
                    <div id="demo" className="collapse">
                        <div className="row mt-3">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-1">
                                <img className="col-10 card" loading="lazy"
                                     src="https://ih1.redbubble.net/image.4560210080.3383/st,small,507x507-pad,600x600,f8f8f8.jpg"/>
                            </div>
                            <div className="col-9 col-sm-9 col-md-9 col-lg-11">
                                <div>
                                    <label htmlFor="comment">CuLi Truyen247</label>
                                    <textarea className="form-control" readOnly rows="3" id="comment" name="text">
                                Truyện này hay quá trời :))
                            </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-1">
                                <img className="col-10 card" loading="lazy"
                                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMxU0ByBjU1rbBo5xxXHnXpMKtNI8afm0faw&s"/>
                            </div>
                            <div className="col-9 col-sm-9 col-md-9 col-lg-11">
                                <div>
                                    <label htmlFor="comment">CuLi Truyen247</label>
                                    <textarea className="form-control" readOnly rows="3" id="comment" name="text">
                                Bao giờ ra chapter mới vậy :(
                            </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComicDetail;