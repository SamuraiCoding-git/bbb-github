import React, { useEffect, useRef, useContext } from "react";
import On from "../assets/on.png";
import Off from "../assets/off.png";
import backgroundMusic from "../assets/audio/MenuMusic.wav";
import { useMusic } from "./MusicContext";

const BackgroundMusic = () => {
    const { isMusicPlaying, toggleMusic } = useMusic();
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const sourceRef = useRef(null);
    const gainNodeRef = useRef(null);

    useEffect(() => {
        const initAudioContext = async () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.75; // Уменьшение громкости на 25%
            gainNode.connect(audioContext.destination);
            gainNodeRef.current = gainNode;

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

    useEffect(() => {
        if (isMusicPlaying) {
            playAudio();
        } else {
            stopAudio();
        }
    }, [isMusicPlaying]);

    const playAudio = () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;

        const audioContext = audioContextRef.current;
        const source = audioContext.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.loop = true;
        source.connect(gainNodeRef.current);
        source.start(0);
        sourceRef.current = source;
    };

    const stopAudio = () => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current = null;
        }
    };

    return (
        <div className="background-music">
            <button className="button-mute ml-[110px]" onClick={toggleMusic}>
                <img src={isMusicPlaying ? On : Off} alt="Toggle Audio" />
            </button>
        </div>
    );
};

export default BackgroundMusic;
