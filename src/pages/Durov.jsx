import DurovBackground from "../assets/page.svg";
import React from "react";
import ExitButtonImage from "../assets/exit.svg";
import BigDurovBirdImage from "../assets/bigdurovbirdtext.svg";
import SmallDurovImage from "../assets/smalldurovwithredglow.svg";
import BuyWithTON from "../assets/BuywithTON.svg"
import TextEng from "../assets/texteng.svg"
import PriceImage from "../assets/price.svg"

import {useNavigate} from "react-router-dom";


const Durov = () => {
    const navigate = useNavigate();

    const goToMain = () => {
        navigate('/');
    };

    return (
        <div className="relative max-w-[720px] h-screen w-screen">
            <button onClick={goToMain}>
                <img src={ExitButtonImage} alt="Close" className="absolute mt-[21px] scale-90 ml-[-116px] z-20"/>
            </button>
            <img src={BigDurovBirdImage} alt="" className="absolute z-10 mt-[60px] ml-[-57px]"></img>
            <img src={SmallDurovImage} alt="" className="absolute z-10 mt-[110px] scale-110 ml-[10px]"></img>
            <img src={TextEng} alt="" className="absolute z-10 mt-[40px] ml-[-77px]"></img>
            <img src={BuyWithTON} alt="" className="absolute z-30 mt-[150px] ml-[-3px]"></img>
            <img src={PriceImage} alt="" className="absolute z-10 mt-[10px] ml-[-103px]"></img>
            <div className="left-1/2 transform -translate-x-1/2">
                <img src={DurovBackground} alt=""
                     className="relative mt-[48px] ml-[195px] left-1/2 transform -translate-x-1/2"></img>
            </div>
        </div>
    )
}

export default Durov;