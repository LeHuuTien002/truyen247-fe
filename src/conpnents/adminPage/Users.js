import SearchBar from "../SearchBar";
import React, {useEffect, useState} from "react";
import Alert from "../utils/Alert";
import {deleteUser, getAllUser, updateUser} from "../../services/userService";
import Pagination from "../utils/Pagination";

const Users = () => {
    const token = localStorage.getItem("token");

    const [userList, setUserList] = useState([]);
    const [filteredData, setFilteredData] = useState(userList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [id, setId] = useState(null);
    const [activate, setActivate] = useState(false);

    useEffect(() => {
        setFilteredData(userList);
    }, [userList]);

    const totalPages = Math.ceil(userList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(userList);
        } else {
            const filtered = userList.filter((item) =>
                item.username && item.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1);
    };
    const loadUsers = async () => {
        try {
            const data = await getAllUser(token);
            console.log(data)
            setUserList(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    useEffect(() => {
        loadUsers();
    }, [token]);

    const handleResetClick = () => {
        setActivate(false);
    }

    const handleEditClick = (user) => {
        setId(user.id);
        setActivate(user.active);
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {success: successMessage} = await deleteUser(id, token);
            setSuccessMessage(successMessage);
            await loadUsers();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const {
                success: successMessage
            } = await updateUser(id, activate, token);
            setSuccessMessage(successMessage);
            await loadUsers();
            handleResetClick();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container bg-dark pt-5 pb-5">
            <h2 className="text-warning text-center">DANH SÁCH NGƯỜI DÙNG</h2>
            <SearchBar onSearch={handleSearch}/>
            <div className="table-responsive">
                <table className="table table-dark table-hover table-bordered" style={{fontSize: "0.8rem"}}>
                    <thead className="text-center">
                    <tr>
                        <th className="col-auto">Id</th>
                        <th className="col-auto">Tên</th>
                        <th className="col-auto">Email</th>
                        <th className="col">Ảnh</th>
                        <th className="col-auto">Loại tài khoản</th>
                        <th className="col-auto">Phân quyền</th>
                        <th className="col-auto">Đang hoạt động</th>
                        <th className="col-auto">Premium</th>
                        <th className="col-auto">Ngày hết hạn Premium</th>
                        <th className="col-auto">Ngày tạo</th>
                        <th className="col-auto">Ngày cập nhật</th>
                        <th className="col-auto">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {currentRows?.length > 0 ? (currentRows.map((user, index) => (
                        <tr className="cursor-pointer" key={index}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td><img src={user.picture} alt={user.username} style={{width: "80px"}} loading="lazy"/>
                            </td>
                            <td>{user.registrationType}</td>
                            <td>{user.roles.map((role) => role.replace("ROLE_", "")).join(", ")}</td>
                            <td>{user.active ? "Có" : "Không"}</td>
                            <td>{user.premium ? "Có" : "Không"}</td>
                            <td>{user.premiumExpiryDate}</td>
                            <td>{new Date(user.createAt).toLocaleString()}</td>
                            <td>{user.updateAt === null ? "Chưa cập nhật" : new Date(user.updateAt).toLocaleString()}</td>
                            <td>
                                <div className="d-flex">
                                    {/*Update*/}
                                    <button type="button" className="btn btn-outline-success me-2"
                                            onClick={() => handleEditClick(user)}
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
                                         data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                                         aria-hidden="true">
                                        <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel">Cập nhật tài
                                                        khoản</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleUpdateSubmit} className="container">
                                                        <div className="mb-3 text-start">
                                                            <label className="form-label">Đang hoạt động: </label>
                                                            <div className="form-check">
                                                                <input onChange={() => setActivate(true)}
                                                                       className="form-check-input" type="radio"
                                                                       checked={activate}
                                                                       name="avtive" id="active"/>
                                                                <label className="form-check-label"
                                                                       htmlFor="active">
                                                                    Có
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input onChange={() => setActivate(false)}
                                                                       className="form-check-input" type="radio"
                                                                       name="avtive" id="noActive"
                                                                       checked={!activate}/>
                                                                <label className="form-check-label"
                                                                       htmlFor="noActive">
                                                                    Không
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <button type="submit"
                                                                className="btn btn-outline-warning form-control">Cập
                                                            nhật tài khoản
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
                                            onClick={() => handleEditClick(user)}
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
                                                    Bạn có muốn xóa tài khoản này không?
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

export default Users;