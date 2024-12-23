import React, {useState, useEffect} from 'react';
import '../../css/ChapterBar.css';
import ChapterSelector from "./ChapterSelector";

const ChapterBar = ({chapterId, isScrolling, scrollSpeed, setIsScrolling,setScrollSpeed}) => {
    const [scrollDirection, setScrollDirection] = useState(null);
    const [lastScrollTop, setLastScrollTop] = useState(0);


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                setScrollDirection('down');
            } else if (scrollTop < lastScrollTop) {
                setScrollDirection('up');
            }
            setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop); // Không cho phép giá trị âm
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    return (
        <div>
            <div className={`chapter-bar top ${scrollDirection === 'up' ? 'visible' : ''}`}>
                <ChapterSelector chapterId={chapterId} isScrolling={isScrolling} scrollSpeed={scrollSpeed} setIsScrolling={setIsScrolling} setScrollSpeed={setScrollSpeed}/>
            </div>
            <div className={`chapter-bar bottom ${scrollDirection === 'down' ? 'visible' : ''}`}>
                <ChapterSelector chapterId={chapterId} isScrolling={isScrolling} scrollSpeed={scrollSpeed} setIsScrolling={setIsScrolling} setScrollSpeed={setScrollSpeed}/>
            </div>
        </div>
    );
};

export default ChapterBar;
