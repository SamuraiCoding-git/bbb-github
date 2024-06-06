import React, { useEffect, useRef, useState } from "react";
import On from "../assets/on.png";
import Off from "../assets/off.png";
import backgroundMusic from "../assets/audio/MenuMusic.wav";

const GameAudioComponent = () => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        const initAudioContext = async () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            const response = await fetch(backgroundMusic);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBufferRef.current = audioBuffer;
        };

        initAudioContext();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playAudio = () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;

        const audioContext = audioContextRef.current;
        const source = audioContext.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.loop = true;
        source.connect(audioContext.destination);
        source.start(0);
        sourceRef.current = source;
    };

    const stopAudio = () => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current = null;
        }
    };

    const toggleMusic = () => {
        if (isMusicPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
        setIsMusicPlaying(!isMusicPlaying);
    };

    return (
        <div className=" background-music">
            <button className="z-100 button-mute ml-[110px]" onClick={toggleMusic}>
                <img src={isMusicPlaying ? On : Off} alt="Toggle Audio" />
            </button>
        </div>
    );
}

export default GameAudioComponent;
