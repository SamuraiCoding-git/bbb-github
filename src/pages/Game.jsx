import React, { useEffect, useRef, useState } from "react";
import BirdImage1 from "../assets/1.svg";
import BirdImage2 from "../assets/2.svg";
import BirdImage3 from "../assets/3.svg";
import BirdImage4 from "../assets/4.svg";
import BirdImage5 from "../assets/5.svg";
import BirdImage6 from "../assets/6.svg";
import ForegroundImageClassic from "../assets/img/Classic/road.svg";
import BackgroundImageClassic from "../assets/img/Classic/background.png";
import PipeImageClassic from "../assets/img/Classic/pillar.png";
import Clouds from "../assets/img/Classic/clouds.png";
import TopClouds from "../assets/img/Classic/topClouds.png";
import FlapSound1 from "../assets/flap1.wav";
import FlapSound2 from "../assets/flap2.wav";
import FlapSound3 from "../assets/flap3.wav";
import DieSound from "../assets/audio/die.wav";
import MyFont from "../assets/17634.ttf";
import Paper from "../assets/back-paper-S.png";
import DeathImage from "../assets/death.png";
import InviteFriendsButtonImg from "../assets/img/Invite/invite_friends_button.svg";
import BackSound from "../assets/audio/back.wav";
import SelectSound from "../assets/audio/select.wav";

const mapFolder = [
    { fg: ForegroundImageClassic, bg: BackgroundImageClassic, pipe: PipeImageClassic, clouds: Clouds, topClouds: TopClouds, colour: "#00cbff" }
];

const assetsIndex = 0;

const birdImages = [BirdImage1, BirdImage2, BirdImage3, BirdImage4, BirdImage5, BirdImage6];

const motivationalPhrases = [
    "Keep going!",
    "You can do it!",
    "Don't give up!",
    "Try again!",
    "Stay focused!",
    "Nice $Balls"
];

const assetLoadingNames = [
    "CALLING DUROV",
    "BREAKING INTO TELEGRAM'S OFFICE",
    "MEASURES $BALLS",
    "NICE $BALLS BRO",
    "CYBERPUNK BIRDS?",
    "WHO IS MR. PIROJHOK?",
    "AND THE WORD WAS $BALLS",
    "BUILDING CITIES AND NESTS",
    "CREATING SKY",
    "LOADING TERRAIN",
    "CHILLING... OH NO JUST KIDDING",
    "ALMOST DONE!"
];

const soundSources = [FlapSound1, FlapSound2, FlapSound3, DieSound, BackSound, SelectSound];

const loadImage = (src, alt) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.alt = alt;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (e) => {
            reject(e);
        };
    });
};

let assets = {
    birdImgs: [],
    foreground: null,
    background: null,
    clouds: null,
    topClouds: null,
    pipe: null,
    birdSoulImg: null
};

const pipeWidth = 100;
const pipeHeight = 300 * 1.8;
const BIRD_SIZE = 100;
const initialBirdSize = BIRD_SIZE * 2;
const gravity = 0.4;
const jumpHeight = -8;
const gapHeight = 200;
const initialBirdPosition = { x: 275, y: 400 };
const initialPipeSpeed = 4;
const initialGroundSpeed = 2;
const initialCloudsSpeed = initialGroundSpeed / 2;
const parallaxMax = 30;
const maxScoreForMaxSpeed = 1000;
const maxSpeedMultiplier = 1.4;

let birdAnimationInterval = null;
let currentBirdAnimationIndex = 0;
let birdSize = initialBirdSize;
let birdPosition = {...initialBirdPosition};
let birdVelocity = 0;
let birdRotation = 0;
let rotationInterval;
let birdSoulPosition = null;
let birdSoulOpacity = 1;

let pipes = [];

let groundPosition = 0;
let cloudsPosition = 0;

let score = 0;
let scoreOpacityRef = 0;

let lastTime = Date.now();

let textY = 200;
let showText = true;

let hasDiedOnce = false;

let flapSounds = [];
let dieSound;
let backSound;
let selectSound;

let animationFrame = null;

let isInitialMount = true;

let isAnimatingToStart = false;

