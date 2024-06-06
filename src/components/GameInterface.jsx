import React, { useRef } from 'react';
import BirdImage from "../assets/1.svg";
import HeaderImage from "../assets/header.svg";
import PlayImage from "../assets/play-button.svg";
import NoAchievementImage from "../assets/no-achievement-button.svg";
import LeaderboardImage from "../assets/leaderboard-button.svg";
import InviteImage from "../assets/invite-button.svg";
import WalletImage from "../assets/wallet-button.svg";
import SelectSound from "../assets/audio/select.wav";
import { useNavigate } from "react-router-dom";
import Durov from "./Durov";

const GameInterface = () => {
    const navigate = useNavigate();

    const playSelectSound = () => {
        const sound = new Audio(SelectSound); // Создаем новый аудио-элемент при каждом нажатии
        sound.play();
    };

    const goToGame = () => {
        playSelectSound();
        navigate('/game');
    };

    const goToLeaderboard = () => {
        playSelectSound();
        navigate('/leaderboard');
    };

    const goToAchievement = () => {
        playSelectSound();
        navigate('/achievements');
    };

    const goToInvite = () => {
        playSelectSound();
        navigate('/invite');
    };

    const goToWallet = () => {
        playSelectSound();
        navigate('/wallet');
    };

    return (
        <div className="ml-[70px]">
            <div className="game-interface">
                <Durov />
                <div className="header-container">
                    <img src={HeaderImage} id="header-image" alt="Header" />
                </div>
                <div className="bird-container pt-[30px]">
                    <div id="bird-animation">
                        <img src={BirdImage} id="bird-image" alt="GetReady"/>
                    </div>
                </div>
                <div className="game-menu-container mt-[60px]">
                    <div className="first-layer">
                        <button className="menu-button" onClick={goToGame}>
                            <img src={PlayImage} alt="Play" />
                        </button>
                        <button className="menu-button" onClick={goToAchievement}>
                            <img src={NoAchievementImage} alt="NoAchievement" />
                        </button>
                    </div>
                    <div className="second-layer">
                        <button className="menu-button" onClick={goToLeaderboard}>
                            <img src={LeaderboardImage} alt="Leaderboard" />
                        </button>
                        <button className="menu-button" onClick={goToInvite}>
                            <img src={InviteImage} alt="Invite" />
                        </button>
                        <button className="menu-button" onClick={goToWallet}>
                            <img src={WalletImage} alt="Wallet" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameInterface;
