import React, {useRef, useState} from "react";
import On from "../assets/on.png";
import Off from "../assets/off.png";
import backgroundMusic from "../assets/inGame.mp3";

const GameAudioComponent = () => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef(new Audio(backgroundMusic));

    const toggleMusic = () => {
        if (isMusicPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsMusicPlaying(!isMusicPlaying);
    };

    return (
        <div className="background-music">
            <button className="button-mute ml-[110px]" onClick={toggleMusic}>
                <img src={isMusicPlaying ? On : Off} alt="Toggle Audio" />
            </button>
            <audio id="background-audio" loop>
                <source src="../assets/inGame.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default GameAudioComponent;
