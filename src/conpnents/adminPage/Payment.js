import React, {useEffect, useState} from "react";
import {getPayments, getPendingPayments} from "../../services/paymentService";
import SearchBar from "../SearchBar";

const Payment = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    const [paymentList, setPaymentList] = useState([]);
    const [filteredData, setFilteredData] = useState(paymentList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);


    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setFilteredData(paymentList); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [paymentList]);

    const totalPages = Math.ceil(paymentList?.length / rowsPerPage);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [id, setId] = useState(null);
    const [premium, setPremium] = useState(false);
    const [duration, setDuration] = useState(null);

    const loadUsers = async () => {
        try {
            const data = await getPendingPayments(token);
            console.log(data)
            setPaymentList(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    useEffect(() => {
        loadUsers();
    }, [token]);

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredData(paymentList); // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
        } else {
            const filtered = paymentList.filter((item) => {
                if (!isNaN(searchTerm)) {
                    // Nếu searchTerm là số, tìm kiếm theo chapterNumber
                    return item.id && item.id === parseInt(searchTerm);
                } else {
                    // Nếu searchTerm là chuỗi, tìm kiếm theo title
                    return item.transactionId && item.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
            setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
        }
        setCurrentPage(1); // Reset về trang đầu tiên sau khi tìm kiếm
    };


    const fetchPayments = async () => {
        try {
            const data = await getPayments(token);
            setPaymentList(data);
        }catch (error){
            setErrorMessage(error.message);
        }
    };
    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="container bg-dark p-5">
            <h2 className="text-warning text-center">DANH SÁCH THANH TOÁN</h2>
            <SearchBar onSearch={handleSearch}/>
            <div className="table-responsive">
                <table className="table table-dark table-hover table-bordered" style={{fontSize: "0.8rem"}}>
                    <thead className="text-center">
                    <tr>
                        <th className="col-auto">ID</th>
                        <th className="col-auto">Số tiền</th>
                        <th className="col-auto">Mã thanh toán</th>
                        <th className="col-auto">Trạng thái</th>
                        <th className="col-auto">Ngày tạo</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {currentRows?.length > 0 ? (currentRows.map((payment, index) => (
                        <tr className="cursor-pointer" key={index}>
                            <td>{payment.id}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.paymentCode}</td>
                            <td className={
                                payment.status === 'PENDING' ? 'text-warning' :
                                    payment.status === 'COMPLETED' ? 'text-success' :
                                        payment.status === 'CANCELLED' ? 'text-danger' :
                                            'text-muted'
                            }>
                                {payment.status}
                            </td>
                            <td>{new Date(payment.createdAt).toLocaleString()}</td>
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
    )
}

export default Payment