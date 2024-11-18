import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getComicById} from "../../services/comicService";
import Alert from "../Alert";
import {
    createChapter,
    deleteChapter,
    getChaptersByComicId,
    updateChapterByComicId
} from "../../services/chapterService";
import SearchBar from "../SearchBar";

const Chapters = () => {
    const [chapterList, setChapterList] = useState([]);
    const [filteredData, setFilteredData] = useState(chapterList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Số hàng mỗi trang

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

    const {id} = useParams();
    const token = localStorage.getItem("token");
    const [comic, setComic] = useState(null);
    const [chapterId, setChapterId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [title, setTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState(null);

    const loadComic = async () => {
        try {
            const data = await getComicById(id, token);
            setComic(data);
        } catch (error) {
            setErrorMessage(error.message);
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

    const handleEditClick = (chapter) => {
        setChapterId(chapter.id)
        setChapterNumber(chapter.chapterNumber);
        setTitle(chapter.title);
    }

    const handleResetClick = () => {
        setTitle('');
        setChapterNumber('');
    }

    const loadChapter = async () => {
        try {
            const data = await getChaptersByComicId(id, token);
            console.log(data)
            const sortedData = data.sort((a, b) => b.chapterNumber - a.chapterNumber);
            setChapterList(sortedData);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleCreateSubmit = async (e) => {
        setSuccessMessage('');
        setErrorMessage('');
        e.preventDefault();
        try {
            const {
                success: successMessage
            } = await createChapter(id, title, chapterNumber, token);
            console.log(successMessage)
            setSuccessMessage(successMessage);
            loadChapter();
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {
                success: successMessage
            } = await updateChapterByComicId(id, chapterId, title, chapterNumber, token);
            setSuccessMessage(successMessage);
            loadChapter();
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {success: successMessage} = await deleteChapter(id, chapterId, token);
            loadChapter();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        loadComic();
        loadChapter();
    }, [token, id]); // Chạy lại khi token thay đổi


    return (
        <div className="container bg-dark p-5">
            <h2 className="text-warning text-center">QUẢN LÝ CHƯƠNG</h2>
            <div className="container mt-3">
                <h5 className="text-center">{comic?.name}</h5>
                <p className="text-center">[Cập nhật lúc: <span>{comic?.updateAt}</span>]</p>
                <button onClick={handleResetClick} type="button" className="btn btn-outline-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop">
                    Tạo chương
                </button>
                {successMessage && (
                    <Alert
                        message={successMessage}
                        type="success"
                        onClose={() => setSuccessMessage('')}
                    />
                )}
                {errorMessage && (
                    <Alert
                        message={errorMessage}
                        type="danger"
                        onClose={() => setErrorMessage('')}
                    />
                )}
                <div className="modal fade" id="staticBackdrop" data-bs-keyboard="false" tabIndex="-1"
                     aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Tạo chương</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/*<Comic/>*/}
                                <form onSubmit={handleCreateSubmit} className="container">
                                    <div className="mb-3">
                                        <label htmlFor="comicName" className="form-label">Tiêu đề: </label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                               className="form-control"
                                               required id="comicName" placeholder="Nhập tiêu đề"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="otherComicName" className="form-label">Số chương: </label>
                                        <input type="number" value={chapterNumber} min={1}
                                               onChange={(e) => setChapterNumber(e.target.value)}
                                               required className="form-control" id="otherComicName"
                                               placeholder="Nhập số chương"/>
                                    </div>
                                    <button type="submit" className="btn btn-outline-warning form-control">Tạo chương
                                        mới
                                    </button>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-warning text-center">DANH SÁCH CHƯƠNG</h2>
                <SearchBar onSearch={handleSearch}/>
                <div className="table-responsive text-center">
                    <table className="table table-dark table-hover table-bordered">
                        <thead className="">
                        <tr>
                            <th className="col-auto">Số chương</th>
                            <th className="col-auto">Tiêu đề</th>
                            <th className="col-auto">Ngày tạo</th>
                            <th className="col-auto">Ngày cập nhật</th>
                            <th className="col-auto">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentRows?.length > 0 ? (currentRows.map((chapter, index) => (
                            <tr className="cursor-pointer" key={index}>
                                <td>Chapter {chapter?.chapterNumber}</td>
                                <td>{chapter?.title}</td>
                                <td>{chapter?.createAt}</td>
                                <td>{chapter?.updateAt === null ? "Chưa cập nhật" : comic?.updateAt}</td>
                                <td>
                                    <div className="d-flex justify-content-center">
                                        {/*Update*/}
                                        <button type="button" className="btn btn-outline-success me-2"
                                                onClick={() => handleEditClick(chapter)}
                                                data-bs-toggle="modal"
                                                title="Cập nhật"
                                                data-bs-target="#staticBackdrop1">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        {successMessage && (
                                            <Alert
                                                message={successMessage}
                                                type="success"
                                                onClose={() => setSuccessMessage('')}
                                            />
                                        )}
                                        {errorMessage && (
                                            <Alert
                                                message={errorMessage}
                                                type="danger"
                                                onClose={() => setErrorMessage('')}
                                            />
                                        )}
                                        <div className="modal fade" id="staticBackdrop1"
                                             data-bs-keyboard="false" tabIndex="-1"
                                             aria-labelledby="staticBackdropLabel"
                                             aria-hidden="true">
                                            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Cập nhật
                                                            truyện</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form onSubmit={handleUpdateSubmit} className="container">
                                                            <div className="mb-3">
                                                                <label htmlFor="title" className="form-label">Tiêu
                                                                    đề: </label>
                                                                <input type="text" value={title}
                                                                       onChange={(e) => setTitle(e.target.value)}
                                                                       className="form-control"
                                                                       id="title"
                                                                       placeholder="Nhập tiêu đề chương"/>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="otherComicName" className="form-label">Số
                                                                    chương: </label>
                                                                <input type="text" value={chapterNumber}
                                                                       onChange={(e) => setChapterNumber(e.target.value)}
                                                                       className="form-control" id="otherComicName"
                                                                       placeholder="Nhập số chương"/>
                                                            </div>
                                                            <button type="submit"
                                                                    className="btn btn-outline-warning form-control">Cập
                                                                nhật truyện
                                                            </button>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-outline-danger"
                                                                data-bs-dismiss="modal">Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*Delete*/}
                                        <button type="button"
                                                onClick={() => handleEditClick(chapter)}
                                                className="btn btn-outline-danger"
                                                data-bs-toggle="modal"
                                                title="Xóa"
                                                data-bs-target="#staticBackdrop2">
                                            <i className="bi bi-trash"></i>
                                        </button>

                                        {successMessage && (
                                            <Alert
                                                message={successMessage}
                                                type="success"
                                                onClose={() => setSuccessMessage('')}
                                            />
                                        )}
                                        {errorMessage && (
                                            <Alert
                                                message={errorMessage}
                                                type="danger"
                                                onClose={() => setErrorMessage('')}
                                            />
                                        )}
                                        <div className="modal fade" id="staticBackdrop2"
                                             data-bs-keyboard="false" tabIndex="-1"
                                             aria-labelledby="staticBackdropLabel"
                                             aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Thông
                                                            báo</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Bạn có muốn xóa chương này không?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-outline-warning"
                                                                data-bs-dismiss="modal">No
                                                        </button>
                                                        <button onClick={handleDelete} type="button"
                                                                data-bs-dismiss="modal"
                                                                className="btn btn-outline-danger">Yes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        className='fs-6 link-warning link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
                                        to={`/comics/${comic.id}/chapters/${chapter.id}/pages`}>Quản lý trang</Link>
                                </td>
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
        </div>
    );
}

export default Chapters;