import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUserById} from "../../services/userService";
import {getUserId} from "../utils/auth";
import {createPayment} from "../../services/paymentService";
import {getAllQRCodes} from "../../services/qrPaymentService";
import Alert from "../utils/Alert";

const Premium = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [paymentList, setPaymentList] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [disabled, setDisabled] = useState(null);

    const [bankName, setBankName] = useState('');
    const [QRCode, setQRCode] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [amount, setAmount] = useState(null);
    const [paymentCode, setPaymentCode] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isGetPremium, setIsGetPremium] = useState(true);

    const handleClick = (index, payment) => {
        setDisabled(index);
        handleGetPremiumClick(payment)
    }

    const loadPremiumPayment = async () => {
        setLoading(true)
        try {
            const data = await getAllQRCodes();
            console.log(data)
            setPaymentList(data);
        } catch (error) {
            setErrorMessage(error.message);
        }finally {
            setLoading(false)
        }
    };

    const generatePaymentCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = ""; // Tiền tố bắt đầu bằng SEVQR
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    useEffect(() => {
        loadPremiumPayment();
    }, []);

    const handleGetPremiumClick = (payment) => {
        setIsOpen(true)
        setIsGetPremium(false)
        setAmount(payment.amount)
        setBankName(payment.bankName)
        setCardName(payment.cardName)
        setCardNumber(payment.cardNumber)
        setQRCode(payment.qrcode)
        setPaymentMethod("Chuyển khoản ngân hàng");
        setPaymentCode(payment.paymentContent + generatePaymentCode())
    }

    const handleNavigateLogin = () => {
        navigate('/login')
    }

    const handleCreatePayment = async () => {
        setLoading(true)
        setErrorMessage('');
        setSuccessMessage("");
        try {
            const response = await createPayment(getUserId(), amount, paymentCode, paymentMethod, token);
            if (response.status === "COMPLETED") {
                window.location.reload();
            }
            if (response.status === "PENDING") {
                setErrorMessage("Đang chờ xử lý!");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }finally {
            setLoading(false)
        }
    }

    const fetchUser = async () => {
        setLoading(true)
        try {
            const response = await getUserById(getUserId(), token);
            setUser(response)
        } catch (err) {
            setError(err.message);
        }finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (error) {
        return <div className="container bg-dark pt-1 pb-1">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Nâng cấp tài khoản</span>
            </span>
            <h3 className="text-warning text-center mt-1">Truyen247 Premium</h3>
            <p className="text-warning text-center">Mở khóa tất cả các truyện bào gồm các chương</p>
            <div className="container mt-3">
                <div className="row">
                    {/* Free Plan */}
                    <div className="col-12 col-sm-6 col-md-4 mb-4">
                        <div
                            className="card text-center shadow-sm"
                            style={{
                                borderRadius: "15px",
                                transition: "transform 0.3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <div className="card-body">
                                <h2
                                    className="card-title"
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Free
                                </h2>
                                <p
                                    className="price display-4"
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        color: "#ffc107",
                                    }}
                                >
                                    0đ<span className="text-muted"></span>
                                </p>
                                <ul
                                    className="list-unstyled text-start"
                                    style={{
                                        padding: "0",
                                        listStyle: "none",
                                    }}
                                >
                                    <li>✅ Đọc tất cả các truyện</li>
                                    <li>✅ Mỗi truyện đọc 5 chương đầu tiên</li>
                                    <li>❌ Không hỗ trợ</li>
                                </ul>
                                <button
                                    className="btn btn-outline-warning"
                                    style={{
                                        fontSize: "1rem",
                                        width: "100%",
                                    }}
                                >
                                    Get Free
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Premium Year Plan */}
                    <div className="col-12 col-sm-6 col-md-4 mb-4">
                        <div
                            className="card text-center shadow-sm border-success"
                            style={{
                                borderRadius: "15px",
                                transition: "transform 0.3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <div className="card-body">
                                <h2
                                    className="card-title"
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Premium
                                </h2>
                                <p
                                    className="price display-4"
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        color: "#ffc107",
                                    }}
                                >
                                    200.000đ<span className="text-muted">/Năm</span>
                                </p>
                                <ul
                                    className="list-unstyled text-start"
                                    style={{
                                        padding: "0",
                                        listStyle: "none",
                                    }}
                                >
                                    <li>✅ Đọc tất cả các truyện</li>
                                    <li>✅ Mở khóa tất cả các chương truyện</li>
                                    <li>✅ Hỗ trợ</li>
                                </ul>
                                <button
                                    onClick={handleNavigateLogin}
                                    className="btn btn-warning"
                                    style={{
                                        fontSize: "1rem",
                                        width: "100%",
                                    }}
                                >
                                    Get Plus
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Premium Month Plan */}
                    <div className="col-12 col-sm-6 col-md-4 mb-4">
                        <div
                            className="card text-center shadow-sm border-success"
                            style={{
                                borderRadius: "15px",
                                transition: "transform 0.3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <div className="card-body">
                                <h2
                                    className="card-title"
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Premium
                                </h2>
                                <p
                                    className="price display-4"
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        color: "#ffc107",
                                    }}
                                >
                                    20.000đ<span className="text-muted">/Tháng</span>
                                </p>
                                <ul
                                    className="list-unstyled text-start"
                                    style={{
                                        padding: "0",
                                        listStyle: "none",
                                    }}
                                >
                                    <li>✅ Đọc tất cả các truyện</li>
                                    <li>✅ Mở khóa tất cả các chương truyện</li>
                                    <li>✅ Hỗ trợ</li>
                                </ul>
                                <button
                                    onClick={handleNavigateLogin}
                                    className="btn btn-warning"
                                    style={{
                                        fontSize: "1rem",
                                        width: "100%",
                                    }}
                                >
                                    Get Plus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
    return (
        <div className="container bg-dark pt-1 pb-1">
            {loading && (
                <div className="overlay">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <p><Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Nâng cấp tài khoản</span>
            </p>
            <h4 className="text-warning text-center mt-1">Truyen247 Premium</h4>
            <p className="text-warning text-center">Mở khóa tất cả các truyện bào gồm các chương</p>
            {user?.premium === false ? (
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 mb-4">
                            <div
                                className="card text-center shadow-sm"
                                style={{
                                    borderRadius: "15px",
                                    transition: "transform 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <div className="card-body">
                                    <h2
                                        className="card-title"
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Free
                                    </h2>
                                    <p
                                        className="price display-4"
                                        style={{
                                            fontSize: "2rem",
                                            fontWeight: "bold",
                                            color: "#ffc107",
                                        }}
                                    >
                                        0đ<span className="text-muted"></span>
                                    </p>
                                    <ul
                                        className="list-unstyled text-start"
                                        style={{
                                            padding: "0",
                                            listStyle: "none",
                                        }}
                                    >
                                        <li>✅ Đọc tất cả các truyện</li>
                                        <li>✅ Mỗi truyện đọc 5 chương đầu tiên</li>
                                        <li>❌ Không hỗ trợ</li>
                                    </ul>
                                    <button
                                        className="btn btn-outline-warning"
                                        style={{
                                            fontSize: "1rem",
                                            width: "100%",
                                        }}
                                    >
                                        Get Free
                                    </button>
                                </div>
                            </div>
                        </div>

                        {paymentList.length > 0 && (paymentList.map((payment, index) => (
                            <div key={index}
                                 className="col-12 col-sm-6 col-md-4 mb-4">
                                <div
                                    className="card text-center shadow-sm border-success"
                                    style={{
                                        borderRadius: "15px",
                                        transition: "transform 0.3s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                    <div className="card-body">
                                        <h2
                                            className="card-title"
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Premium
                                        </h2>
                                        <p
                                            className="price display-4"
                                            style={{
                                                fontSize: "2rem",
                                                fontWeight: "bold",
                                                color: "#ffc107",
                                            }}
                                        >
                                            {payment.amount.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                            <span
                                                className="text-muted">/{payment.amount === 20000 ? "Tháng" : "Năm"}</span>
                                        </p>
                                        <ul
                                            className="list-unstyled text-start"
                                            style={{
                                                padding: "0",
                                                listStyle: "none",
                                            }}
                                        >
                                            <li>✅ Đọc tất cả các truyện</li>
                                            <li>✅ Mở khóa tất cả các chương truyện</li>
                                            <li>✅ Hỗ trợ</li>
                                        </ul>
                                        <button
                                            onClick={() => handleClick(index, payment)}
                                            className="btn btn-warning"
                                            style={{
                                                fontSize: "1rem",
                                                width: "100%",
                                            }}
                                            disabled={disabled === index}
                                        >
                                            Get Plus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )))}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p>Bạn đã đăng ký gói Premium</p>
                    <p>Hạn đến: {user?.premiumExpiryDate}</p>
                </div>
            )}
            {errorMessage && (<Alert message={errorMessage} type="warning" onClose={() => setErrorMessage('')}/>)}
            {isOpen && (
                <div className="mt-4 p-4 border rounded bg-dark text-light shadow-lg">
                    <h3 className="text-center text-info mb-4">Thông tin thanh toán</h3>
                    <div className="mb-3">
                        <p><span className="fw-bold text-warning">Số tiền:</span> {amount} VNĐ</p>
                        <p><span className="fw-bold text-warning">Phương thức:</span> {paymentMethod}</p><p>
                        <span className="fw-bold text-warning">Trạng thái:</span>{" "}<span
                        className="badge bg-warning">PENDING</span></p>
                        <p><span className="fw-bold text-warning">Ngân hàng:</span> {bankName}
                        </p>
                        <p>
                            <span className="fw-bold text-warning">Tên tài khoản:</span> {cardName}
                        </p>
                        <p>
                            <span className="fw-bold text-warning">Số tài khoản:</span> {cardNumber}
                        </p>
                        <p>
                            <span className="fw-bold text-warning">Nội dung:</span> {paymentCode}
                        </p>
                    </div>
                    <div className="text-center">
                        <img src={QRCode} alt={bankName} style={{width: "250px"}}
                             loading="lazy"/>
                    </div>
                    <div className="alert alert-warning mt-3 text-center" role="alert">
                        <strong>Chú ý:</strong> Nội dung thanh toán phải trùng
                        khớp: {paymentCode}
                    </div>
                    <button onClick={handleCreatePayment} className="btn btn-outline-warning form-control">Xác nhận đã
                        thanh toán
                    </button>
                </div>
            )}

        </div>
    )
}

export default Premium;