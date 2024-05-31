import React from 'react';
import ForegroundImage from '../assets/foreground.svg';

const Foreground = () => {
    return (
        <div className="relative max-w-[720px] h-screen w-screen z-20">
            <div className="game-foreground z-20">
                <img src={ForegroundImage} alt="" className="mt-[-78px] absolute z-20"></img>
            </div>
        </div>
    )
};

export default Foreground;