const Game = () => {
    const canvasRef = useRef(null);
    const menuRef = useRef(null);

    const [gameState, setGameState] = useState("start");
    const [showMenu, setShowMenu] = useState(false);
    const [motivation, setMotivation] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingAsset, setLoadingAsset] = useState("");

    const loadAssets = async () => {
        const assetsToLoad = [
            { src: BirdImage1, name: "Bird Image 1" },
            { src: BirdImage2, name: "Bird Image 2" },
            { src: BirdImage3, name: "Bird Image 3" },
            { src: BirdImage4, name: "Bird Image 4" },
            { src: BirdImage5, name: "Bird Image 5" },
            { src: BirdImage6, name: "Bird Image 6" },
            { src: mapFolder[assetsIndex].fg, name: "Foreground Image" },
            { src: mapFolder[assetsIndex].bg, name: "Background Image" },
            { src: mapFolder[assetsIndex].clouds, name: "Clouds Image" },
            { src: mapFolder[assetsIndex].topClouds, name: "Top Clouds Image" },
            { src: mapFolder[assetsIndex].pipe, name: "Pipe Image" },
            { src: DeathImage, name: "Death Icon" }
        ];

        try {
            let loadedAssets = {};
            for (let i = 0; i < assetsToLoad.length; i++) {
                setLoadingAsset(assetLoadingNames[i]);
                const img = await loadImage(assetsToLoad[i].src, assetsToLoad[i].name);
                loadedAssets[assetsToLoad[i].name.replace(/ /g, '').toLowerCase()] = img;
                setLoadingProgress(((i + 1) / assetsToLoad.length) * 100);
            }

            flapSounds = soundSources.slice(0, 3).map(src => {
                const sound = new Audio(src);
                sound.preload = 'auto';
                return sound;
            });
            dieSound = new Audio(soundSources[3]);
            dieSound.preload = 'auto';

            backSound = new Audio(soundSources[4]);
            backSound.preload = 'auto';

            selectSound = new Audio(soundSources[5]);
            selectSound.preload = 'auto';

            assets = {
                birdImgs: [
                    loadedAssets.birdimage1,
                    loadedAssets.birdimage2,
                    loadedAssets.birdimage3,
                    loadedAssets.birdimage4,
                    loadedAssets.birdimage5,
                    loadedAssets.birdimage6
                ],
                foreground: loadedAssets.foregroundimage,
                background: loadedAssets.backgroundimage,
                clouds: loadedAssets.cloudsimage,
                topClouds: loadedAssets.topcloudsimage,
                pipe: loadedAssets.pipeimage,
                birdSoulImg: loadedAssets.deathicon
            };
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    };

    const initializeGame = () => {
        textY = 200;
        showText = true;
        scoreOpacityRef = 0;
        pipes = [];
        birdPosition = {...initialBirdPosition};
        birdVelocity = 0;
        birdRotation = 0;
        birdSize = initialBirdSize;
        currentBirdAnimationIndex = 0;
        score = 0;
        groundPosition = 0;
        cloudsPosition = 0;
        lastTime = Date.now();
        birdSoulPosition = null;
        birdSoulOpacity = 1;
    };

    const restartGame = () => {
        selectSound.play();
        hasDiedOnce = true;
        initializeGame();
        setGameState("start");
        setShowMenu(false);
        setMotivation("");
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };

    const checkCollision = () => {
        const birdRadius = BIRD_SIZE / 2;
        const birdX = birdPosition.x + birdRadius;
        const birdY = birdPosition.y + birdRadius;

        if (birdY + birdRadius > canvasRef.current.height - 100) {
            return true;
        }

        for (let pipe of pipes) {
            const pipeCenterX = pipe.x + pipeWidth / 2;
            const pipeY = pipe.y;
            const adjustedPipeWidth = pipeWidth * 0.30;
            const adjustedPipeHeight = pipeHeight * 0.90;

            if (birdX + birdRadius > pipeCenterX - adjustedPipeWidth / 2 && birdX - birdRadius < pipeCenterX + adjustedPipeWidth / 2) {
                if (birdY + birdRadius > pipeY + adjustedPipeHeight * 0.07) {
                    return true;
                }
            }

            if (birdX + birdRadius > pipeCenterX - adjustedPipeWidth / 2 && birdX - birdRadius < pipeCenterX + adjustedPipeWidth / 2) {
                if (birdY - birdRadius < pipeY - gapHeight - adjustedPipeHeight * 0.07) {
                    return true;
                }
            }
        }

        return false;
    };

    const handleGameOver = () => {
        dieSound.play();
        birdSoulPosition = {...birdPosition};
        setTimeout(() => {
            setMotivation(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
            setShowMenu(true);
        }, 1000);
    };

    const handleJump = () => {
        if (isAnimatingToStart) return;
        if (gameState === "gameOver") return;
        if (gameState === "start") {
            const targetX = 150;
            const startX = birdPosition.x;
            const animationSteps = 60;
            const stepX = (targetX - startX) / animationSteps;
            const stepSize = (BIRD_SIZE - birdSize) / animationSteps;
            const textStepY = (canvasRef.current.height + 200) / animationSteps;
            let step = 0;

            const animateBird = () => {
                if (step < animationSteps) {
                    birdPosition.x += stepX;
                    birdSize += stepSize;
                    textY -= textStepY;
                    step++;
                    requestAnimationFrame(animateBird);
                } else {
                    birdPosition = { x: 150, y: 400 };
                    birdSize = BIRD_SIZE;
                    showText = false;
                    setGameState("playing");
                    isAnimatingToStart = false;
                }
            };
            isAnimatingToStart = true;
            animateBird();
        } else if (gameState === "playing") {
            if (birdAnimationInterval) {
                clearInterval(birdAnimationInterval);
            }
            birdAnimationInterval = setInterval(() => {
                currentBirdAnimationIndex = (currentBirdAnimationIndex + 1) % birdImages.length;
                if (currentBirdAnimationIndex === birdImages.length - 1) {
                    clearInterval(birdAnimationInterval);
                }
            }, 50);
            const randomFlapSound = flapSounds[Math.floor(Math.random() * flapSounds.length)];
            randomFlapSound.play();
            birdVelocity = jumpHeight;
            birdRotation = -15;
        }
    };

    useEffect(() => {
        if (isInitialMount) {
            loadAssets();
            isInitialMount = false;
        }
        return () => {
            isInitialMount = true;
            hasDiedOnce = false;
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            initializeGame();
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            lastTime = Date.now();
        }
    }, [isLoading]);

    useEffect(() => {
        if (gameState === "gameOver") {
            handleGameOver();
        }

        if (gameState === "playing") {
            rotationInterval = setInterval(() => {
                if (birdRotation < 45) {
                    birdRotation += 1;
                }
            }, 20);
            
            return () => clearInterval(rotationInterval);
        }

    }, [gameState]);

    useEffect(() => {
        if (!isLoading && (gameState === "start" || gameState === "playing")) {
            birdAnimationInterval = setInterval(() => {
                currentBirdAnimationIndex = (currentBirdAnimationIndex + 1) % birdImages.length;
            }, gameState === "start" ? 100 : 50);
        } else {
            clearInterval(birdAnimationInterval);
        }

        return () => clearInterval(birdAnimationInterval);
    }, [gameState, isLoading]);

    useEffect(() => {
        setTimeout(() => {
            if (showMenu && menuRef.current) {
                menuRef.current.style.top = '50%';
            }
        }, 10);
    }, [showMenu]);

    useEffect(() => {
        const loadFont = async () => {
            const font = new FontFace("MyFont", `url(${MyFont})`);
            await font.load();
            document.fonts.add(font);
        };

        loadFont();

        const gameLoop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');

            const { birdImgs, foreground, background, clouds, topClouds, pipe, birdSoulImg } = assets;

            if (!birdImgs.length || !foreground || !background || !clouds || !topClouds || !pipe || !birdSoulImg) {
                console.error("Some assets are not loaded properly.");
                return;
            }

            const now = Date.now();
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;

            updateGameLogic(deltaTime);
            drawGame(context, birdImgs, foreground, background, clouds, topClouds, pipe, birdSoulImg);
            if (gameState !== "gameOver" || birdPosition.y < canvas.height) {
                animationFrame = requestAnimationFrame(gameLoop);
            }
        };

        const updateGameLogic = (deltaTime) => {
            const speedMultiplier = 1 + (maxSpeedMultiplier - 1) * Math.min(score / maxScoreForMaxSpeed, 1);

            const pipeSpeed = initialPipeSpeed * speedMultiplier;
            const groundSpeed = initialGroundSpeed * speedMultiplier;
            const cloudsSpeed = initialCloudsSpeed * speedMultiplier;

            if (gameState === "start" || gameState === "gameOver") {
                groundPosition = (groundPosition - groundSpeed * deltaTime * 60) % canvasRef.current.width;
                cloudsPosition = (cloudsPosition - cloudsSpeed * deltaTime * 60) % canvasRef.current.width;
            }

            if (gameState === "gameOver") {
                birdVelocity += gravity * deltaTime * 60;
                birdPosition.y += birdVelocity * deltaTime * 60;
                birdPosition.x -= 2 * deltaTime * 60;
                if (birdPosition.y >= canvasRef.current.height - BIRD_SIZE / 2) {
                    cancelAnimationFrame(animationFrame);
                }
                if (birdSoulPosition) {
                    birdSoulPosition.y -= 2 * deltaTime * 60;
                    birdSoulOpacity -= deltaTime * 2;
                }
                return;
            }

            if (gameState !== "playing") return;

            birdVelocity += gravity * deltaTime * 60;
            birdPosition.y += birdVelocity * deltaTime * 60;

            if (checkCollision()) {
                if (score < 5) {
                    restartGame();
                } else {
                    setGameState("gameOver");
                }
                return;
            }

            if (pipes.length === 0 || pipes[pipes.length - 1].x < canvasRef.current.width - 400) {
                const newPipeY = canvasRef.current.height - pipeHeight + -100 + Math.floor(Math.random() * 401);
                pipes.push({ x: canvasRef.current.width, y: newPipeY });
            }

            pipes = pipes.map(pipe => {
                pipe.x -= pipeSpeed * deltaTime * 60;
                if (!pipe.passed && pipe.x + pipeWidth < birdPosition.x + BIRD_SIZE) {
                    pipe.passed = true;
                    score += 1;
                }
                return pipe;
            });

            if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
                pipes.shift();
            }

            groundPosition = (groundPosition - groundSpeed * deltaTime * 60) % canvasRef.current.width;
            cloudsPosition = (cloudsPosition - cloudsSpeed * deltaTime * 60) % canvasRef.current.width;

            if (gameState === "playing" && scoreOpacityRef < 1) {
                scoreOpacityRef = Math.min(scoreOpacityRef + deltaTime, 1);
            }
        };

        const drawGame = (context, birdImgs, foreground, background, clouds, topClouds, pipe, birdSoulImg) => {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const parallaxOffset = canvasRef.current.height - 220 + parallaxMax * (birdPosition.y / canvasRef.current.height - 0.5);
            const backgroundWidth = canvasRef.current.width * 1.05;
            const backgroundHeight = backgroundWidth / 4;
            context.drawImage(background, 0, parallaxOffset, backgroundWidth, backgroundHeight);

            context.drawImage(clouds, cloudsPosition, 40, canvasRef.current.width + 5, 200);
            context.drawImage(clouds, cloudsPosition + canvasRef.current.width, 40, canvasRef.current.width + 5, 200);

            pipes.forEach((pipeData) => {
                context.save();
                context.translate(pipeData.x + pipeWidth / 2, pipeData.y - gapHeight - pipeHeight);
                context.rotate(Math.PI);
                context.drawImage(pipe, -pipeWidth / 2 + 15, -pipeHeight, pipeWidth, pipeHeight);
                context.restore();
                context.drawImage(pipe, pipeData.x, pipeData.y, pipeWidth, pipeHeight);
            });

            context.drawImage(foreground, groundPosition, canvasRef.current.height - 100, canvasRef.current.width + 5, 100);
            context.drawImage(foreground, groundPosition + canvasRef.current.width, canvasRef.current.height - 100, canvasRef.current.width, 100);

            if (gameState === "start") {
                const animationYOffset = 15 * Math.sin((Date.now() / 200) % (2 * Math.PI));
                context.save();
                context.translate(birdPosition.x, birdPosition.y + animationYOffset);
                context.rotate(0);
                context.drawImage(birdImgs[currentBirdAnimationIndex], -birdSize / 2, -birdSize / 2, birdSize, birdSize);
                context.restore();

                if (showText) {
                    context.font = "80px MyFont";
                    context.fillStyle = "#FFF";
                    context.strokeStyle = "#000";
                    context.lineWidth = 6;
                    const startText = hasDiedOnce ? "Try again!" : "TAP to start!";
                    const startTextWidth = context.measureText(startText).width;
                    const startTextX = canvasRef.current.width / 2 - startTextWidth / 2;
                    const startTextY = textY + 450;
                    context.strokeText(startText, startTextX, startTextY);
                    context.fillText(startText, startTextX, startTextY);
                }
            } else {
                context.save();
                context.translate(birdPosition.x + BIRD_SIZE / 2, birdPosition.y + BIRD_SIZE / 2);
                context.rotate((Math.PI / 180) * birdRotation);
                context.drawImage(birdImgs[currentBirdAnimationIndex], -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
                context.restore();
            }

            if (birdSoulPosition && birdSoulOpacity > 0) {
                context.save();
                context.globalAlpha = birdSoulOpacity;
                context.drawImage(birdSoulImg, birdSoulPosition.x, birdSoulPosition.y, 50, 50);
                context.restore();
            }

            context.drawImage(topClouds, groundPosition, -50, canvasRef.current.width + 5, 150);
            context.drawImage(topClouds, groundPosition + canvasRef.current.width, -50, canvasRef.current.width + 5, 150);

            context.font = "60px MyFont";
            context.fillStyle = `rgba(255, 255, 255, ${scoreOpacityRef})`;
            context.strokeStyle = `rgba(0, 0, 0, ${scoreOpacityRef})`;
            context.lineWidth = 6;
            context.strokeText(`Score: ${score}`, canvasRef.current.width / 2 - context.measureText(`Score: ${score}`).width / 2, 60);
            context.fillText(`Score: ${score}`, canvasRef.current.width / 2 - context.measureText(`Score: ${score}`).width / 2, 60);

            context.drawImage(foreground, groundPosition, canvasRef.current.height - 100, canvasRef.current.width + 5, 100);
            context.drawImage(foreground, groundPosition + canvasRef.current.width, canvasRef.current.height - 100, canvasRef.current.width, 100);
        };

        const startGame = () => {
            if (!isLoading) {
                animationFrame = requestAnimationFrame(gameLoop);
            }
        };

        startGame();

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            clearInterval(birdAnimationInterval);
        };
    }, [gameState, isLoading]);

    if (isLoading) {
        return (
            <div className="loadingScreen" style={{ color: "#fff", fontSize: '40px', display: 'flex', width: '100dvw', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#7CCEFE', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'MyFont', marginBottom: '20px' }}>{loadingAsset}</div>
                <div style={{ width: '550px', backgroundColor: '#ddd', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{width: `${loadingProgress}%`, height: '20px', background: '#FAE645'}}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="gameWrapper w-[100dvw] h-[100dvh] max-h-screen flex justify-center items-end bg-[#7CCEFE]" onMouseDown={handleJump}>
    {showMenu && (
        <div className="backgroundgBlur w-[100dvw] h-[100dvh] backdrop-blur-sm absolute">
            <div ref={menuRef} className="gameOver duration-1000 absolute top-[150%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[500px] w-[80dvw] h-auto pb-[3vmin] px-[2vmin] pt-[10vmin] text-black flex flex-col items-center justify-center transition-all ease-in-out">
                <img src={DeathImage} alt="Death Icon" className="absolute z-10 top-[-22%] left-1/2 transform -translate-x-1/2 h-[40%] w-auto" />
                <img src={Paper} alt="Paper Background" className="absolute top-0 left-1/2 transform -translate-x-1/2 max-w-[400px] w-full max-h-full h-auto" />
                <div className="relative z-10 text-[50px] mb-[30px] text-center">{motivation}</div>
                <div className="relative z-10 text-[30px] mb-[30px]">Score: {score}</div>
                <div className="relative flex justify-between z-10 gap-10">
                    <button onClick={restartGame} className="relative w-32 h-16">
                        <img
                            src={InviteFriendsButtonImg}
                            alt="Invite Friends"
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ transform: 'scaleX(1.25) scaleY(1.85)' }}
                        />
                        <div className="absolute text-black font-bold text-[50px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ fontSize: '24px' }}>
                            Restart
                        </div>
                    </button>
                    <button onClick={() => { backSound.play(); window.history.back(); }} className="relative w-32 h-16">
                        <img
                            src={InviteFriendsButtonImg}
                            alt="Invite Friends"
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ transform: 'scaleX(1.25) scaleY(1.85)' }}
                        />
                        <div className="absolute text-black font-bold text-[50px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ fontSize: '24px' }}>
                            Back
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )}
    <canvas className="max-w-[100dvw] h-[100dvh]" ref={canvasRef} width="550" height="1000" />
</div>

    );
};

export default Game;
