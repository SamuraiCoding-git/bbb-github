import DurovImage from "../assets/durov.svg";
import React from "react";

const Durov = () => {
    return (
        <>
            <button className="durov-button">
                <img src={DurovImage} alt="Durov Button"/>
            </button>
        </>
    )
}

export default Durov;