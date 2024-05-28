import DurovImage from "../assets/durov.svg";
import DurovButton from "../assets/durov-button.svg"
import React from "react";

const Durov = () => {
    return (
        <>
            <button className="durov-button mr-[25px]">
                <img className="absolute mr-[3px] mt-[1px]" src={DurovButton} alt="Durov Button"/>
                <img src={DurovImage} alt="Durov Button"/>
            </button>
        </>
    )
}

export default Durov;