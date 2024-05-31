import React from 'react';
import dayImage from '../assets/background.svg';

const Background = () => {
    return (
        <div className="relative max-w-[720px] h-screen w-screen z-10">
            <div className="game-background z-10">
                <img src={dayImage} alt="" className="ml-[-250px] mt-[-750px]"></img>
            </div>
        </div>
    )
};

export default Background;
