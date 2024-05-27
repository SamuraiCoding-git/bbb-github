import LeaderboardImage from "../assets/leaderboard.svg";
import LeaderboardMemberImage from "../assets/leaderboard-switch-button.png";
import React, { useState } from "react";
import CloseButton from "../components/CloseButton";

const Leaderboard = () => {
    const [members] = useState([
        { name: "Andrew", score: 50000 },
        { name: "Matvey", score: 450000000000 },
        { name: "Charlie", score: 4000},
        { name: "David", score: 35000 },
        { name: "Eve", score: 30000 },
        { name: "Frank", score: 250 },
        { name: "Grace", score: 2000 }
    ]);

const formatScore = (num) => {
        if (num > 1000000000) {
            return `${(num / 1000000000).toFixed(1)}B`;
        }
        else if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        else {
            return num.toString();
        }
    }

    const formatText = (text) => {
        if (text.length > 6) {
            return text.slice(0, 5) + "...";
        } else {
            return text;
        }
    }

    const formatName = (text) => {
        if (text.length > 10) {
            return text.slice(0, 9) + "...";
        } else {
            return text;
        }
    }

    const topFiveMembers = members.sort((a, b) => b.score - a.score).slice(0, 5);
    const topThreeMembers = members.sort((a, b) => b.score - a.score).slice(0, 3);
    return (
        <div className="max-w-[320px] h-screen relative w-screen">
            <div className="absolute right-0 top-0 z-10" id="leaderboard">
                <CloseButton/>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 ">
                
                <img src={LeaderboardImage} className="relative mt-[96px] w-[310px] left-1/2 transform -translate-x-1/2" alt="Leaderboard"/>
                
                <ul className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-[calc(50%-100px)] w-full max-w-[310px]">
                    {topFiveMembers.map((member, index) => (
                        <li key={index} className="relative flex flex-col justify-center items-center py-2">
                            <div className="image-container">
                                <img src={LeaderboardMemberImage} alt="Member icon"/>
                            </div>
                            <div className="mt-3 data absolute top-0 w-full flex flex-row justify-between">
                                <div className="ml-12 text-2xl">
                                    {formatName(member.name)}
                                </div>
                                <div className="mr-12 text-2xl">
                                    {formatScore(member.score)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="absolute top-8 left-1/2 trasform -translate-x-1/2 w-full flex justify-between px-5">
                    <div className="flex flex-col mt-6 w-full truncate overflow-clip text-center">
                        <span className="name text-2xl font-bold">
                            {formatText(formatText(topThreeMembers[1].name))}
                        </span>
                            <span className="!text-black font-bold">
                            {formatText(formatScore(topThreeMembers[1].score))}
                        </span>
                    </div>
                    <div className="flex flex-col w-full truncate overflow-clip text-center">
                        <span className="name text-2xl font-bold">
                            {formatText(formatText(topThreeMembers[0].name))}
                        </span>
                            <span className="!text-black font-bold">
                            {formatText(formatScore(topThreeMembers[0].score))}
                        </span>
                    </div>
                    <div className="flex flex-col mt-12 w-full truncate overflow-clip text-center">
                        <span className="name text-2xl font-bold">
                            {formatText(formatText(topThreeMembers[2].name))}
                        </span>
                            <span className="!text-black font-bold">
                            {formatText(formatScore(topThreeMembers[2].score))}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Leaderboard;