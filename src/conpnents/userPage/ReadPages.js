import {useParams} from "react-router-dom";
import {getAllPageByChapterId} from "../../services/pageService";
import React, {useEffect, useState} from "react";
import Page from "./Page";
import '../../css/CustomPage.css'
import ChapterBar from "./ChapterBar";

const ReadPages = () => {
    const [pageList, setPageList] = useState([]);
    const token = localStorage.getItem("token");
    const {chapterId} = useParams();

    const loadPage = async () => {
        try {
            const data = await getAllPageByChapterId(chapterId, token);
            const sortedData = data.sort((a, b) => a.pageNumber - b.pageNumber);
            setPageList(sortedData);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadPage();
    }, [token, chapterId]);

    return (
        <div>
            <ChapterBar chapterId={chapterId}/>
            <div className='container pb-5 pt-5 bg-dark'>
                <div className="comic-reader">
                    {pageList.map((imageSrc) => (
                        <Page key={imageSrc?.id} imageSrc={imageSrc?.imageUrl}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ReadPages;