import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DurovBackground from "../assets/page.svg";
import ExitButtonImage from "../assets/img/Durov/exit.png";
import Dead from "../assets/img/Dead/dead.svg";
import Restart from "../assets/img/Dead/restart.svg";
import Scull from "../assets/img/Dead/scull.svg";

const GameOver = ({ onRestart }) => {
    const navigate = useNavigate();
    const gameOverRef = useRef(null);

    const goToMain = () => {
        navigate('/');
    };

    useEffect(() => {
        const gameOverElement = gameOverRef.current;
        if (gameOverElement) {
            gameOverElement.style.transform = 'translateY(-100%)';
            gameOverElement.style.transition = 'transform 0.5s ease-in-out';
            requestAnimationFrame(() => {
                gameOverElement.style.transform = 'translateY(0)';
            });
        }
    }, []);

    return (
        <div
            ref={gameOverRef}
            className="absolute max-w-[510px] h-screen w-screen mx-auto bg-no-repeat bg-center block bottom-[50px] z-40"
            style={{
                backgroundImage: `url(${DurovBackground})`,
                backgroundSize: '404px 404px',
                transform: 'translateY(-100%)',
            }}
        >
            <div className="flex h-[100dvh] justify-center items-center flex-col space-y-4">
                <img className="absolute w-64 h-64 z-50" src={Scull} alt="Scull" />
                <img className="absolute w-72 z-50" style={{backgroundSize: '150px'}} src={Dead} alt="Dead" />
                <img
                    className="w-72 z-50 cursor-pointer absolute top-1/2 -translate-y-[50%]"
                    src={Restart}
                    alt="Restart"
                    onClick={onRestart}
                />
            </div>
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
