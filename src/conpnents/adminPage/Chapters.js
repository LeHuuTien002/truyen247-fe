import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {getInfoComicForChapterList} from "../../services/comicService";
import Alert from "../utils/Alert";
import {
    createChapter,
    deleteChapter, getAllChapter,
    updateChapterByComicId
} from "../../services/chapterService";
import SearchBar from "../SearchBar";
import Pagination from "../utils/Pagination";

const Chapters = () => {
    const token = localStorage.getItem("token");
    const [chapterList, setChapterList] = useState([]);
    const [filteredData, setFilteredData] = useState(chapterList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Số hàng mỗi trang

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(chapterList);
    }, [chapterList]);

    const totalPages = Math.ceil(chapterList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const [chapterId, setChapterId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState(null);

    const loadComic = async () => {
        setLoading(true)
        try {
            const data = await getInfoComicForChapterList(comicId);
            console.log(data)
            setComic(data);
        } catch (error) {
            setErrorMessage(error.message);
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
                    return item.chapterNumber !== undefined && item.chapterNumber === parseInt(searchTerm, 10);
                } else {
                    return item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
            setFilteredData(filtered);
        }
        setCurrentPage(1);
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
        setLoading(true)
        try {
            const data = await getAllChapter(comicId, token);
            console.log("chapters: ", data)
            const sortedData = data.sort((a, b) => b.chapterNumber - a.chapterNumber);
            setChapterList(sortedData);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleCreateSubmit = async (e) => {
        setSuccessMessage('');
        setErrorMessage('');
        setLoading(true)
        e.preventDefault();
        try {
            const {
                success: successMessage
            } = await createChapter(comicId, title, chapterNumber, token);
            setSuccessMessage(successMessage);
            await loadChapter();
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setLoading(true)
        try {
            const {
                success: successMessage
            } = await updateChapterByComicId(comicId, chapterId, title, chapterNumber, token);
            setSuccessMessage(successMessage);
            await loadChapter();
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setLoading(true)
        try {
            const {success: successMessage} = await deleteChapter(comicId, chapterId, token);
            await loadChapter();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadComic();
        loadChapter();
    }, [comicId]);


    return (
        <div className="container bg-dark pt-5 pb-5">
            <span> <Link to={`/admin/comics`} className="text-decoration-none">Quản lý truyện</Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Danh sách chương</span>
            </span>
            <h2 className="text-warning text-center">QUẢN LÝ CHƯƠNG</h2>
            <div className="container mt-3">
                <h5 className="text-center">{comic?.name}</h5>
                <p className="text-center">[Cập nhật lúc: <span>{new Date(comic?.updateAt).toLocaleString()}</span>]</p>
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
                                {loading && (
                                    <div className="overlay">
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleCreateSubmit} className="container">
                                    <div className="mb-3">
                                        <label htmlFor="comicName" className="form-label">Tiêu đề: </label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                               className="form-control"
                                               required id="comicName" placeholder="Nhập tiêu đề"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="otherComicName" className="form-label">Số chương: </label>
                                        <input type="number" value={chapterNumber} min={0}
                                               onChange={(e) => setChapterNumber(e.target.value)}
                                               required className="form-control" id="otherComicName"
                                               placeholder="Nhập số chương"/>
                                    </div>
                                    <button type="submit"
                                            className="btn btn-outline-warning form-control"> {loading ? 'Đang tạo chương...' : 'Tạo chương mới'}
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
                <h2 className="text-warning text-center">DANH SÁCH CHƯƠNG ({chapterList.length})</h2>
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
                                <td>{new Date(chapter?.createAt).toLocaleString()}</td>
                                <td>{chapter?.updateAt === null ? "Chưa cập nhật" : new Date(comic?.updateAt).toLocaleString()}</td>
                                <td>
                                    <div className="d-flex justify-content-center">
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
                                                            chương</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body text-start">
                                                        {loading && (
                                                            <div className="overlay">
                                                                <div className="spinner-border text-warning"
                                                                     role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <form onSubmit={handleUpdateSubmit} className="container">
                                                            <div className="mb-3">
                                                                <label htmlFor="title" className="form-label">Tiêu
                                                                    đề: </label>
                                                                <input type="text" value={title}
                                                                       onChange={(e) => setTitle(e.target.value)}
                                                                       className="form-control"
                                                                       id="title"
                                                                       required
                                                                       placeholder="Nhập tiêu đề chương"/>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="otherComicName" className="form-label">Số
                                                                    chương: </label>
                                                                <input type="text" value={chapterNumber}
                                                                       onChange={(e) => setChapterNumber(e.target.value)}
                                                                       className="form-control" id="otherComicName"
                                                                       required
                                                                       placeholder="Nhập số chương"/>
                                                            </div>
                                                            <button type="submit"
                                                                    className="btn btn-outline-warning form-control"> {loading ? 'Đang cập nhật chương...' : 'Cập nhật chương'}
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
                                                        {loading && (
                                                            <div className="overlay">
                                                                <div className="spinner-border text-warning"
                                                                     role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        Bạn có muốn xóa chương này không?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-outline-warning"
                                                                data-bs-dismiss="modal">Không
                                                        </button>
                                                        <button onClick={handleDelete} type="button"
                                                                data-bs-dismiss="modal"
                                                                className="btn btn-outline-danger"> {loading ? 'Đang xóa...' : 'Xóa'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        className='fs-6 link-warning link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
                                        to={`/admin/comics/${comic.id}/chapters/${chapter.id}/pages`}>Quản lý
                                        trang</Link>
                                </td>
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
        </div>
    );
}

export default Chapters;