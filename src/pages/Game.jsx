import BirdImage1 from "../assets/1.svg";
import BirdImage2 from "../assets/2.svg";
import BirdImage3 from "../assets/3.svg";
import BirdImage4 from "../assets/4.svg";
import BirdImage5 from "../assets/5.svg";
import BirdImage6 from "../assets/6.svg";
import ForegroundImageClassic from "../assets/img/Classic/road.svg";
import BackgroundImageClassic from "../assets/img/Classic/background.svg";
import PipeImageClassic from "../assets/img/Classic/pillar.svg";
import ForegroundImageMexico from "../assets/img/Mexico/road.svg";
import BackgroundImageMexico from "../assets/img/Mexico/background.svg";
import PipeImageMexico from "../assets/img/Mexico/pillar.svg";
import ForegroundImageWinter from "../assets/img/Winter/road.svg";
import BackgroundImageWinter from "../assets/img/Winter/background.svg";
import PipeImageWinter from "../assets/img/Winter/pillar.svg";
import FlapSound from "../assets/audio/flap.wav";
import DieSound from "../assets/audio/die.wav";
import React, { useEffect, useRef, useState, useCallback } from "react";
import GameOver from "../components/GameOver";

const mapFolder = [
    { fg: ForegroundImageClassic, bg: BackgroundImageClassic, pipe: PipeImageClassic, colour: "#00cbff" },
    { fg: ForegroundImageMexico, bg: BackgroundImageMexico, pipe: PipeImageMexico, colour: "#E56C64" },
    { fg: ForegroundImageWinter, bg: BackgroundImageWinter, pipe: PipeImageWinter, colour: "#22F7FF" }
];

const assetsIndex = Math.round(Math.random() * 2);

const useCollisionDetection = (birdPosition, pipes, gameWidth, gameHeight, foregroundHeight, callback) => {
    useEffect(() => {
        const checkCollision = () => {
            const birdRect = {
                left: birdPosition.left - 25,
                right: birdPosition.left + 25,
                top: birdPosition.top - 25,
                bottom: birdPosition.top + 25
            };

            const gap = gameHeight - 2 * 270;

            for (let pipe of pipes) {
                const upperPipeRect = {
                    left: pipe.left * gameWidth / 100,
                    right: pipe.left * gameWidth / 100 + 120,
                    top: 0,
                    bottom: pipe.top + 260
                };

                const lowerPipeRect = {
                    left: pipe.left * gameWidth / 100,
                    right: pipe.left * gameWidth / 100 + 120,
                    top: pipe.top + 270 + gap,
                    bottom: gameHeight - foregroundHeight
                };

                if (isOverlapping(birdRect, lowerPipeRect) || isOverlapping(birdRect, upperPipeRect) ) {
                    callback();
                    return;
                }
            }

            if (birdPosition.top >= gameHeight - foregroundHeight - 30 && (gameHeight - foregroundHeight > 500)) {
                callback();
                return;
            }
        };

        const isOverlapping = (rect1, rect2) => {
            return (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
            );
        };

        checkCollision();
    }, [birdPosition, pipes, gameWidth, gameHeight, foregroundHeight, callback]);
};

const birdImages = [BirdImage1, BirdImage2, BirdImage3, BirdImage4, BirdImage5, BirdImage6];

