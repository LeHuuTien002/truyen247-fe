import React from 'react';
import '../../css/CustomPage.css';

const Page = ({imageSrc}) => {
    return (
        <div className="comic-page">
            <img loading="lazy" src={imageSrc} alt="Comic page"/>
        </div>
    );
};

export default Page;
