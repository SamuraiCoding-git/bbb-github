import DurovImage from "../assets/durov.svg";
import DurovButton from "../assets/durov-button.svg"
import React from "react";
import {useNavigate} from "react-router-dom";

const Durov = () => {
    const navigate = useNavigate();

    const goToDurov = () => {
        navigate("/durov");
    }

    return (
        <>
            <button className="durov-button ml-[-15px]" onClick={goToDurov}>
                <img className="absolute mr-[3px] mt-[1px]" src={DurovButton} alt="Durov Button"/>
                <img src={DurovImage} alt="Durov Button"/>
            </button>
        </>
    )
}

export default Durov;