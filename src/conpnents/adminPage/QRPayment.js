import Alert from "../utils/Alert";
import React, {useEffect, useState} from "react";
import {createQRCode, deleteQRCode, getAllQRCodes, updateQRCode} from "../../services/qrPaymentService";
import SearchBar from "../SearchBar";
import Pagination from "../utils/Pagination";

const QRPayment = () => {
    const [qrPaymentList, setQrPaymentList] = useState([]);
    const [filteredData, setFilteredData] = useState(qrPaymentList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(qrPaymentList);
    }, [qrPaymentList]);

    const totalPages = Math.ceil(qrPaymentList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const token = localStorage.getItem("token");
    const [id, setId] = useState(null);
    const [bankName, setBankName] = useState("");
    const [file, setFile] = useState(null);
    const [paymentContent, setPaymentContent] = useState("");
    const [amount, setAmount] = useState(0);
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState("");
    const [inputKey, setInputKey] = useState(Date.now()); // Key để làm mới trường file
    const [preview, setPreview] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const data = await createQRCode(bankName, cardName, cardNumber, paymentContent, amount, file, token);
        if (data.status === 200) {
            setSuccessMessage(data.message)
            await loadQRPayments();
            handleResetClick();
        } else {
            setErrorMessage(data.message);
        }
    }

    const handleEditClick = (qrPayment) => {
        setId(qrPayment.id);
        setBankName(qrPayment.bankName);
        setCardName(qrPayment.cardName)
        setCardNumber(qrPayment.cardNumber)
        setAmount(qrPayment.amount)
        setPaymentContent(qrPayment.paymentContent);
        setFile(qrPayment.qrcode);
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(qrPaymentList);
        } else {
            const filtered = qrPaymentList.filter((item) =>
                item.bankName && item.bankName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1);
    };

    const handleResetClick = () => {
        setBankName('');
        setCardNumber('')
        setCardName('')
        setAmount(0);
        setPaymentContent('');
        setFile(null);
        setPreview(null)
        setInputKey(Date.now());
    }

    const loadQRPayments = async () => {
        try {
            const data = await getAllQRCodes();
            console.log(data)
            setQrPaymentList(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = await updateQRCode(id, bankName, cardName, cardNumber, paymentContent, amount, file, token);
        if (data.status === 200) {
            setSuccessMessage(data.message)
            await loadQRPayments();
            handleResetClick();
        } else {
            setErrorMessage(data.message);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const data = await deleteQRCode(id, token);
        if (data.status === 200) {
            setSuccessMessage(data.message)
            await loadQRPayments();
        } else {
            setErrorMessage(data.message);
        }
    };

    useEffect(() => {
        loadQRPayments();
    }, [token]);

    return (
        <div className="container bg-dark pt-5 pb-5">
            <button onClick={handleResetClick} type="button" className="btn btn-outline-warning" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop">
                Tạo thanh toán
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
                            <h5 className="modal-title" id="staticBackdropLabel">Tạo thông tin thanh toán</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateSubmit} className="container">
                                <div className="mb-3">
                                    <label htmlFor="bankName" className="form-label">Tên ngân hàng: </label>
                                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)}
                                           className="form-control"
                                           required id="bankName" placeholder="Nhập tên ngân hàng"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cardName" className="form-label">Tên
                                        thẻ: </label>
                                    <input type="text" value={cardName}
                                           onChange={(e) => setCardName(e.target.value)}
                                           className="form-control"
                                           required id="cardName"
                                           placeholder="Nhập tên chủ thẻ"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cardNumber" className="form-label">Số tài khoản: </label>
                                    <input type="number" value={cardNumber}
                                           onChange={(e) => setCardNumber(e.target.value)}
                                           className="form-control"
                                           required id="cardNumber"
                                           placeholder="Nhập số tài khoản thẻ"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label">Giá tiền: </label>
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                           required className="form-control" id="amount"
                                           placeholder="Nhập giá tiền"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="paymentContent" className="form-label">Nội dung thanh toán: </label>
                                    <input type="text" required value={paymentContent}
                                           onChange={(e) => setPaymentContent(e.target.value)}
                                           className="form-control" id="paymentContent"
                                           placeholder="Nhập Nội dung thành toán"/>
                                </div>
                                <div className="mb-3">
                                    {preview ? (
                                        <img key={inputKey} src={preview} style={{width: "100px"}} loading="lazy"
                                             alt="Ảnh bìa xem trước"/>) : (
                                        <img key={inputKey} src={file} style={{width: "100px"}} alt={bankName}
                                             loading="lazy"/>
                                    )}
                                </div>
                                <div className="mb-3 input-group">
                                    <label htmlFor="coverPhoto" className="input-group-text">Tải
                                        QRCode: </label>
                                    <input type="file"
                                           onChange={handleFileChange} required
                                           className="form-control"
                                           src={file}
                                           key={inputKey}
                                           id="coverPhoto"/>
                                </div>
                                <button type="submit" className="btn btn-outline-warning form-control">Tạo thanh toán
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
            <h2 className="text-warning text-center">DANH SÁCH TRUYỆN</h2>
            <SearchBar onSearch={handleSearch}/>
            <div className="table-responsive">
                <table className="table table-dark table-hover table-bordered text-center">
                    <thead>
                    <tr>
                        <th className="col-auto">Tên ngân hàng</th>
                        <th className="col-auto">Tên thẻ</th>
                        <th className="col-auto">Số tài khoản</th>
                        <th className="col-auto">Số tiền</th>
                        <th className="col-auto">Nội dung thanh toán</th>
                        <th className="col">QRCode</th>
                        <th className="col-auto">Ngày tạo</th>
                        <th className="col-auto">Ngày cập nhật</th>
                        <th className="col-auto">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRows?.length > 0 ? (currentRows.map((qrPayment, index) => (
                        <tr className="cursor-pointer" key={index}>
                            <td>{qrPayment.bankName}</td>
                            <td>{qrPayment.cardName}</td>
                            <td>{qrPayment.cardNumber}</td>
                            <td>{qrPayment.amount}</td>
                            <td>{qrPayment.paymentContent}</td>
                            <td><img src={qrPayment.qrcode} alt={qrPayment.bankName} style={{width: "100px"}}
                                     loading="lazy"/>
                            </td>
                            <td>{new Date(qrPayment.createdAt).toLocaleString()}</td>
                            <td>{qrPayment.updatedAt === null ? "Chưa cập nhật" : new Date(qrPayment.updatedAt).toLocaleString()}</td>
                            <td>
                                <div className="d-flex">
                                    {/*Update*/}
                                    <button type="button" className="btn btn-outline-success me-2"
                                            onClick={() => handleEditClick(qrPayment)}
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
                                    <div className="modal fade text-start" id="staticBackdrop1"
                                         data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                                         aria-hidden="true">
                                        <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel">Cập thanh
                                                        toán</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleUpdateSubmit} className="container">
                                                        <div className="mb-3">
                                                            <label htmlFor="bankName" className="form-label">Tên ngân
                                                                hàng: </label>
                                                            <input type="text" value={bankName}
                                                                   onChange={(e) => setBankName(e.target.value)}
                                                                   className="form-control"
                                                                   required id="bankName"
                                                                   placeholder="Nhập tên ngân hàng"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="cardName" className="form-label">Tên
                                                                thẻ: </label>
                                                            <input type="text" value={cardName}
                                                                   onChange={(e) => setCardName(e.target.value)}
                                                                   className="form-control"
                                                                   required id="cardName"
                                                                   placeholder="Nhập tên chủ thẻ"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="cardNumber" className="form-label">Số tài
                                                                khoản: </label>
                                                            <input type="text" value={cardNumber}
                                                                   onChange={(e) => setCardNumber(e.target.value)}
                                                                   className="form-control"
                                                                   required id="cardNumber"
                                                                   placeholder="Nhập số tài khoản thẻ"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="amount" className="form-label">Giá
                                                                tiền: </label>
                                                            <input type="number" value={amount}
                                                                   onChange={(e) => setAmount(e.target.value)}
                                                                   required className="form-control" id="amount"
                                                                   placeholder="Nhập giá tiền"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="paymentContent" className="form-label">Nội
                                                                dung thanh toán: </label>
                                                            <input type="text" required value={paymentContent}
                                                                   onChange={(e) => setPaymentContent(e.target.value)}
                                                                   className="form-control" id="paymentContent"
                                                                   placeholder="Nhập Nội dung thành toán"/>
                                                        </div>
                                                        <div className="mb-3">
                                                            {preview ? (
                                                                <img key={inputKey} src={preview}
                                                                     style={{width: "100px"}} loading="lazy"
                                                                     alt="Ảnh bìa xem trước"/>) : (
                                                                <img key={inputKey} src={file} style={{width: "100px"}}
                                                                     alt={bankName}
                                                                     loading="lazy"/>
                                                            )}
                                                        </div>
                                                        <div className="mb-3 input-group">
                                                            <label htmlFor="coverPhoto" className="input-group-text">Tải
                                                                QRCode: </label>
                                                            <input type="file"
                                                                   onChange={handleFileChange} required
                                                                   className="form-control"
                                                                   src={file}
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
                                            onClick={() => handleEditClick(qrPayment)}
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
                                                    Bạn có muốn xóa phương thức thanh toán này không?
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

export default QRPayment;