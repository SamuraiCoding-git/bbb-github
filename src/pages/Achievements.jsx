import React, { useContext, useEffect, useState } from "react";
import BackPaperImage from "../assets/back-paper-L.svg";
import { HeaderContext } from "../components/Header";

const Achievements = () => {
    const { setIsShowCloseBtn } = useContext(HeaderContext)
    const [achivments, setAchivments] = useState([1,2,3,4,5,6])

    useEffect(() => {
        setIsShowCloseBtn(true)

        return () => { setIsShowCloseBtn(false) }
    }, [])

    return (
        <div className="relative h-screen w-screen">
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-36">
                <img src={BackPaperImage} className="absolute w-[310px] left-1/2 transform -translate-x-1/2"/>
                <span className="relative text-3xl top-10 left-1/2 transform -translate-x-1/2">
                    ???
                </span>
                <ul className="relative mt-12 w-[310px] text-2xl">
                    {achivments.map((member, index) => (
                        <li className="relative h-fit ">
                            <div className="relative flex flex-row justify-between items-center py-2 px-6">
                                <div className="w-12 h-8 border-black border-[3px] border-solid rounded-md">
                                    
                                </div>
                                <div className="pr-2">
                                    ..............................................................?
                                </div>
                            </div>
                            {
                                index !== achivments.length-1 && <hr width="84%" color="#313229" className="h-[3px] border-t-0 rounded-xl mx-6" />
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Achievements;
