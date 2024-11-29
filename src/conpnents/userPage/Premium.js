import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUserById} from "../../services/userService";
import {getUserId} from "../utils/auth";
import {createPayment} from "../../services/paymentService";

const Premium = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [user, setUser] = useState(null); // Dữ liệu user
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [amount, setAmount] = useState(0);
    const [paymentCode, setPaymentCode] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    useEffect(() => {
        if (amount && paymentMethod) {
            handleCreatePayment();
        }
    }, [amount, paymentMethod, paymentCode]);

    const generatePaymentCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "SEVQR"; // Tiền tố bắt đầu bằng SEVQR
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handlePremiumYear = () => {
        setAmount(200000);
        setPaymentMethod("Chuyển khoản ngân hàng");
        setPaymentCode(generatePaymentCode());
    }

    const handlePremiumMonth = () => {
        setAmount(20000);
        setPaymentMethod("Chuyển khoản ngân hàng");
        setPaymentCode(generatePaymentCode());
    }

    const handleNavigateLogin = () => {
        navigate('/login')
    }

    const handleCreatePayment = async () => {
        setErrorMessage('');
        setSuccessMessage("");
        try {
            const response = await createPayment(getUserId(), amount, paymentCode, paymentMethod, token);
            console.log(response)
            setPaymentDetails(response)
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const fetchUser = async () => {
        try {
            const response = await getUserById(getUserId());
            console.log(response)
            setUser(response); // Lưu dữ liệu user
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    // Fetch user data từ API
    useEffect(() => {
        fetchUser();
    }, [token]);

    // Loading state
    if (loading) {
        return <p>Loading...</p>;
    }

    // Error state
    if (error) {
        return <div className="container bg-dark p-5">
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
        <div className="container bg-dark p-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Nâng cấp tài khoản</span>
            </span>
            <h3 className="text-warning text-center mt-1">Truyen247 Premium</h3>
            <p className="text-warning text-center">Mở khóa tất cả các truyện bào gồm các chương</p>
            {user.premium === true ? (
                <div className="text-center">
                    <p>Bạn đã đăng ký gói Premium</p>
                    <p>Hạn đến: {user.premiumExpiryDate}</p>
                </div>
            ) : (
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
                                        onClick={handlePremiumYear}
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
                                        onClick={handlePremiumMonth}
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
            )}
            {paymentDetails && (
                <div className="mt-4 p-4 border rounded bg-dark text-light shadow-lg">
                    <h3 className="text-center text-info mb-4">Thông tin thanh toán</h3>
                    <div className="mb-3">
                        <p className="mb-1">
                            <span className="fw-bold text-warning">Số tiền:</span> {paymentDetails.amount} VNĐ
                        </p>
                        <p className="mb-1">
                            <span className="fw-bold text-warning">Phương thức:</span> {paymentDetails.paymentMethod}
                        </p>
                        <p className="mb-3">
                            <span className="fw-bold text-warning">Trạng thái:</span>{" "}
                            <span
                                className={`badge ${
                                    paymentDetails.status === "PENDING" ? "bg-warning text-dark" : "bg-success"
                                }`}
                            >
                    {paymentDetails.status}
                </span>
                        </p>
                    </div>
                    <hr className="border-secondary"/>
                    <h4 className="text-light mb-3">Chuyển khoản ngân hàng</h4>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-dark text-light">
                            <span className="fw-bold">Ngân hàng:</span> SCB
                        </li>
                        <li className="list-group-item bg-dark text-light">
                            <span className="fw-bold">Số tài khoản:</span> 03365066668
                        </li>
                        <li className="list-group-item bg-dark text-light">
                            <span className="fw-bold">Tên tài khoản:</span> LE HUU TIEN
                        </li>
                        <li className="list-group-item bg-dark text-light">
                            <span className="fw-bold">Nội dung:</span> {paymentCode}
                        </li>
                    </ul>
                    <div className="alert alert-warning mt-3 text-center" role="alert">
                        <strong>Chú ý:</strong> Bạn chỉ có thể tạo thanh toán mới sau 5 phút.
                    </div>
                    <div className="alert alert-warning mt-3 text-center" role="alert">
                        <strong>Chú ý:</strong> Nội dung thanh toán phải trùng khớp: {paymentCode}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Premium;