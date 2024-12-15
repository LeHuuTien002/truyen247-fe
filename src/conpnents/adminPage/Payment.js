import React, {useEffect, useState} from "react";
import {getPayments, getPendingPayments} from "../../services/paymentService";
import SearchBar from "../SearchBar";

const Payment = () => {
    const token = localStorage.getItem("token");
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

    const loadUsers = async () => {
        try {
            const data = await getPendingPayments(token);
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
            const filtered = paymentList.filter((item) =>
                item.paymentCode && item.paymentCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
        }
        setCurrentPage(1); // Reset về trang đầu tiên sau khi tìm kiếm
    };


    const fetchPayments = async () => {
        try {
            const data = await getPayments(token);
            setPaymentList(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="container bg-dark pt-5 pb-5">
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
                        {/* Nút Previous */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
                                <i className="bi bi-chevron-left"></i> {/* Mũi tên trái */}
                            </button>
                        </li>

                        {/* Trang đầu tiên */}
                        {currentPage > 3 && (
                            <>
                                <li className="page-item">
                                    <button className="page-link" onClick={() => handleClick(1)}>
                                        1
                                    </button>
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            </>
                        )}

                        {/* Các trang xung quanh trang hiện tại */}
                        {Array.from({length: totalPages}, (_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 2 && page <= currentPage + 2)
                            ) {
                                return (
                                    <li key={i} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handleClick(page)}>
                                            {page}
                                        </button>
                                    </li>
                                );
                            }
                            return null;
                        })}

                        {/* Trang cuối cùng */}
                        {currentPage < totalPages - 2 && (
                            <>
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                                <li className="page-item">
                                    <button className="page-link" onClick={() => handleClick(totalPages)}>
                                        {totalPages}
                                    </button>
                                </li>
                            </>
                        )}

                        {/* Nút Next */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
                                <i className="bi bi-chevron-right"></i> {/* Mũi tên phải */}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Payment