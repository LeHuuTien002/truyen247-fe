import {useParams} from "react-router-dom";
import {getAllPageByChapterId} from "../../services/pageService";
import React, {useEffect, useState} from "react";
import Page from "../utils/Page";
import "../../css/CustomPage.css";
import ChapterBar from "./ChapterBar";

const ReadPages = () => {
    const token = localStorage.getItem("token");
    const [pageList, setPageList] = useState([]);
    const [loading, setLoading] = useState(false);
    const {chapterId} = useParams();
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(2); // Tốc độ cuộn (pixel/step)

    useEffect(() => {
        let interval;
        if (isScrolling) {
            interval = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 30);
        }
        return () => clearInterval(interval);
    }, [isScrolling, scrollSpeed]);

    const loadPage = async () => {
        setLoading(true)
        try {
            const data = await getAllPageByChapterId(chapterId);
            const sortedData = data.sort((a, b) => a.pageNumber - b.pageNumber);
            setPageList(sortedData);
        } catch (error) {
            console.log(error.message);
        }finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadPage();
    }, [chapterId]);

    return (
        <div>
            {loading && (
                <div className="overlay">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <ChapterBar chapterId={chapterId} isScrolling={isScrolling} scrollSpeed={scrollSpeed}
                        setIsScrolling={setIsScrolling} setScrollSpeed={setScrollSpeed}/>
            <div className="container pb-1 pt-1 bg-dark">
                <div className="comic-reader">
                    {pageList.map((imageSrc) => (
                        <Page key={imageSrc?.id} imageSrc={imageSrc?.imageUrl}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReadPages;
