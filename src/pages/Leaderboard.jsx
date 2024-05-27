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
            return `${(num / 1000000000).toFixed(1)}`;
        }
        else if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        } else {
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
        <>
            <div className="close-button" id="achievements">
                <CloseButton/>
            </div>
            <div className="leaderboard-container">
                <div className="leaderboard-list">
                    <img src={LeaderboardImage} id="leaderboard-image" alt="Leaderboard"/>
                    <ul className="member-list">
                        {topFiveMembers.map((member, index) => (
                            <li key={index} className="leaderboard-member">
                                <div className="image-container">
                                    <img src={LeaderboardMemberImage} alt="Member icon"/>
                                </div>
                                <div className="member-name">
                                    {formatName(member.name)}
                                </div>
                                <div className="member-score">
                                    {formatScore(member.score)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="leaderboard-eggs">
                    <div className="first-egg">
                    <span className="name">
                        {formatText(formatText(topThreeMembers[0].name))}
                    </span>
                        <span className="score">
                        {formatText(formatScore(topThreeMembers[0].score))}
                    </span>
                    </div>
                    <div className="second-egg">
                    <span className="name">
                        {formatText(formatText(topThreeMembers[1].name))}
                    </span>
                        <span className="score">
                        {formatText(formatScore(topThreeMembers[1].score))}
                    </span>
                    </div>
                    <div className="three-egg">
                    <span className="name">
                        {formatText(formatText(topThreeMembers[2].name))}
                    </span>
                        <span className="score">
                        {formatText(formatScore(topThreeMembers[2].score))}
                    </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Leaderboard;