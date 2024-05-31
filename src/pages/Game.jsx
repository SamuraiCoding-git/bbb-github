import BirdImage from "../assets/1.svg";
import React, {useState, useEffect, useRef} from "react";
import ForegroundImage from "../assets/foreground.svg";
import dayImage from "../assets/background.svg";
import topPipeImage from "../assets/pipe-top.png";
import bottomPipeImage from "../assets/pipe-bottom.svg";

const Game = () => {
    const [isGame, setIsGame] = useState(false);
    const [score, setScore] = useState(0);
    const [birdPosition, setBirdPosition] = useState(100);
    const [birdRotation, setBirdRotation] = useState(0); // New state for bird rotation
    const [pipePosition, setPipePosition] = useState(320);
    const [pipeHeight, setPipeHeight] = useState({ top: -300, bottom: 300 });

    const topBoundary = -300;
    const bottomBoundary = 250;
    const pipeWidth = 50;
    const birdRef = useRef(null);
    const upperDivRef = useRef(null);
    const lowerDivRef = useRef(null);

    useEffect(() => {
        let gravityInterval;
        let pipeInterval;
        if (isGame) {
            gravityInterval = setInterval(() => {
                setBirdPosition((prevPosition) => {
                    const newPosition = prevPosition + 5;
                    if (newPosition >= bottomBoundary) {
                        setIsGame(false);
                        setScore(0);
                        return bottomBoundary;
                    }
                    return newPosition;
                });
                setBirdRotation((prevRotation) => Math.min(prevRotation + 5, 90)); // Rotate the bird downwards
            }, 30);

            pipeInterval = setInterval(() => {
                setPipePosition((prevPosition) => {
                    const newPosition = prevPosition - 5;
                    if (newPosition <= -pipeWidth) {
                        setPipePosition(320);
                        setPipeHeight({ top: Math.random() * 200 + 100, bottom: Math.random() * 200 + 200 });
                        setScore((prevScore) => prevScore + 1); // Increase score when bird passes a pipe
                    }
                    return newPosition;
                });
            }, 30);

            return () => {
                clearInterval(gravityInterval);
                clearInterval(pipeInterval);
            };
        }
    }, [isGame, birdPosition, pipePosition]);


    const handleJump = () => {
        if (!isGame) {
            setIsGame(true);
            setBirdPosition(100);
        }
        setBirdPosition((prevPosition) => {
            const newPosition = prevPosition - 50;
            if (newPosition <= topBoundary) {
                setIsGame(false);
                setScore(0);
                return topBoundary;
            }
            return newPosition;
        });
        setBirdRotation(-20);
    };

    return (
        <div className="relative max-w-[720px] ml-[150px]" onClick={handleJump}>
            {isGame && (
                <div className="game-score z-50 relative">
                    <div className="absolute w-full mt-[130px] ml-[-175px]">
                        <span className="absolute mt-[100px] left-1/2 transform -translate-x-1/2 text-white text-5xl font-bold relative">
                            <span className="absolute inset-0 text-black transform translate-x-[2px] translate-y-[2px]">
                                {score}
                            </span>
                            {score}
                        </span>
                    </div>
                </div>
            )}
            <div className="game-get-ready z-40 relative">
                <div id="game-bird-animation">
                    <img
                        src={BirdImage}
                        alt=""
                        id="game-bird-image"
                        className="z-40 absolute top-1/2 transform -translate-y-1/2 mt-[280px] ml-[20px] scale-50"
                        style={{ top: birdPosition, transform: `rotate(${birdRotation}deg)` }} // Apply rotation
                    ></img>
                </div>
            </div>
            <div className="game-pipe z-20 relative">
                <div
                    style={{
                        position: 'absolute',
                        left: pipePosition,
                        height: pipeHeight.top,
                        top: `-35px`,
                        width: '50px',
                        backgroundColor: 'transparent',
                        backgroundImage: `url(${topPipeImage})`,
                        backgroundSize: 'cover'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        left: pipePosition,
                        height: pipeHeight.bottom,
                        top: `${700 - pipeHeight.bottom}px`,
                        width: '50px',
                        backgroundColor: 'transparent',
                        backgroundImage: `url(${bottomPipeImage})`,
                        backgroundSize: 'cover'
                    }}
                />
            </div>
            <div className="game-foreground z-30 relative">
                <img src={ForegroundImage} alt="" className="mt-[595px] ml-[-170px] absolute z-20"></img>
            </div>
            <div className="game-background z-10 relative">
                <img src={dayImage} alt="" className="ml-[-250px] mt-[-5px]"></img>
            </div>
        </div>
    );
};

export default Game;