const Game = () => {
    const pipeWidth = 120;
    const birdHeight = 50;
    const gravity = 0.4;
    const jumpHeight = -8;
    const gameRef = useRef(null);
    const foregroundRef = useRef(null);
    const animationFrameRef = useRef();
    const [pipes, setPipes] = useState([{ top: Math.floor(Math.random() * 51) - 130, left: 100 }]);
    const [gameWidth, setGameWidth] = useState(0);
    const [gameHeight, setGameHeight] = useState(0);
    const [birdPosition, setBirdPosition] = useState({ top: 450, left: 100 });
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [birdRotation, setBirdRotation] = useState(0);
    const [currentBirdIndex, setCurrentBirdIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [passedPipes, setPassedPipes] = useState(new Set());
    const [foregroundPosition, setForegroundPosition] = useState(0);

    const playDieSound = () => {
        const sound = new Audio(DieSound);
        sound.play();
    };

    const handleCollision = useCallback(() => {
        playDieSound();
        setIsGameOver(true);
    }, []);

    useEffect(() => {
        if (gameRef.current) {
            setGameWidth(gameRef.current.clientWidth);
            setGameHeight(gameRef.current.clientHeight);
        }

        const updateGame = () => {
            const maxTop = gameHeight - (foregroundRef.current ? foregroundRef.current.clientHeight : 0);

            setBirdVelocity(v => {
                if (birdPosition.top >= maxTop && v > 0) {
                    return 0;
                }
                return v + gravity;
            });

            setBirdPosition(position => ({
                ...position,
                top: Math.min(position.top + birdVelocity, maxTop)
            }));

            setBirdRotation((prevRotation) => birdVelocity < 0 ? -25 : Math.min(prevRotation + 6, 90));

            setPipes(prevPipes => {
                return prevPipes.map(pipe => {
                    const newLeft = pipe.left - 0.5;
                    if (newLeft < -pipeWidth / gameWidth * 100) {
                        setPassedPipes(new Set());
                        return { top: Math.floor(Math.random() * 51) - 130, left: 100 };
                    } else {
                        if (!passedPipes.has(pipe) && birdPosition.left > (pipe.left * gameWidth / 100 + pipeWidth)) {
                            setPassedPipes(prevPassedPipes => new Set(prevPassedPipes).add(pipe));
                            setScore(prevScore => prevScore + 1/70);
                        }
                        return { ...pipe, left: newLeft };
                    }
                });
            });

            setForegroundPosition(prevPosition => {
                if (prevPosition <= -gameWidth) {
                    return 0;
                }
                return prevPosition - 2;
            });

            if (!isGameOver) {
                animationFrameRef.current = requestAnimationFrame(updateGame);
            }
        };

        if (!isGameOver) {
            animationFrameRef.current = requestAnimationFrame(updateGame);
        }

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [gameWidth, gameHeight, birdVelocity, birdPosition.top, passedPipes, isGameOver]);

    const handleJump = () => {
        if (isGameOver) return;
        const sound = new Audio(FlapSound);
        sound.play();
        setBirdVelocity(jumpHeight);
        setBirdRotation(-25);
        let frameCount = 0;
        const maxFrames = birdImages.length;
        const interval = setInterval(() => {
            setCurrentBirdIndex(frameCount % maxFrames);
            frameCount++;
            if (frameCount === maxFrames) clearInterval(interval);
        }, 50);
    };

    useCollisionDetection(birdPosition, pipes, gameWidth, gameHeight, foregroundRef.current ? foregroundRef.current.clientHeight : 0, handleCollision);
    return (
        <div className="gameWrapper relative max-w-[550px] w-[100vw] h-[100vh]" onClick={handleJump}>
            {isGameOver && <GameOver />}
            <div ref={gameRef} id='game'
                 className={`relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[550px] max-h-full h-screen bg-[#00cbff] overflow-clip ${isGameOver ? "blur-sm" : ""}`}
                 style={{ backgroundColor: mapFolder[assetsIndex].colour }}>
                <div className="gameFlex flex flex-col justify-end h-screen max-h-[100dvh]">
                    <div
                        className="absolute z-30 left-0 top-0 drop-shadow-[4px_4px_0px_#000000] w-full text-center p-0 m-0 !text-[80px] text-white">{Math.round(score)}</div>
                    <img src={birdImages[currentBirdIndex]}
                         className="absolute z-50 w-[50px] h-[50px] left-1/2 -translate-x-1/2 -translate-y-1/2"
                         style={{
                             top: `${birdPosition.top}px`,
                             left: `${birdPosition.left}px`,
                             transform: `rotate(${birdRotation}deg)`
                         }} alt=""/>
                    {pipes.map((pipe, index) => (
                        <div key={index} className="pipeWrapper absolute w-full h-full z-20 transform -translate-y-1/2"
                             style={{top: `calc(55% + ${pipe.top}px)`, left: `${pipe.left}%`}}>
                            <img src={mapFolder[assetsIndex].pipe} alt=""
                                 className="!h-[300px] absolute transform rotate-180 -scale-x-100 z-20"
                                 style={{width: `${pipeWidth}px`}}/>
                            <img src={mapFolder[assetsIndex].pipe} alt=""
                                 className="!h-[300px] absolute bottom-0 z-10"
                                 style={{width: `${pipeWidth}px`}}/>
                        </div>
                    ))}
                    <img ref={foregroundRef} src={mapFolder[assetsIndex].fg}
                         className="absolute bottom-14 z-20 max-w-[550px]" alt=""
                         style={{left: `${foregroundPosition}px`}}/>
                    <img src={mapFolder[assetsIndex].fg} className="absolute z-20 bottom-14 max-w-[550px]" alt=""
                         style={{left: `${foregroundPosition + gameWidth}px`}}/>
                    <img src={mapFolder[assetsIndex].bg} className="absolute z-0 w-[550px] bottom-32 left-1/2 -translate-x-1/2" alt=""/>
                </div>
            </div>
        </div>
    );
};

export default Game;