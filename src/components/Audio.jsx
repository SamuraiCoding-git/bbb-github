import React, { useState } from "react";
import On from "../assets/on.png";
import Off from "../assets/off.png";

const GameAudioComponent = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audio = new Audio();
    audio.src = "../assets/inGame.mp3";

    const toggleAudio = () => {
        setIsPlaying(!isPlaying);
        if(!isPlaying) {
            audio.currentTime = 0;
            audio.play();
        } else {
            audio.pause()
        }
    };

    return (
        <div className="background-music">
            <button className="button-mute" onClick={toggleAudio}>
                <img src={isPlaying ? On : Off} alt="Toggle Audio" />
            </button>
            <audio id="background-audio" loop>
                <source src="../assets/inGame.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default GameAudioComponent;
