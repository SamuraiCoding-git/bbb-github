import CloseButtonImage from "../assets/close-button.svg";
import React from "react";
import {useNavigate} from "react-router-dom";

const CloseButton = () => {
    const navigate = useNavigate();

    const goToMain = () => {
        navigate('/');
    };

    return (
        <>
            <button className="close-button" onClick={goToMain}>
                <img src={CloseButtonImage} alt="Close"/>
            </button>
        </>
    )
}

export default CloseButton;
