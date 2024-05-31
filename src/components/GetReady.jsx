import React from "react";
import BirdImage from "../assets/1.svg"

const GetReady = () => {
    return (
        <div className="relative max-w-[720px] h-screen w-screen">
            <div className="game-get-ready z-30">
                <img src={BirdImage} alt="" className="z-30"></img>
            </div>
        </div>
    )
}

export default GetReady