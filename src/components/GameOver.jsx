import React from "react";
import { useNavigate } from "react-router-dom";

import DurovBackground from "../assets/page.svg";
import ExitButtonImage from "../assets/img/Durov/exit.png";

const GameOver = () => {
    const navigate = useNavigate();

    const goToMain = () => {
        navigate('/');
    };

    return (
        <div
            className="relative max-w-[510px] h-screen w-screen mx-auto bg-no-repeat bg-center block bottom-[50px]"
            style={{
                backgroundImage: `url(${DurovBackground})`,
                backgroundSize: '404px 404px', // Set specific dimensions
            }}
        >
            <img
                src={ExitButtonImage}
                alt="Exit"
                onClick={goToMain}
                className="absolute z-30 top-[190px] right-[48px] cursor-pointer w-[40px] h-[40px]"
            />
        </div>
    );
};

export default GameOver;
