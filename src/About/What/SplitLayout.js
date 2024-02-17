import React from 'react';
import './What.scss'; 

const SplitLayout = ({ title, description, hashtags, imageSrc }) => {
    return (
        <div className="split-layout">
            <div className="text-side">
                <h2 style={{ fontWeight: 'bold' }}>{title}</h2>
                <p style={{ padding: '20px 0px' }}>{description}</p>
                <p style={{ textAlign: 'left', color: '#838383' }}>{hashtags}</p>
            </div>
            <div className="image-side">
                <img src={imageSrc} />
            </div>
        </div>
    );
};

export default SplitLayout;
