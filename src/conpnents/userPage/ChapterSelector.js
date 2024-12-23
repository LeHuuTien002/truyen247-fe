import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate, useParams} from "react-router-dom";
import {getChaptersByComicId} from "../../services/chapterService";
import {getUserId} from "../utils/auth";
import useHistoryHandler from "../utils/useHistoryHandler";

function ChapterSelector({chapterId, isScrolling, scrollSpeed, setIsScrolling, setScrollSpeed}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const [position, setPosition] = useState('below'); // Mặc định modal hiển thị bên dưới

    const [chapterList, setChapterList] = useState([]);
    const token = localStorage.getItem("token");
    const {comicId} = useParams();

    useHistoryHandler({
        userId: Number(getUserId()),
        comicId: Number(comicId),
        chapterId: Number(chapterId),
        token: token
    });

    const [selectedIndex, setSelectedIndex] = useState(null);

    const loadChapter = async () => {
        try {
            const data = await getChaptersByComicId(getUserId(), comicId, token);
            const sortedData = data.sort((a, b) => b.chapterNumber - a.chapterNumber);
            const foundChapter = data.find(chapter => chapter.id === Number(chapterId));
            setSelectedIndex(foundChapter?.chapterNumber);
            setChapterList(sortedData);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadChapter();
    }, [chapterId]);


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (rect.bottom > viewportHeight / 2) {
                setPosition('above');
            } else {
                setPosition('below');
            }
        }
    }, [isOpen]);

    const toggleDropdown = () => {
        setSearchTerm('');
        setIsOpen(!isOpen);
    };

    const selectChapter = (chapter) => {
        setSelectedIndex(chapter?.chapterNumber);
        handleNavigatePages(chapter?.id)
        setIsOpen(false);
    };

    const goToNextChapter = () => {
        if (selectedIndex < chapterList.length) {
            setSelectedIndex((prevIndex) => prevIndex + 1);
            const foundChapter = chapterList.find(chapter => chapter.chapterNumber === Number(selectedIndex + 1));
            handleNavigatePages(foundChapter?.id);
        }
    };

    const goToPreviousChapter = () => {
        if (selectedIndex > 1) {
            setSelectedIndex((prevIndex) => prevIndex - 1);
            const foundChapter = chapterList.find(chapter => chapter.chapterNumber === Number(selectedIndex - 1));
            handleNavigatePages(foundChapter?.id);
        }
    };

    const filteredChapters = chapterList.filter((chapter) =>
        chapter.chapterNumber.toString().includes(searchTerm)
    );

    const navigate = useNavigate();
    const handleNavigatePages = (chapterId) => {
        navigate(`/comics/${comicId}/chapters/${chapterId}/pages`);
    };

    return (
        <div className="position-relative">
            <div className="d-flex align-items-center container" ref={dropdownRef}>
                <Link to={'/'} title='Trang chủ' className="navbar-brand fs-2"><i
                    className="bi bi-house hover-text"></i></Link>
                <Link to={`/comics/${comicId}`} title='Danh sách chương' className="navbar-brand fs-1 ms-2 me-2"><i
                    className="bi bi-list-task hover-text"></i></Link>
                <button
                    onClick={goToPreviousChapter}
                    className="btn btn-outline-warning btn-sm"
                    disabled={selectedIndex <= 1}
                >
                    &lt;
                </button>
                <button onClick={toggleDropdown} className="btn btn-outline-warning mx-2 btn-sm d-flex">
                    <span className="d-block">{selectedIndex}</span>
                    <span className="d-block"> ▼</span>
                </button>
                <button
                    onClick={goToNextChapter}
                    className="btn btn-outline-warning btn-sm"
                    disabled={selectedIndex >= chapterList.length}
                >
                    &gt;
                </button>
                <button className="btn btn-outline-warning btn-sm ms-1" onClick={() => setIsScrolling(!isScrolling)}>
                    {isScrolling ? "Stop" : "Auto"}
                </button>
                {isScrolling && (
                    <input
                        className=" small-range ms-1"
                        type="range"
                        id="scrollSpeed"
                        min="1"
                        max="10"
                        value={scrollSpeed}
                        onChange={(e) => setScrollSpeed(Number(e.target.value))}
                    />
                )}
            </div>

            {isOpen && (
                <div
                    className="position-absolute border rounded bg-dark shadow p-3"
                    style={{
                        top: position === 'below' ? '100%' : 'auto',
                        bottom: position === 'above' ? '100%' : 'auto',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '300px',
                        zIndex: 1050,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <div className="sticky-top bg-dark p-2 border-bottom">
                        <input
                            type="text"
                            placeholder="Nhập số chap, ví dụ: 1"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div
                        className="p-2"
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                        }}
                    >
                        <div className="row g-2">
                            {filteredChapters.length > 0 ? (
                                filteredChapters.map((chapter, index) => (
                                    <div className="col-4" key={chapter.id}>
                                        <button
                                            onClick={() => selectChapter(chapter)}
                                            className={`btn ${selectedIndex === chapter?.chapterNumber ? 'btn-warning' : 'btn-outline-secondary'} w-100`}
                                            style={{
                                                fontSize: '12px',
                                                whiteSpace: 'normal',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                padding: '5px',
                                                height: 'auto',
                                            }}
                                        >
                                            {chapter.chapterNumber}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Không tìm thấy chương</p>
                            )}
                        </div>
                    </div>
                    <button onClick={toggleDropdown} className="btn btn-outline-warning w-100 mt-2">
                        Đóng
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChapterSelector;
