import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {searchComics} from "../../services/comicService";

const SearchResults = () => {
    const {searchTerm} = useParams();
    const navigate = useNavigate();
    const [comicList, setComicList] = useState([]);

    const loadAllComicsBySearchTerm = async () => {
        try {
            const data = await searchComics(searchTerm);
            setComicList(data);
        } catch (error) {
            console.log(error.message)
        }
    };
    useEffect(() => {
        loadAllComicsBySearchTerm();
    }, [searchTerm]);

    const handleNavigateComicDetailClick = (id) => {
        navigate(`/comics/${id}`);
    };

    return (
        <div className="container bg-dark p-5">
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