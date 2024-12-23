import React, {useEffect, useState} from "react";
import {createComic, deleteComic, getAllComics, updateComic} from "../../services/comicService";
import Alert from "../utils/Alert";
import SearchBar from "../SearchBar";
import {Link} from "react-router-dom";
import Select from "react-select";
import {getAllGenre, getAllGenreByComicId} from "../../services/genreService";
import '../../css/Loading.css'
import Pagination from "../utils/Pagination";

const customStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: "none", // Nền đen
        borderColor: "#444", // Màu viền xám
        color: "#fff", // Màu chữ trắng
        boxShadow: "none", // Loại bỏ shadow khi focus
        "&:hover": {
            borderColor: "#666", // Màu viền khi hover
        },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0.375rem 0.75rem", // Padding giống `input` Bootstrap
    }),
    placeholder: (base) => ({
        ...base,
        color: "#ccc", // Màu placeholder xám
    }),
    singleValue: (base) => ({
        ...base,
        color: "#fff", // Màu chữ của các giá trị đã chọn
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#000", // Nền menu dropdown đen
        color: "#fff", // Màu chữ trắng
        zIndex: 5 // Đảm bảo menu hiển thị phía trên các thành phần khác
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#333" : "#000", // Nền khi hover và nền mặc định
        color: "#fff", // Màu chữ trắng
        "&:active": {
            backgroundColor: "#555", // Màu khi nhấn chọn
        },
    }),
};
const Comics = () => {
    const token = localStorage.getItem("token");

    const [comicList, setComicList] = useState([]);
    const [filteredData, setFilteredData] = useState(comicList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(comicList);
    }, [comicList]);

    const totalPages = Math.ceil(comicList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [otherName, setOtherName] = useState("");
    const [status, setStatus] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");


    const [activate, setActivate] = useState(false);
    const [file, setFile] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now()); // Key để làm mới trường file

    const [genreOptions, setGenreOptions] = useState([]);

    const [selectedGenres, setSelectedGenres] = useState([]);


    const handleChange = (selectedOptions) => {
        setSelectedGenres(selectedOptions || []);
    };

    const [preview, setPreview] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const [showFullContent, setShowFullContent] = useState({});

    const [loading, setLoading] = useState(false);

    const toggleContentVisibilly = (index) => {
        setShowFullContent((prev) => (
            {
                ...prev,
                [index]: !prev[index],
            }
        ));
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(comicList);
        } else {
            const filtered = comicList.filter((item) =>
                item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1);
    };

    const handleEditClick = (comic) => {
        setId(comic.id);
        setName(comic.name);
        setOtherName(comic.otherName);
        setStatus(comic.status);
        setContent(comic.content);
        setAuthor(comic.author);
        setActivate(comic.activate);
        setFile(comic.thumbnail);
        loadGenreByComicId(comic.id);
    }

    const handleResetClick = () => {
        setName('');
        setOtherName('');
        setStatus('');
        setContent('');
        setAuthor('');
        setActivate(false);
        setFile(null);
        setPreview(null)
        setInputKey(Date.now());
        setSelectedGenres([]);
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const updatedGenres = selectedGenres.map((genre) => genre.value);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {
                success: successMessage
            } = await updateComic(id, name, otherName, status, content, author, activate, updatedGenres, file, token);
            setSuccessMessage(successMessage);
            await loadComic();
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleCreateSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const updatedGenres = selectedGenres.map((genre) => genre.value);
        setErrorMessage('');
        setErrorMessage('');
        try {
            const {
                success: successMessage
            } = await createComic(name, otherName, status, content, author, activate, updatedGenres, file, token);
            await loadComic();
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
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {success: successMessage} = await deleteComic(id, token);
            loadComic();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const loadGenreByComicId = async (comicId) => {
        try {
            const data = await getAllGenreByComicId(comicId, token);
            setSelectedGenres(
                data.genres.map((genre) => ({
                    value: genre.id,
                    label: genre.name
                }))
            );
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const loadComic = async () => {
        try {
            const data = await getAllComics(token);
            console.log("comics: ", data)
            const sortedData = [...data].sort((a, b) => {
                const dateA = new Date(a.createAt);
                const dateB = new Date(b.createAt);
                return dateB - dateA;
            });
            setComicList(sortedData);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const loadGenre = async () => {
        try {
            const data = await getAllGenre();
            setGenreOptions(
                data.map((genre) => ({
                    value: genre.id,
                    label: genre.name
                }))
            );
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        loadComic();
    }, [token]);

    useEffect(() => {
        loadGenre();
    }, [token]);
    return (
        <div className="container bg-dark pt-5 pb-5">
            <button onClick={handleResetClick} type="button" className="btn btn-outline-warning" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop">
                Tạo truyện
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
                            <h5 className="modal-title" id="staticBackdropLabel">Tạo truyện</h5>
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
                                    <label htmlFor="comicName" className="form-label">Tên truyện: </label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                           className="form-control"
                                           required id="comicName" placeholder="Nhập tên truyện mới"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="otherComicName" className="form-label">Tên khác: </label>
                                    <input type="text" value={otherName} onChange={(e) => setOtherName(e.target.value)}
                                           required className="form-control" id="otherComicName"
                                           placeholder="Nhập truyện có tên khác"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="authorName" className="form-label">Tác giả: </label>
                                    <input type="text" required value={author}
                                           onChange={(e) => setAuthor(e.target.value)}
                                           className="form-control" id="authorName" placeholder="Nhập tên tác giả"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="selectedGenres" className="form-label">Chọn Thể Loại: </label>
                                    <Select
                                        id="selectedGenres"
                                        options={genreOptions}
                                        isMulti
                                        styles={customStyles}
                                        onChange={handleChange}
                                        placeholder="Chọn thể loại"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">Tình trang: </label>
                                    <input type="text" required value={status}
                                           onChange={(e) => setStatus(e.target.value)}
                                           className="form-control" id="status" placeholder="Nhập tình trạng truyện"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Nội dung: </label>
                                    <textarea className="form-control" required value={content}
                                              onChange={(e) => setContent(e.target.value)}
                                              id="content" rows="5"></textarea>
                                </div>
                                <div className="mb-3">
                                    {preview ? (
                                        <img key={inputKey} src={preview} style={{width: "100px"}} loading="lazy"
                                             alt="Ảnh bìa xem trước"/>) : (
                                        <img key={inputKey} src={file} style={{width: "100px"}} alt={name}
                                             loading="lazy"/>
                                    )}
                                </div>
                                <div className="mb-3 input-group">
                                    <label htmlFor="coverPhoto" className="input-group-text">Tải
                                        lên ảnh bìa: </label>
                                    <input type="file"
                                           onChange={handleFileChange} required
                                           className="form-control"
                                           src={file}
                                           key={inputKey}
                                           id="coverPhoto"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Công khai: </label>
                                    <div className="form-check">
                                        <input onChange={() => setActivate(true)} className="form-check-input"
                                               type="radio"
                                               name="flexRadioDefault" id="flexRadioDefault1"/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            Có
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={() => setActivate(false)} className="form-check-input"
                                               type="radio"
                                               name="flexRadioDefault" id="flexRadioDefault2" checked={!activate}/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                            Không
                                        </label>
                                    </div>
                                </div>
                                <button type="submit"
                                        className="btn btn-outline-warning form-control">{loading ? 'Đang tạo truyện mới...' : 'Tạo truyện mới'}
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

            <h2 className="text-warning text-center">DANH SÁCH TRUYỆN ({comicList.length})</h2>
            <SearchBar onSearch={handleSearch}/>
            <div className="table-responsive">
                <table className="table table-dark table-hover table-bordered">
                    <thead className="text-center">
                    <tr>
                        <th className="col-auto">Tên truyện</th>
                        <th className="col-auto">Tên khác</th>
                        <th className="col-auto">Trạng thái</th>
                        <th className="col">Nội dung</th>
                        <th className="col-auto">Tác giả</th>
                        <th className="col-auto">Tình trạng</th>
                        <th className="col-auto">Ảnh bìa</th>
                        <th className="col-auto">Ngày tạo</th>
                        <th className="col-auto">Ngày cập nhật</th>
                        <th className="col-auto">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRows?.length > 0 ? (currentRows.map((comic, index) => (
                        <tr className="cursor-pointer" key={index}>
                            <td>{comic.name}</td>
                            <td>{comic.otherName}</td>
                            <td>{comic.status}</td>
                            <td>{showFullContent[index] || comic.content.length <= 200 ? comic.content : `${comic.content.substring(0, 100)}...`}
                                {comic.content.length > 200 && (
                                    <button className="btn btn-outline-warning btn-sm"
                                            onClick={() => toggleContentVisibilly(index)}>{showFullContent[index] ? "Ẩn bớt" : "Xem thêm"}</button>
                                )}
                            </td>
                            <td>{comic.author}</td>
                            <td>{comic.activate === true ? "ĐÃ CÔNG KHAI" : "CHƯA CÔNG KHAI"}</td>
                            <td><img src={comic.thumbnail} alt={comic.name} style={{width: "100px"}} loading="lazy"/>
                            </td>
                            <td>{new Date(comic.createAt).toLocaleString()}</td>
                            <td>{comic.updateAt === null ? "Chưa cập nhật" : new Date(comic.updateAt).toLocaleString()}</td>
                            <td>
                                <div className="d-flex">
                                    <button type="button" className="btn btn-outline-success me-2"
                                            onClick={() => handleEditClick(comic)}
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
                                         data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                                         aria-hidden="true">
                                        <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel">Cập nhật
                                                        truyện</h5>
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
                                                    <form onSubmit={handleUpdateSubmit} className="container">
                                                        <div className="mb-3">
                                                            <label htmlFor="comicName" className="form-label">Tên
                                                                truyện: </label>
                                                            <input type="text" value={name}
                                                                   onChange={(e) => setName(e.target.value)}
                                                                   className="form-control"
                                                                   required
                                                                   id="comicName" placeholder="Nhập tên truyện mới"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="otherComicName" className="form-label">Tên
                                                                khác: </label>
                                                            <input type="text" value={otherName}
                                                                   required
                                                                   onChange={(e) => setOtherName(e.target.value)}
                                                                   className="form-control" id="otherComicName"
                                                                   placeholder="Nhập truyện có tên khác"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="authorName" className="form-label">Tác
                                                                giả: </label>
                                                            <input type="text" value={author}
                                                                   required
                                                                   onChange={(e) => setAuthor(e.target.value)}
                                                                   className="form-control" id="authorName"
                                                                   placeholder="Nhập tên tác giả"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="selectedGenres" className="form-label">Chọn
                                                                Thể Loại: </label>
                                                            <Select
                                                                id="selectedGenres"
                                                                options={genreOptions}
                                                                value={selectedGenres}
                                                                isMulti
                                                                styles={customStyles}
                                                                onChange={handleChange}
                                                                placeholder="Chọn thể loại"
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="status" className="form-label">Tình
                                                                trang: </label>
                                                            <input type="text" value={status}
                                                                   required
                                                                   onChange={(e) => setStatus(e.target.value)}
                                                                   className="form-control" id="status"
                                                                   placeholder="Nhập tình trạng truyện"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="content" className="form-label">Nội
                                                                dung: </label>
                                                            <textarea className="form-control" value={content}
                                                                      required
                                                                      onChange={(e) => setContent(e.target.value)}
                                                                      id="content" rows="5"></textarea>
                                                        </div>
                                                        <div className="mb-3">
                                                            {preview ? (
                                                                <img key={inputKey} src={preview}
                                                                     style={{width: "100px"}}
                                                                     loading="lazy"
                                                                     alt="Ảnh bìa xem trước"/>) : (
                                                                <img key={inputKey} src={file} loading="lazy"
                                                                     style={{width: "100px"}}
                                                                     alt={name}/>
                                                            )}
                                                        </div>
                                                        <div className="mb-3 input-group">
                                                            <label htmlFor="coverPhoto" className="input-group-text">Tải
                                                                lên ảnh bìa: </label>
                                                            <input type="file"
                                                                   onChange={handleFileChange}
                                                                   className="form-control"
                                                                   src={file}
                                                                   key={inputKey}
                                                                   id="coverPhoto"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Công khai: </label>
                                                            <div className="form-check">
                                                                <input onChange={() => setActivate(true)}
                                                                       className="form-check-input" type="radio"
                                                                       checked={activate}
                                                                       name="flexRadioDefault" id="flexRadioDefault1"/>
                                                                <label className="form-check-label"
                                                                       htmlFor="flexRadioDefault1">
                                                                    Có
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input onChange={() => setActivate(false)}
                                                                       className="form-check-input" type="radio"
                                                                       name="flexRadioDefault" id="flexRadioDefault2"
                                                                       checked={!activate}/>
                                                                <label className="form-check-label"
                                                                       htmlFor="flexRadioDefault2">
                                                                    Không
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <button type="submit"
                                                                className="btn btn-outline-warning form-control">{loading ? 'Đang cập nhật truyện...' : 'Cập nhật truyện'}
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
                                            onClick={() => handleEditClick(comic)}
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
                                         data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                                         aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel">Thông báo</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    Bạn có muốn xóa truyện này không?
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-outline-warning"
                                                            data-bs-dismiss="modal">No
                                                    </button>
                                                    <button onClick={handleDelete} type="button" data-bs-dismiss="modal"
                                                            className="btn btn-outline-danger">Yes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    className='fs-6 link-warning link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
                                    to={`/admin/comics/${comic.id}/chapters`}>Quản lý chương</Link>
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
    )
}

export default Comics;