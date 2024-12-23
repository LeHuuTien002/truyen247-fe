import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    createPage,
    deletePage,
    getPageByChapterId,
    getPagesByChapterId
} from "../../services/pageService";
import Alert from "../utils/Alert";
import '../../css/Loading.css'
import SearchBar from "../SearchBar";
import Pagination from "../utils/Pagination";

const Pages = () => {
    const token = localStorage.getItem("token");
    const [pageList, setPageList] = useState([]);
    const [filteredData, setFilteredData] = useState(pageList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(pageList);
    }, [pageList]);

    const totalPages = Math.ceil(pageList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const {comicId, chapterId} = useParams();
    const [pageId, setPageId] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now()); // Key để làm mới trường file
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(pageList); // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
        } else {
            const filtered = pageList.filter((item) => {
                // Chỉ tìm kiếm nếu searchTerm là số
                if (!isNaN(searchTerm)) {
                    return item.pageNumber && item.pageNumber === parseInt(searchTerm);
                }
                return false; // Không tìm kiếm nếu searchTerm không phải là số
            });
            setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
        }
        setCurrentPage(1); // Reset về trang đầu tiên sau khi tìm kiếm
    };


    const handleEditClick = (page) => {
        setPageId(page.id);
    }

    const loadChapter = async () => {
        setLoading(true);
        try {
            const data = await getPagesByChapterId(chapterId, token);
            setChapter(data);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadPage = async () => {
        setLoading(true);
        try {
            const data = await getPageByChapterId(chapterId, token);
            const sortedData = data.sort((a, b) => b.pageNumber - a.pageNumber);
            console.log("pages: ", sortedData);
            setPageList(sortedData);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);

        const urls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleCreateSubmit = async (e) => {
        setErrorMessage('');
        setErrorMessage('');
        setLoading(true)
        e.preventDefault();
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        try {
            const {
                success: successMessage
            } = await createPage(chapterId, formData, token);
            loadPage();
            setSuccessMessage(successMessage);
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    }


    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true)
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {success: successMessage} = await deletePage(chapterId, pageId, token);
            loadPage();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleResetClick = () => {
        setPreviewUrls([])
        setInputKey(Date.now());
    }

    useEffect(() => {
        loadChapter();
        loadPage();
    }, [chapterId]);
    return (
        <div className="container bg-dark pt-5 pb-5">
            <span> <Link to={`/admin/comics/${comicId}/chapters`}
                         className="text-decoration-none">Quản lý chương </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Danh sách trang</span>
            </span>
            <h2 className="text-warning text-center">QUẢN LÝ CHƯƠNG</h2>
            <div className="container mt-3">
                <h5 className="text-center">Chương {chapter?.chapterNumber}: <span>{chapter?.title}</span></h5>
                <button onClick={handleResetClick} type="button" className="btn btn-outline-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop">
                    Tạo trang
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
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Tạo trang</h5>
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
                                    {previewUrls.length > 0 && (
                                        <div className="mb-3">
                                            <h6 className="mb-3">Ảnh Xem Trước:</h6>
                                            <div className="d-flex flex-wrap gap-3">
                                                {previewUrls.map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="rounded shadow-sm border"
                                                        style={{
                                                            width: "50px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-3 input-group">
                                        <label htmlFor="coverPhoto" className="input-group-text">Tải
                                            lên trang truyện: </label>
                                        <input type="file"
                                               multiple
                                               onChange={handleFileChange} required
                                               className="form-control"
                                               key={inputKey}
                                               id="coverPhoto"/>
                                    </div>
                                    <button type="submit"
                                            className="btn btn-outline-warning form-control">{loading ? 'Đang tạo trang...' : 'Tạo trang mới'}
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
                <h2 className="text-warning text-center">DANH SÁCH TRANG ({pageList.length})</h2>
                <SearchBar onSearch={handleSearch}/>
                <div className="table-responsive">
                    <table className="table table-dark table-hover table-bordered">
                        <thead className="text-center">
                        <tr>
                            <th className="col-auto">Số trang</th>
                            <th className="col-auto">Ảnh trang</th>
                            <th className="col-auto">Ngày tạo</th>
                            <th className="col-auto">Ngày cập nhật</th>
                            <th className="col-auto">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {currentRows?.length > 0 ? (currentRows.map((page, index) => (
                            <tr className="cursor-pointer" key={index}>
                                <td>{page.pageNumber}</td>
                                <td><img src={page.imageUrl} alt={page.pageNumber} style={{width: "100px"}}
                                         loading="lazy"/>
                                </td>
                                <td>{new Date(page.createAt).toLocaleString()}</td>
                                <td>{page.updateAt === null ? "Chưa cập nhật" : new Date(page.updateAt).toLocaleString()}</td>
                                <td>
                                    <div className="d-flex justify-content-center">
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
                                        <button type="button"
                                                onClick={() => handleEditClick(page)}
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
                                        <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static"
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
                                                        Bạn có muốn xóa trang này không?
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
    )
}

export default Pages;