import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {searchComics} from "../../services/comicService";

const SearchResults = () => {
    const {searchTerm} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [comicList, setComicList] = useState([]);

    const loadAllComicsBySearchTerm = async () => {
        setLoading(true)
        try {
            const data = await searchComics(searchTerm);
            console.log("search", data)
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        }finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        loadAllComicsBySearchTerm();
    }, [searchTerm]);

    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };

    return (
        <div className="container bg-dark pt-1 pb-1">
            {loading && (
                <div className="overlay">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right small"></i>
                <span className="text-warning"> Tìm kiếm</span>
            </span>
            <h5 className="text-warning text-center">Kết quả tìm kiếm : "{searchTerm}"</h5>
            <div className="row">
                {comicList?.length > 0 ? (comicList.map((comic) => (
                    <div key={comic.id} onClick={() => handleNavigateComicDetailClick(comic.id)}
                         className="d-flex flex-column col-6 col-sm-6 col-md-4 col-lg-3 mt-3 hover-text">
                        <div className="card comic-card">
                            <div className="image-container">
                                <img className="card-img-top object-fit-cover comic-image"
                                     loading="lazy"
                                     src={comic.thumbnail}
                                     alt={comic.name}
                                     style={{width: "100%"}}/>
                            </div>
                            <div className="view-count d-flex justify-content-center p-1">
                                <div>
                                    <i className="bi bi-eye me-1 text-warning"></i>
                                    <span className="text-warning">{comic.views}</span>
                                </div>
                                <div className="ms-2">
                                    <i className="bi bi-chat-dots-fill me-1 text-warning"></i>
                                    <span className="text-warning">{comic.numberOfComment}</span>
                                </div>
                                <div className="ms-2">
                                    <i className="bi bi-heart-fill me-1 text-danger"></i>
                                    <span className="text-danger">{comic.favorites}</span>
                                </div>
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
        </div>
    );
};

export default SearchResults;