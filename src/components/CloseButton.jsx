import CloseButtonImage from "../assets/close-button.svg";
import BackSound from "../assets/audio/back.wav";
import React from "react";
import { useNavigate } from "react-router-dom";

const CloseButton = () => {
    const navigate = useNavigate();

    const playBackSound = () => {
        const sound = new Audio(BackSound); // Создаем новый аудио-элемент при каждом нажатии
        sound.play();
    };

    const goToMain = () => {
        navigate('/');
        playBackSound();
    };

    return (
        <>
            <button className="close-button" onClick={goToMain}>
                <img src={CloseButtonImage} alt="Close"/>
            </button>
        </>
    );
}

export default CloseButton;
