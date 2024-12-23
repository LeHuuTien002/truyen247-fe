import React, {useEffect, useState} from "react";
import {getPayments, getPendingPayments} from "../../services/paymentService";
import SearchBar from "../SearchBar";
import Pagination from "../utils/Pagination";

const Payment = () => {
    const token = localStorage.getItem("token");
    const [paymentList, setPaymentList] = useState([]);
    const [filteredData, setFilteredData] = useState(paymentList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

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
            setFilteredData(paymentList);
        } else {
            const filtered = paymentList.filter((item) =>
                item.paymentCode && item.paymentCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1);
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

export default Payment