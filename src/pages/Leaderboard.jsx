import BackPaperImage from "../assets/back-paper-L.svg";
import LeaderboardEggsImage from "../assets/leaderboard-eggs.svg";
import React, { useEffect, useState, useContext } from "react";
import { formatName, formatScore, formatPosition } from "../utils/Formaters"
import { api } from "../api/interface"
import { id as userId } from "../utils/TelegramUserData"
import { HeaderContext } from "../components/Header";

const Leaderboard = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [user, setUser] = useState()

    const { setIsShowCloseBtn } = useContext(HeaderContext)

    useEffect(() => {
        api.users.getTopFive()
            .then((topUsers) => {
                setTopUsers(topUsers)
            })
            .catch(() => {
                setTopUsers([
                    { username: "???", record: 50000 },
                    { username: "???", record: 450000000000 },
                    { username: "???", record: 4000},
                    { username: "???", record: 35000 },
                    { username: "???", record: 30000 },
                ])
            })

        api.user.getUser(userId)
            .then((user) => {
                setUser(user)
            })
            .catch(() => {
                setUser({ username: "You", record: 0, position: 0})
            })

        setIsShowCloseBtn(true)

        return () => { setIsShowCloseBtn(false) }
    }, [])

    const topFivetopUsers = topUsers.sort((a, b) => b.score - a.score).slice(0, 5);
    // const topThreetopUsers = topUsers.sort((a, b) => b.score - a.score).slice(0, 3);
    return (
        <div className="relative h-screen w-screen">
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <img src={LeaderboardEggsImage} className="relative mt-16 w-[310px]"/>
                <img src={BackPaperImage} className="relative w-[310px]"/>

                <ul className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-[calc(50%-90px)] w-full max-w-[310px]">
                    {topFivetopUsers.map((member, index) => (
                        <li key={index} className="relative flex flex-col justify-center items-center h-fit pt-4 px-8">
                            <div className="data top-0 w-full flex flex-row pb-[12px]">
                                <div className="ml-2 mr-4 text-2xl">
                                    {index + 1}
                                </div>
                                <div className="flex flex-row justify-between w-full">
                                    <div className="pl-4 text-2xl border-black border-solid border-l-[3px]">
                                        {formatName(member.username)}
                                    </div>
                                    <div className="text-2xl">
                                        {formatScore(member.record)}
                                    </div>
                                </div>
                            </div>
                            {
                                index !== 4 && <hr width="100%" color="#313229" className="h-[3px] border-t-0 rounded-xl" />
                            }
                        </li>
                    ))}
                    <hr width="96%" color="#313229" className="h-[3px] border-t-0 m-auto" />

                    { user &&
                        <li className="relative flex flex-col justify-center items-center h-fit pt-8 px-8">
                            <div className="data top-0 w-full flex flex-row">
                                <div className="ml-2 mr-4 text-2xl">
                                    {formatPosition(String(user.position))}
                                </div>
                                <div className="flex flex-row justify-between w-full">
                                    <div className="pl-4 text-2xl border-black border-solid" style={{borderLeftWidth: '3px'}}>
                                        {formatName(user.username)}
                                    </div>
                                    <div className="text-2xl">
                                        {formatScore(user.record)}
                                    </div>
                                </div>
                            </div>
                        </li>
                        }
                </ul>

                {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full flex justify-between px-5">
                    <div className="flex flex-col mt-6 w-full truncate overflow-clip text-center">
                        <span className="name text-2xl font-bold">
                            {formatText(formatText(topThreetopUsers[1].name))}
                        </span>
                        <span className="!text-black font-bold">
                            {formatText(formatScore(topThreetopUsers[1].score))}
                        </span>
                    </div>
                    <div className="flex flex-col w-full truncate overflow-clip text-center">
                        <span className="name text-2xl font-bold">
                            {formatText(formatText(topThreetopUsers[0].name))}
                        </span>
                        <span className="!text-black font-bold">
                            {formatText(formatScore(topThreetopUsers[0].score))}
                        </span>
                    </div>
                    <div className="flex flex-col mt-12 w-full truncate overflow-clip text-center">
                        <span className="name text-2xl font-bold">
                            {formatText(formatText(topThreetopUsers[2].name))}
                        </span>
                        <span className="!text-black font-bold">
                            {formatText(formatScore(topThreetopUsers[2].score))}
                        </span>
                    </div>
                </div> */}

            </div>
        </div>
    );
};

export default Leaderboard;
