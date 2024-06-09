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
// import { api } from "../api/interface";


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

// const getUserId = () => {
//     if (window.Telegram && window.Telegram.WebApp) {
//         const tg = window.Telegram.WebApp;
//         return tg.initDataUnsafe?.user?.id;
//     }
//     return null;
// };

const Game = () => {
    const pipeWidth = 100;
    const pipeHeight = 300 * 1.8;
    const birdSize = 100;
    const initialBirdSize = birdSize * 2;
    const gravity = 0.4;
    const jumpHeight = -8;
    const gapHeight = 200;
    const initialPipeSpeed = 4;
    const initialGroundSpeed = 2;
    const initialCloudsSpeed = initialGroundSpeed / 2;
    const parallaxMax = 30;
    const maxScoreForMaxSpeed = 1000;
    const maxSpeedMultiplier = 1.4;

    const canvasRef = useRef(null);
    const birdPosition = useRef({ x: 275, y: 400 });
    const birdVelocity = useRef(0);
    const currentBirdIndex = useRef(0);
    const pipes = useRef([]);
    const groundPosition = useRef(0);
    const cloudsPosition = useRef(0);
    const score = useRef(0);
    const birdSizeRef = useRef(initialBirdSize);
    const initialBirdPosition = useRef({ x: 275, y: 400 });
    const textRef = useRef(200);
    const animationFrameRef = useRef(null);
    const lastTimeRef = useRef(Date.now());
    const isInitialMount = useRef(true);
    const menuRef = useRef(null);

    const [gameState, setGameState] = useState("start");
    const [isAnimating, setIsAnimating] = useState(true);
    const [textY, setTextY] = useState(200);
    const [showText, setShowText] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [motivation, setMotivation] = useState("");
    const [hasDiedOnce, setHasDiedOnce] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paperImage, setPaperImage] = useState(null);
    const [inviteFriendsButton, setInviteFriendsButton] = useState(null);
    const birdAnimationRef = useRef(null);
    const deathIconRef = useRef(null);
    const deathIconOpacityRef = useRef(1);
    const scoreOpacityRef = useRef(0);

    const dieSound = useRef(null);
    const flapSounds = useRef([]);
    const backSound = useRef(null);
    const selectSound = useRef(null);

    const assetsRef = useRef({
        birdImgs: [],
        foreground: null,
        background: null,
        clouds: null,
        topClouds: null,
        pipe: null,
        deathIcon: null
    });

    const loadAssets = async () => {
        try {
            const birdImgs = await Promise.all(birdImages.map((img, index) => loadImage(img, `Bird Image ${index + 1}`)));
            const foreground = await loadImage(mapFolder[assetsIndex].fg, "Foreground Image");
            const background = await loadImage(mapFolder[assetsIndex].bg, "Background Image");
            const clouds = await loadImage(mapFolder[assetsIndex].clouds, "Clouds Image");
            const topClouds = await loadImage(mapFolder[assetsIndex].topClouds, "Top Clouds Image");
            const pipe = await loadImage(mapFolder[assetsIndex].pipe, "Pipe Image");
            const paper = await loadImage(Paper, "Paper Background");
            const deathIcon = await loadImage(DeathImage, "Death Icon");
            const inviteButton = await loadImage(InviteFriendsButtonImg, "Invite Friends Button");

            flapSounds.current = soundSources.slice(0, 3).map(src => {
                const sound = new Audio(src);
                sound.preload = 'auto';
                return sound;
            });
            dieSound.current = new Audio(soundSources[3]);
            dieSound.current.preload = 'auto';

            backSound.current = new Audio(soundSources[4]);
            backSound.current.preload = 'auto';

            selectSound.current = new Audio(soundSources[5]);
            selectSound.current.preload = 'auto';

            assetsRef.current = { birdImgs, foreground, background, clouds, topClouds, pipe, deathIcon };
            setPaperImage(paper);
            setInviteFriendsButton(inviteButton);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    };

    useEffect(() => {
        if (isInitialMount.current) {
            loadAssets();
            isInitialMount.current = false;
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            initializeGame();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            lastTimeRef.current = Date.now();
        }
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading && (gameState === "start" || gameState === "playing")) {
            birdAnimationRef.current = setInterval(() => {
                currentBirdIndex.current = (currentBirdIndex.current + 1) % birdImages.length;
            }, gameState === "start" ? 100 : 50);
        } else {
            clearInterval(birdAnimationRef.current);
        }

        return () => clearInterval(birdAnimationRef.current);
    }, [gameState, isLoading]);

    const initializeGame = () => {
        scoreOpacityRef.current = 0;
        pipes.current = [];
        birdPosition.current = { x: 275, y: 400 };
        birdVelocity.current = 0;
        currentBirdIndex.current = 0;
        score.current = 0;
        groundPosition.current = 0;
        cloudsPosition.current = 0;
        birdSizeRef.current = initialBirdSize;
        initialBirdPosition.current = { x: 275, y: 400 };
        lastTimeRef.current = Date.now();
        deathIconRef.current = null;
        deathIconOpacityRef.current = 1;
    };

    const restartGame = () => {
        selectSound.current.play();
        setHasDiedOnce(true);
        initializeGame();
        setGameState("start");
        setIsAnimating(true);
        setTextY(200);
        textRef.current = 200;
        setShowText(true);
        setShowMenu(false);
        setMotivation("");
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const checkCollision = () => {
        const birdRadius = birdSize / 2;
        const birdX = birdPosition.current.x + birdRadius;
        const birdY = birdPosition.current.y + birdRadius;

        if (birdY + birdRadius > canvasRef.current.height - 100) {
            return true;
        }

        for (let pipe of pipes.current) {
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
        if (score.current < 5) {
            restartGame();
        } else {
            // api.betaGame.updateRecord(getUserId(), score.current)
            dieSound.current.play();
            deathIconRef.current = { x: birdPosition.current.x, y: birdPosition.current.y };
            setTimeout(() => {
                setMotivation(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
                setShowMenu(true);
            }, 1000);
        }
    };

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

            const { birdImgs, foreground, background, clouds, topClouds, pipe, deathIcon } = assetsRef.current;

            const now = Date.now();
            const deltaTime = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            updateGameLogic(deltaTime);
            drawGame(context, birdImgs, foreground, background, clouds, topClouds, pipe, deathIcon);
            if (gameState !== "gameOver" || birdPosition.current.y < canvas.height) {
                animationFrameRef.current = requestAnimationFrame(gameLoop);
            }
        };

        const updateGameLogic = (deltaTime) => {
            const speedMultiplier = 1 + (maxSpeedMultiplier - 1) * Math.min(score.current / maxScoreForMaxSpeed, 1);

            const pipeSpeed = initialPipeSpeed * speedMultiplier;
            const groundSpeed = initialGroundSpeed * speedMultiplier;
            const cloudsSpeed = initialCloudsSpeed * speedMultiplier;

            if (gameState === "start" || gameState === "gameOver") {
                groundPosition.current = (groundPosition.current - groundSpeed * deltaTime * 60) % canvasRef.current.width;
                cloudsPosition.current = (cloudsPosition.current - cloudsSpeed * deltaTime * 60) % canvasRef.current.width;
            }

            if (gameState === "gameOver") {
                birdVelocity.current += gravity * deltaTime * 60;
                birdPosition.current.y += birdVelocity.current * deltaTime * 60;
                birdPosition.current.x -= 2 * deltaTime * 60;
                if (birdPosition.current.y >= canvasRef.current.height - birdSize / 2) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (deathIconRef.current) {
                    deathIconRef.current.y -= 2 * deltaTime * 60;
                    deathIconOpacityRef.current -= deltaTime * 2;
                }
                return;
            }

            if (gameState !== "playing") return;

            birdVelocity.current += gravity * deltaTime * 60;
            birdPosition.current.y += birdVelocity.current * deltaTime * 60;

            if (checkCollision()) {
                if (score.current < 5) {
                    restartGame();
                } else {
                    setGameState("gameOver");
                }
                return;
            }

            if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < canvasRef.current.width - 400) {
                const newPipeY = canvasRef.current.height - pipeHeight + -100 + Math.floor(Math.random() * 401);
                pipes.current.push({ x: canvasRef.current.width, y: newPipeY });
            }

            pipes.current = pipes.current.map(pipe => {
                pipe.x -= pipeSpeed * deltaTime * 60;
                if (!pipe.passed && pipe.x + pipeWidth < birdPosition.current.x + birdSize) {
                    pipe.passed = true;
                    score.current += 1;
                }
                return pipe;
            });

            if (pipes.current.length > 0 && pipes.current[0].x < -pipeWidth) {
                pipes.current.shift();
            }

            groundPosition.current = (groundPosition.current - groundSpeed * deltaTime * 60) % canvasRef.current.width;
            cloudsPosition.current = (cloudsPosition.current - cloudsSpeed * deltaTime * 60) % canvasRef.current.width;

            if (gameState === "playing" && scoreOpacityRef.current < 1) {
                scoreOpacityRef.current = Math.min(scoreOpacityRef.current + deltaTime, 1);
            }
        };

        const drawGame = (context, birdImgs, foreground, background, clouds, topClouds, pipe, deathIcon) => {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const parallaxOffset = parallaxMax * (birdPosition.current.y / canvasRef.current.height - 0.5);
            const backgroundWidth = canvasRef.current.width * 1.05;
            const backgroundHeight = (canvasRef.current.height - 100) * 1.05;
            context.drawImage(background, 0, parallaxOffset, backgroundWidth, backgroundHeight);

            context.drawImage(clouds, cloudsPosition.current, 40, canvasRef.current.width + 5, 200);
            context.drawImage(clouds, cloudsPosition.current + canvasRef.current.width, 40, canvasRef.current.width + 5, 200);

            pipes.current.forEach((pipeData) => {
                context.save();
                context.translate(pipeData.x + pipeWidth / 2, pipeData.y - gapHeight - pipeHeight);
                context.rotate(Math.PI);
                context.drawImage(pipe, -pipeWidth / 2 + 15, -pipeHeight, pipeWidth, pipeHeight);
                context.restore();
                context.drawImage(pipe, pipeData.x, pipeData.y, pipeWidth, pipeHeight);
            });

            context.drawImage(foreground, groundPosition.current, canvasRef.current.height - 100, canvasRef.current.width + 5, 100);
            context.drawImage(foreground, groundPosition.current + canvasRef.current.width, canvasRef.current.height - 100, canvasRef.current.width, 100);

            if (isAnimating) {
                const animationYOffset = 15 * Math.sin((Date.now() / 200) % (2 * Math.PI));
                context.save();
                context.translate(initialBirdPosition.current.x, initialBirdPosition.current.y + animationYOffset);
                context.rotate(0);
                context.drawImage(birdImgs[currentBirdIndex.current], -birdSizeRef.current / 2, -birdSizeRef.current / 2, birdSizeRef.current, birdSizeRef.current);
                context.restore();

                if (showText) {
                    context.font = "80px MyFont";
                    context.fillStyle = "#FFF";
                    context.strokeStyle = "#000";
                    context.lineWidth = 6;
                    const startText = hasDiedOnce ? "Try again!" : "TAP to start!";
                    const startTextWidth = context.measureText(startText).width;
                    const startTextX = canvasRef.current.width / 2 - startTextWidth / 2;
                    const startTextY = textRef.current + 450;
                    context.strokeText(startText, startTextX, startTextY);
                    context.fillText(startText, startTextX, startTextY);
                }
            } else {
                context.save();
                context.translate(birdPosition.current.x + birdSize / 2, birdPosition.current.y + birdSize / 2);
                context.rotate((Math.PI / 180) * birdRotation.current);
                context.drawImage(birdImgs[currentBirdIndex.current], -birdSize / 2, -birdSize / 2, birdSize, birdSize);
                context.restore();
            }

            if (deathIconRef.current && deathIconOpacityRef.current > 0) {
                context.save();
                context.globalAlpha = deathIconOpacityRef.current;
                context.drawImage(deathIcon, deathIconRef.current.x, deathIconRef.current.y, 50, 50);
                context.restore();
            }

            context.drawImage(topClouds, groundPosition.current, -50, canvasRef.current.width + 5, 150);
            context.drawImage(topClouds, groundPosition.current + canvasRef.current.width, -50, canvasRef.current.width + 5, 150);

            context.font = "60px MyFont";
            context.fillStyle = `rgba(255, 255, 255, ${scoreOpacityRef.current})`;
            context.strokeStyle = `rgba(0, 0, 0, ${scoreOpacityRef.current})`;
            context.lineWidth = 6;
            context.strokeText(`Score: ${score.current}`, canvasRef.current.width / 2 - context.measureText(`Score: ${score.current}`).width / 2, 60);
            context.fillText(`Score: ${score.current}`, canvasRef.current.width / 2 - context.measureText(`Score: ${score.current}`).width / 2, 60);

            context.drawImage(foreground, groundPosition.current, canvasRef.current.height - 100, canvasRef.current.width + 5, 100);
            context.drawImage(foreground, groundPosition.current + canvasRef.current.width, canvasRef.current.height - 100, canvasRef.current.width, 100);
        };

        const startGame = () => {

            if (!isLoading) {
                animationFrameRef.current = requestAnimationFrame(gameLoop);
            }
        };

        startGame();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            clearInterval(birdAnimationRef.current);
        };
    }, [gameState, isAnimating, showText, hasDiedOnce, isLoading]);

    const birdRotation = useRef(0);

    const handleJump = () => {
        if (gameState === "gameOver") return;
        if (gameState === "start") {
            const targetX = 150;
            const startX = initialBirdPosition.current.x;
            const animationSteps = 60;
            const stepX = (targetX - startX) / animationSteps;
            const stepSize = (birdSize - birdSizeRef.current) / animationSteps;
            const textStepY = (canvasRef.current.height + 200) / animationSteps;
            let step = 0;

            const animateBird = () => {
                if (step < animationSteps) {
                    initialBirdPosition.current.x += stepX;
                    birdSizeRef.current += stepSize;
                    textRef.current -= textStepY;
                    setTextY(textRef.current);
                    step++;
                    requestAnimationFrame(animateBird);
                } else {
                    birdPosition.current = { x: 150, y: 400 };
                    birdSizeRef.current = birdSize;
                    setIsAnimating(false);
                    setShowText(false);
                    setGameState("playing");
                }
            };
            animateBird();
        } else if (gameState === "playing") {
            if (birdAnimationRef.current) {
                clearInterval(birdAnimationRef.current);
            }
            birdAnimationRef.current = setInterval(() => {
                currentBirdIndex.current = (currentBirdIndex.current + 1) % birdImages.length;
                if (currentBirdIndex.current === birdImages.length - 1) {
                    clearInterval(birdAnimationRef.current);
                }
            }, 50);
            const randomFlapSound = flapSounds.current[Math.floor(Math.random() * flapSounds.current.length)];
            randomFlapSound.play();
            birdVelocity.current = jumpHeight;
            birdRotation.current = -15;
        }
    };

    useEffect(() => {
        const rotationInterval = setInterval(() => {
            if (gameState === "playing" && birdRotation.current < 45) {
                birdRotation.current += 1;
            }
        }, 20);

        return () => clearInterval(rotationInterval);
    }, [gameState]);

    useEffect(() => {
        if (gameState === "gameOver") {
            handleGameOver();
        }
    }, [gameState]);

    if (isLoading) {
        return <div className="loadingScreen" style={{ color: "#fff", fontSize: '40px', display: 'flex', width: '100dvw', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#00cbff' }}>Loading...</div>;
    }

    return (
        <div className="gameWrapper w-[100dvw] h-[100dvh] max-h-screen flex justify-center items-end bg-[#00cbff]" onClick={handleJump}>
    {showMenu && (
        <div className="backgroundgBlur w-[100dvw] h-[100dvh] backdrop-blur-sm absolute">
            <div ref={menuRef} className="gameOver duration-1000 absolute top-[150%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[500px] w-[80dvw] h-auto p-[5vmin] pt-[10vmin] text-black flex flex-col items-center justify-center transition-all ease-in-out">
                <img src={DeathImage} alt="Death Icon" className="absolute z-10 top-[-22%] left-1/2 transform -translate-x-1/2 h-[40%] w-auto" />
                <img src={Paper} alt="Paper Background" className="absolute top-0 left-0 max-w-[500px] w-full max-h-full h-auto" />
                <div className="relative z-10 text-[50px] mb-[30px] text-center">{motivation}</div>
                <div className="relative z-10 text-[30px] mb-[30px]">Score: {score.current}</div>
                <div className="relative flex justify-between z-10">
                    <button onClick={restartGame} className="relative">
                            <img
                                src={inviteFriendsButton ? inviteFriendsButton.src : ''}
                                alt="Invite Friends"
                                className="w-full h-full"
                            />
                        <div className="absolute w-full h-full text-black font-bold text-[40px] top-1/2 transform -translate-y-1/2" style={{ fontSize: '24px' }}>
                            Restart
                        </div>
                    </button>
                    <button onClick={() => { backSound.current.play(); window.history.back(); }} className="relative">
                            <img
                                src={inviteFriendsButton ? inviteFriendsButton.src : ''}
                                alt="Invite Friends"
                                className="w-full h-full"
                            />
                        <div className="absolute w-full h-full text-black font-bold text-[40px] top-1/2 transform -translate-y-1/2" style={{ fontSize: '24px' }}>
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
