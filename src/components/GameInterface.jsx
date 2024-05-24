import React from 'react';
import BirdImage from "../assets/bird.png";
import HeaderImage from "../assets/header.svg";
import PlayImage from "../assets/play-button.svg";
import NoAchievementImage from "../assets/no-achievement-button.svg";
import LeaderboardImage from "../assets/leaderboard-button.svg";
import InviteImage from "../assets/invite-button.svg";
import WalletImage from "../assets/wallet-button.svg";
import {useNavigate} from "react-router-dom";


const GameInterface = () => {
    const navigate = useNavigate();

    const goToLeaderboard = () => {
        navigate('/leaderboard');
    };

    return (
        <>
            <div className="game-interface">
                <div className="header-container">
                    <img src={HeaderImage} id="header-image" alt="Header"/>
                </div>
                <div className="bird-container">
                    <img src={BirdImage} id="bird-image" alt="Bird"/>
                </div>
                <div className="game-menu-container">
                    <div className="first-layer">
                        <button className="menu-button">
                            <img src={PlayImage} alt="Play"/>
                        </button>
                        <button className="menu-button">
                            <img src={NoAchievementImage} alt="NoAchievemnt"/>
                        </button>
                    </div>
                    <div className="second-layer">
                        <button className="menu-button" onClick={goToLeaderboard}>
                            <img src={LeaderboardImage} alt="Leaderboard"/>
                        </button>
                        <button className="menu-button">
                            <img src={InviteImage} alt="Invite"/>
                        </button>
                        <button className="menu-button">
                            <img src={WalletImage} alt="Wallet"/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameInterface;
