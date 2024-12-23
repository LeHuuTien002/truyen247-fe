import React, {useEffect, useState} from 'react';
import {createGenre, deleteGenre, getAllGenre, updateGenre} from "../../services/genreService";
import Alert from "../utils/Alert";
import SearchBar from "../SearchBar";
import Pagination from "../utils/Pagination";

const Genres = () => {
    const token = localStorage.getItem("token");
    const [genreList, setGenreList] = useState([]);
    const [filteredData, setFilteredData] = useState(genreList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(genreList);
    }, [genreList]);

    const totalPages = Math.ceil(genreList.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [id, setId] = useState(null);


    const handleEditClick = (genre) => {
        setName(genre.name);
        setId(genre.id);
        setDescription(genre.description);
    }

    const handleResetClick = () => {
        setId(null);
        setName('');
        setDescription('');
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(genreList);
        } else {
            const filtered = genreList.filter((item) =>
                item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1);
    };

    const handleCreateSubmit = async (e) => {
        setErrorMessage('');
        e.preventDefault();
        try {
            const {success: successMessage} = await createGenre(name, description, token);
            loadGenre();
            setSuccessMessage(successMessage);
            setName("");
            setDescription("");
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {success: successMessage} = await updateGenre(id, name, description, token);
            loadGenre();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {success: successMessage} = await deleteGenre(id, token);
            loadGenre();
            setSuccessMessage(successMessage);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const loadGenre = async () => {
        try {
            const data = await getAllGenre();
            setGenreList(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        loadGenre();
    }, []);

    return (
        <div className="container bg-dark pt-5 pb-5">
            <button onClick={handleResetClick} type="button" className="btn btn-outline-warning" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop0">
                Tạo thể loại truyện
            </button>
            <div className="modal fade" id="staticBackdrop0" data-bs-keyboard="false"
                 tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Tạo thể loại truyện</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateSubmit} className="container">
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
                                <div className="mb-3 mt-3">
                                    <label htmlFor="storyGenreName">Tên thể loại:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        id="storyGenreName"
                                        placeholder="Nhập tên thể loại truyện"
                                        name="storyGenreName"
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Mô tả: </label>
                                    <textarea
                                        required
                                        className="form-control"
                                        id="description"
                                        value={description}
                                        name="description"
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="5">
                                        </textarea>
                                </div>
                                <button type="submit" className="btn btn-outline-warning form-control mb-3">
                                    <span>Tạo</span>
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
            <h2 className="text-warning text-center">DANH SÁCH THỂ LOẠI TRUYỆN</h2>
            <SearchBar onSearch={handleSearch}/>
            <table className="table table-dark table-hover text-center table-bordered overflow-y: hidden">
                <thead className="text-center">
                <tr>
                    <th>Tên Thể Loại</th>
                    <th>Mô Tả</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {currentRows.length > 0 ? (currentRows.map((genre, index) => (
                        <tr key={index}>
                            <td>{genre.name}</td>
                            <td>{genre.description}</td>
                            <td>{new Date(genre.createAt).toLocaleString()}</td>
                            <td>{new Date(genre.updateAt).toLocaleString()}</td>

                            <td>
                                <div className="d-flex justify-content-center">
                                    {/*Update*/}
                                    <button type="button" className="btn btn-outline-success me-2"
                                            onClick={() => handleEditClick(genre)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop1">
                                        <i className="bi bi-pencil-square"></i>
                                    </button>

                                    <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static"
                                         data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                                         aria-hidden="true">
                                        <div className="modal-dialog modal-lg">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel">Cập nhật thể loại
                                                        truyện</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleUpdateSubmit}>
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
                                                        <div className="mb-3 mt-3">
                                                            <label htmlFor="storyGenreName">Tên thể loại:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="storyGenreName"
                                                                placeholder="Nhập tên thể loại truyện"
                                                                name="storyGenreName"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="description" className="form-label">Mô
                                                                tả: </label>
                                                            <textarea
                                                                required
                                                                className="form-control"
                                                                id="description"
                                                                name="description"
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                                rows="10">
                                                        </textarea>
                                                        </div>
                                                        <button type="submit"
                                                                className="btn btn-outline-warning form-control mb-3"><span>Cập nhật</span>
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
                                            onClick={() => handleEditClick(genre)}
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop">
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
                                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static"
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
                                                    Bạn có muốn xóa thể loại truyện này không?
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
                            </td>
                        </tr>
                    )))
                    : (<tr>
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
    );
};

export default Genres;
