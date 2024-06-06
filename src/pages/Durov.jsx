import React from "react";
import { useNavigate } from "react-router-dom";

import DurovBackground from "../assets/page.svg";
import ExitButtonImage from "../assets/img/Durov/exit.png";
import BigDurovBirdImage from "../assets/bigdurovbirdtext.svg";
import SmallDurovImage from "../assets/smalldurovwithredglow.svg";
import BuyWithTON from "../assets/BuywithTON.svg";
import TextEng from "../assets/texteng.svg";
import PriceImage from "../assets/price.svg";

const Durov = () => {
    const navigate = useNavigate();

    const goToMain = () => {
        navigate('/');
    };

    return (
        <div
            className="relative max-w-[510px] h-screen w-screen mx-auto bg-no-repeat bg-center"
            style={{
                backgroundImage: `url(${DurovBackground})`,
                backgroundSize: '505px 505px', // Set specific dimensions
            }}
        >
            <img
                src={ExitButtonImage}
                alt="Exit"
                onClick={goToMain}
                className="absolute z-30 top-[145px] right-[12px] cursor-pointer w-[50px] h-[50px]"
            />
            <img
            src={BigDurovBirdImage}
            alt="BigDurovBird"
            className="relative top-[120px] right-[55px]"
            />
            <img
            src={SmallDurovImage}
            className="relative w-[625px] h-[625px] bottom-[400px] right-[120px]"
            />
            <img
            src={BuyWithTON}
            className="absolute top-[260px]"
            />
            <img
                src={TextEng}
                alt="TextEng"
                className="absolute top-[145px] left-[-80px]"
            />
            <img
            src={PriceImage}
            alt="Price"
            className="absolute top-[100px] left-[-100px]"
            />
        </div>
    );
};

export default Durov;
