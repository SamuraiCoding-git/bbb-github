import React, { useEffect, useState } from "react";
import BackPaperImage from "../assets/back-paper-L.svg";
import { api } from "../api/interface";
import BetaImg from "../assets/achievement_beta.png"

const Achievements = () => {
    const [achievements, setAchievements] = useState([
        {id: 0, img: "public/achievement_beta.png", name: "welcome to beta", done: true},
        {id: 1, img: "public/", name: "wait the game", done: false},
        {id: 2, img: "public/", name: "wait the game", done: false},
        {id: 3, img: "public/", name: "wait the game", done: false},
        {id: 4, img: "public/", name: "wait the game", done: false},
        {id: 5, img: "public/", name: "wait the game", done: false},
        {id: 6, img: "public/", name: "wait the game", done: false}])

    useEffect(() => {
        // api.achievements.getAll()
        //     .then((res) => {
        //         setAchivments(res)
        //     })
    }, [])

    return (
        <div className="relative h-screen w-screen">
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-36">
                <img src={BackPaperImage} className="absolute w-[310px] left-1/2 transform -translate-x-1/2"/>
                <span className="absolute text-3xl top-10 left-1/2 transform -translate-x-1/2">
                    { achievements.filter((a) => a.done).length
                        ? "Achievements"
                        : "???"
                    }
                </span>
                <ul className="relative mt-20 w-[310px]">
                    {achievements.map((achievement, index) => (
                        <li key={index} className="relative h-fit ">
                            <div className="relative flex flex-row items-center py-2 px-6">
                                <div className="w-12 h-8 border-black border-[3px] border-solid rounded-md">
                                    { achievement.done 
                                        ? <img src={BetaImg} className="w-full h-full"/>
                                        : ""
                                    }
                                </div>
                                <div className="pr-2 pl-4 font-bold text-xl">
                                    { achievement.done 
                                        ? <span style={{fontFamily: "Comic Sans MS"}}>{ achievement.name }</span>
                                        : <span className="text-2xl">............................................................?</span>
                                    }
                                    
                                </div>
                            </div>
                            {
                                index !== achievements.length-1 && <hr width="84%" color="#313229" className="h-[3px] border-t-0 rounded-xl mx-6" />
                            }
                        </li>

                        )
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Achievements;
