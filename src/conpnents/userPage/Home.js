import {Link, useNavigate} from "react-router-dom";
import {getAllComicsIsActive} from "../../services/comicService";
import React, {useEffect, useState} from "react";
import '../../css/Home.css';

const Home = () => {
    const [comicList, setComicList] = useState([]);
    const [filteredData, setFilteredData] = useState(comicList);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20; // Số hàng mỗi trang

    // Tính toán số trang và hàng hiển thị
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

    useEffect(() => {
        setFilteredData(comicList); // Khởi tạo filteredData với toàn bộ dữ liệu ban đầu
    }, [comicList]);

    const totalPages = Math.ceil(comicList?.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigate = useNavigate();
    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };

    const loadComic = async () => {
        try {
            const data = await getAllComicsIsActive();
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    useEffect(() => {
        loadComic();
    }, []);


    return (
        <div className="bg-dark container">
            <div>
                <div className="container pt-3">
                    <h3 className="text-warning">Truyen247 đề cử</h3>
                    <div id="demo" className="carousel slide mt-3" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#demo" data-bs-slide-to="0"
                                    className="active bg-light"></button>
                            <button className="bg-light" type="button" data-bs-target="#demo"
                                    data-bs-slide-to="1"></button>
                            <button className="bg-light" type="button" data-bs-target="#demo"
                                    data-bs-slide-to="2"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img
                                    src="https://i.pinimg.com/736x/6a/99/f7/6a99f7ba6ce7273491dd8903a8b600f0.jpg"
                                    alt="Doraemon" className="d-block"
                                    loading="lazy"
                                    style={{width: "100%"}}/>
                                <div className="carousel-caption text-white">
                                    <h3>One Piece</h3>
                                    <p>Ta đã trở lại !</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img
                                    loading="lazy"
                                    src="https://i.pinimg.com/originals/40/65/ad/4065ad52e0b968c6fb152d4bcbfd3ac9.jpg"
                                    alt="Chicago" className="d-block" style={{width: "100%"}}/>
                                <div className="carousel-caption text-white">
                                    <h3>Conan</h3>
                                    <p>Thank you, Chicago!</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img
                                    loading="lazy"
                                    src="https://i.pinimg.com/originals/bf/ea/a7/bfeaa7ed50da2cad0528cc8d3076b051.jpg"
                                    alt="One piece" className="d-block" style={{width: "100%"}}/>
                                <div className="carousel-caption text-white">
                                    <h3>One piece</h3>
                                    <p>We love the Big Apple!</p>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#demo"
                                data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#demo"
                                data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-8 mt-3">
                            <h5 className="text-warning">Truyen247 - Truyện tranh online </h5>
                            <div className="row">
                                {currentRows?.length > 0 ? (currentRows.map((comic, index) => (
                                    <div key={index} onClick={() => handleNavigateComicDetailClick(comic.id)}
                                         className="col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                                        <div className="card comic-card">
                                            <div className="image-container">
                                                <img className="card-img-top object-fit-cover comic-image"
                                                     loading="lazy"
                                                     src={comic.thumbnail}
                                                     alt={comic.name}
                                                     style={{width: "100%"}}/>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <span className="card-title fs-6"><strong>{comic.name}</strong></span>
                                        </div>
                                    </div>
                                ))) : (<tr>
                                    <td colSpan="5" className="text-center">Không tìm thấy kết quả</td>
                                </tr>)}
                            </div>
                            <nav className="mt-3">
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
                        <div className="col-0 col-sm-0 col-md-0 col-lg-4 mt-3">
                            <div className="row">
                                <div className="col col-sm col-md col-lg">
                                    <h6 className="text-warning">Lịch sử đọc tại Truyen247</h6>
                                </div>
                                <div className="col col-sm col-md col-lg text-end">
                                    <Link to="/history" className="text-warning text-decoration-none">Xem tất
                                        cả</Link>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-3 col-sm-3 col-md-3 col-lg-4">
                                    <img className="col-12 card"
                                         loading="lazy"
                                         src="https://pops-images-vn.akamaized.net/api/v2/containers/file2/cms_thumbnails/thumb_640x960_1-d123b3c838d6-1702442749558-0b3FJ3jT.jpg?v=0&maxW=420&format=webp"/>
                                </div>
                                <div className="col-9 col-sm-9 col-md-9 col-lg-8">
                                    <h6>Doraemon</h6>
                                    <span>Đọc tiếp chapter 1 ></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3 col-sm-3 col-md-3 col-lg-4">
                                    <img className="col-12 card"
                                         loading="lazy"
                                         src="https://pops-images-vn.akamaized.net/api/v2/containers/file2/cms_thumbnails/640x960-c270acfe693e-1710298245456-JmEm93uZ.jpg?v=0&maxW=420&format=webp"/>
                                </div>
                                <div className="col-9 col-sm-9 col-md-9 col-lg-8">
                                    <h6>Bệ Hạ Kiếp ...</h6>
                                    <span>Đọc tiếp chapter 1 ></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3 col-sm-3 col-md-3 col-lg-4">
                                    <img className="col-12 card"
                                         loading="lazy"
                                         src="https://pops-images-vn.akamaized.net/api/v2/containers/file2/cms_thumbnails/kvp1-f48b6e39f706-1685529517775-cR8F9qIh.png?v=0&maxW=420&format=webp"/>
                                </div>
                                <div className="col-9 col-sm-9 col-md-9 col-lg-8">
                                    <h6>Anh Trai Tôi Là ...</h6>
                                    <span>Đọc tiếp chapter 1 ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home;