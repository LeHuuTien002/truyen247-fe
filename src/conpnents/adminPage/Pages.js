import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {createPage, deletePage, getAllPageByChapterId, getChapterById, updatePage} from "../../services/pageService";
import Alert from "../Alert";
import SearchBar from "../SearchBar";

const Pages = () => {
    const [pageList, setPageList] = useState([]);
    const [filteredData, setFilteredData] = useState(pageList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(pageList); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [pageList]);

    const totalPages = Math.ceil(pageList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const {id} = useParams();
    const [pageId, setPageId] = useState(null);
    const token = localStorage.getItem("token");
    const [chapter, setChapter] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now()); // Key để làm mới trường file

    const [preview, setPreview] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [pageNumber, setPageNumber] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setImageUrl(selectedFile);

        // Tạo URL xem trước
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

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
        setPageNumber(page.pageNumber);
        setImageUrl(page.imageUrl);
    }

    const loadChapter = async () => {
        try {
            const data = await getChapterById(id, token);
            console.log(data)
            setChapter(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const loadPage = async () => {
        try {
            const data = await getAllPageByChapterId(id, token);
            const sortedData = data.sort((a, b) => b.pageNumber - a.pageNumber);
            setPageList(sortedData);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleCreateSubmit = async (e) => {
        setErrorMessage('');
        setErrorMessage('');
        e.preventDefault();
        try {
            const {
                success: successMessage
            } = await createPage(id, pageNumber, imageUrl, token);
            loadPage();
            setSuccessMessage(successMessage);
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
            } = await updatePage(pageId, pageNumber, imageUrl, token);
            setSuccessMessage(successMessage);
            loadPage();
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
            const {success: successMessage} = await deletePage(id, pageId, token);
            loadPage();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleResetClick = () => {
        setPageNumber('');
        setImageUrl(null);
        setPreview(null)
        setInputKey(Date.now()); // Đặt lại key để làm mới trường file
    }

    useEffect(() => {
        loadChapter();
        loadPage();
    }, [token, id]);
    return (
        <div className="container bg-dark p-5">
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
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Tạo trang</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/*<Comic/>*/}
                                <form onSubmit={handleCreateSubmit} className="container">
                                    <div className="mb-3">
                                        <label htmlFor="comicName" className="form-label">Số trang: </label>
                                        <input type="number" value={pageNumber}
                                               onChange={(e) => setPageNumber(e.target.value)}
                                               className="form-control"
                                               required id="comicName" placeholder="Nhập tên truyện mới"/>
                                    </div>

                                    {preview ? (
                                        <img className="mb-3" key={inputKey} src={preview} style={{width: "100px"}} loading="lazy"
                                             alt="Ảnh bìa xem trước"/>) : (
                                        <img className="mb-3" key={inputKey} src={imageUrl} style={{width: "100px"}} loading="lazy"/>
                                    )}
                                    <div className="mb-3 input-group">
                                        <label htmlFor="coverPhoto" className="input-group-text">Tải
                                            lên trang truyện: </label>
                                        <input type="file"
                                               onChange={handleFileChange} required
                                               className="form-control"
                                               src={imageUrl}
                                               key={inputKey}
                                               id="coverPhoto"/>
                                    </div>
                                    <button type="submit" className="btn btn-outline-warning form-control">Tạo trang
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
                <h2 className="text-warning text-center">DANH SÁCH TRANG</h2>
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
                                <td><img src={page.imageUrl} alt={page.pageNumber} style={{width: "100px"}} loading="lazy"/>
                                </td>
                                <td>{page.createAt}</td>
                                <td>{page.updateAt === null ? "Chưa cập nhật" : page.updateAt}</td>
                                <td>
                                    <div className="d-flex justify-content-center">
                                        {/*Update*/}
                                        <button type="button" className="btn btn-outline-success me-2"
                                                onClick={() => handleEditClick(page)}
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
                                        <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static"
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
                                                                <label htmlFor="comicName" className="form-label">Số
                                                                    trang: </label>
                                                                <input type="number" min="1" value={pageNumber}
                                                                       onChange={(e) => setPageNumber(e.target.value)}
                                                                       className="form-control"
                                                                       id="comicName"
                                                                       placeholder="Nhập số trang"/>
                                                            </div>
                                                            <div className="mb-3">
                                                                {preview ? (
                                                                    <img key={inputKey} src={preview} loading="lazy"
                                                                         style={{width: "100px"}}
                                                                         alt="Ảnh bìa xem trước"/>) : (
                                                                    <img key={inputKey} src={imageUrl} loading="lazy"
                                                                         style={{width: "100px"}}/>
                                                                )}
                                                            </div>
                                                            <div className="mb-3 input-group">
                                                                <label htmlFor="coverPhoto"
                                                                       className="input-group-text">Tải
                                                                    lên ảnh bìa: </label>
                                                                <input type="file"
                                                                       onChange={handleFileChange} required
                                                                       className="form-control"
                                                                       src={imageUrl}
                                                                       key={inputKey}
                                                                       id="coverPhoto"/>
                                                            </div>
                                                            <button type="submit"
                                                                    className="btn btn-outline-warning form-control">Cập
                                                                nhật
                                                                truyện
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
                                                        Bạn có muốn xóa truyện này không?
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
    )
}

export default Pages;