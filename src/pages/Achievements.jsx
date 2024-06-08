import AchievementsImage from "../assets/achievement-window.svg";
import ConcealedAchievementsImage from "../assets/achievement-with-picture-space.svg";
import React, { useContext, useEffect } from "react";
import { HeaderContext } from "../components/Header";

const Achievements = () => {
    const { setIsShowCloseBtn } = useContext(HeaderContext)

    useEffect(() => {
        setIsShowCloseBtn(true)

        return () => { setIsShowCloseBtn(false) }
    }, [])

    return (
        <div className="max-w-[720px] mt-[15px] ml-[195px]">
            <div className="achievements-header">
                <span>
                    ???
                </span>
            </div>
            <div className="achievements-container">
                <div className="achievements-window">
                    <img src={AchievementsImage} alt=""/>
                </div>
                <div className="achievements-list">
                    <img src={ConcealedAchievementsImage} className="concealed-image" alt=""></img>
                    <img src={ConcealedAchievementsImage} className="concealed-image" alt=""></img>
                    <img src={ConcealedAchievementsImage} className="concealed-image" alt=""></img>
                    <img src={ConcealedAchievementsImage} className="concealed-image" alt=""></img>
                    <img src={ConcealedAchievementsImage} className="concealed-image" alt=""></img>
                    <img src={ConcealedAchievementsImage} className="concealed-image" alt=""></img>
                </div>
            </div>
        </div>
    )
}

export default Achievements;
