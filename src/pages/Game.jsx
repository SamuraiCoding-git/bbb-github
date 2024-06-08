import React, { useEffect, useRef, useState, useContext } from "react";
import BirdImage1 from "../assets/1.svg";
import BirdImage2 from "../assets/2.svg";
import BirdImage3 from "../assets/3.svg";
import BirdImage4 from "../assets/4.svg";
import BirdImage5 from "../assets/5.svg";
import BirdImage6 from "../assets/6.svg";
import ForegroundImageClassic from "../assets/img/Classic/road.svg";
import BackgroundImageClassic from "../assets/img/Classic/background.png";
import PipeImageClassic from "../assets/img/Classic/pillar.svg";
import Clouds from "../assets/img/Classic/clouds.png";
import TopClouds from "../assets/img/Classic/topClouds.png";
import FlapSound1 from "../assets/flap1.wav";
import FlapSound2 from "../assets/flap2.wav";
import FlapSound3 from "../assets/flap3.wav";
import DieSound from "../assets/audio/die.wav";
import MyFont from "../assets/17634.ttf";
import { HeaderContext } from "../components/Header";

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
    "Stay focused!"
];

const sounds = [FlapSound1, FlapSound2, FlapSound3, DieSound];

const loadSound = (src) => {
    return new Promise((resolve, reject) => {
        const sound = new Audio(src);
        sound.oncanplaythrough = () => {
            console.log(`Sound loaded: ${src}`);
            resolve(sound);
        };
        sound.onerror = (e) => {
            console.error(`Failed to load sound: ${src}`, e);
            reject(e);
        };
        sound.load();
    });
};

const Game = () => {
    const { setIsShowCloseBtn } = useContext(HeaderContext);
    const pipeWidth = 100;
    const pipeHeight = 300;
    const birdSize = 100;
    const initialBirdSize = birdSize * 2;
    const gravity = 0.4;
    const jumpHeight = -8;
    const gapHeight = 220;
    const pipeSpeed = 4;
    const groundSpeed = 2;
    const cloudsSpeed = groundSpeed / 2;
    const parallaxMax = 30;

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

    const [gameState, setGameState] = useState("start");
    const [isAnimating, setIsAnimating] = useState(true);
    const [textY, setTextY] = useState(200);
    const [showText, setShowText] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [motivation, setMotivation] = useState("");
    const [hasDiedOnce, setHasDiedOnce] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const birdAnimationRef = useRef(null);

    const dieSound = useRef(null);

    const assetsRef = useRef({
        birdImgs: [],
        foreground: null,
        background: null,
        clouds: null,
        topClouds: null,
        pipe: null,
        flapSounds: [],
    });

    const loadImage = (src, alt) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.alt = alt;
            img.onload = () => {
                console.log(`Image loaded: ${src}`);
                resolve(img);
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${src}`, e);
                reject(e);
            };
        });
    };

    const loadAssets = async () => {
        try {
            const birdImgs = await Promise.all(birdImages.map((img, index) => loadImage(img, `Bird Image ${index + 1}`)));
            const foreground = await loadImage(mapFolder[assetsIndex].fg, "Foreground Image");
            const background = await loadImage(mapFolder[assetsIndex].bg, "Background Image");
            const clouds = await loadImage(mapFolder[assetsIndex].clouds, "Clouds Image");
            const topClouds = await loadImage(mapFolder[assetsIndex].topClouds, "Top Clouds Image");
            const pipe = await loadImage(mapFolder[assetsIndex].pipe, "Pipe Image");

            console.log('Starting to load sounds...');
            const flapSounds = await Promise.all(sounds.slice(0, 3).map((src) => loadSound(src)));
            console.log('Flap sounds loaded:', flapSounds);
            dieSound.current = await loadSound(sounds[3]);
            console.log('Die sound loaded:', dieSound.current);

            assetsRef.current = { birdImgs, foreground, background, clouds, topClouds, pipe, flapSounds };
            console.log('All assets loaded');
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    };

    const initializeGame = () => {
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
    };

    const restartGame = () => {
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
                if (birdY + birdRadius > pipeY + adjustedPipeHeight * 0.10) {
                    return true;
                }
            }

            if (birdX + birdRadius > pipeCenterX - adjustedPipeWidth / 2 && birdX - birdRadius < pipeCenterX + adjustedPipeWidth / 2) {
                if (birdY - birdRadius < pipeY - gapHeight - adjustedPipeHeight * 0.10) {
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
            dieSound.current.play();
            setTimeout(() => {
                setMotivation(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
                setShowMenu(true);
            }, 1000);
        }
    };

    useEffect(() => {
        loadAssets();
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
        if (gameState === "start") {
            birdAnimationRef.current = setInterval(() => {
                currentBirdIndex.current = (currentBirdIndex.current + 1) % birdImages.length;
            }, 100);
        } else if (gameState === "playing") {
            birdAnimationRef.current = setInterval(() => {
                currentBirdIndex.current = (currentBirdIndex.current + 1) % birdImages.length;
            }, 50);
        } else if (gameState === "gameOver") {
            handleGameOver();
        } else {
            clearInterval(birdAnimationRef.current);
        }

        return () => clearInterval(birdAnimationRef.current);
    }, [gameState]);

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

            const { birdImgs, foreground, background, clouds, topClouds, pipe } = assetsRef.current;

            const now = Date.now();
            const deltaTime = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            updateGameLogic(deltaTime);
            drawGame(context, birdImgs, foreground, background, clouds, topClouds, pipe);
            if (gameState !== "gameOver" || birdPosition.current.y < canvas.height) {
                animationFrameRef.current = requestAnimationFrame(gameLoop);
            }
        };

        const updateGameLogic = (deltaTime) => {
            if (gameState === "start" || gameState === "gameOver") {
                groundPosition.current = (groundPosition.current - groundSpeed * deltaTime * 60) % canvasRef.current.width;
                cloudsPosition.current = (cloudsPosition.current - cloudsSpeed * deltaTime * 60) % canvasRef.current.width;
            }

            if (gameState === "gameOver") {
                birdVelocity.current += gravity * deltaTime * 60;
                birdPosition.current.y += birdVelocity.current * deltaTime * 60;
                if (birdPosition.current.y >= canvasRef.current.height - birdSize / 2) {
                    cancelAnimationFrame(animationFrameRef.current);
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
                const newPipeY = canvasRef.current.height - pipeHeight - Math.floor(Math.random() * 101);
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
        };

        const drawGame = (context, birdImgs, foreground, background, clouds, topClouds, pipe) => {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const parallaxOffset = parallaxMax * (birdPosition.current.y / canvasRef.current.height - 0.5);
            const backgroundWidth = canvasRef.current.width * 1.05;
            const backgroundHeight = (canvasRef.current.height - 100) * 1.05;
            context.drawImage(background, 0, parallaxOffset, backgroundWidth, backgroundHeight);

            // Draw clouds
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
                context.drawImage(birdImgs[currentBirdIndex.current], initialBirdPosition.current.x - birdSizeRef.current / 2, initialBirdPosition.current.y + animationYOffset - birdSizeRef.current / 2, birdSizeRef.current, birdSizeRef.current);

                if (showText) {
                    context.font = "80px MyFont";
                    context.fillStyle = "#FFF";
                    context.strokeStyle = "#000";
                    context.lineWidth = 6; 
                    const startText = hasDiedOnce ? "Try again!" : "TAP to start!";
                    const startTextWidth = context.measureText(startText).width;
                    const startTextX = canvasRef.current.width / 2 - startTextWidth / 2;
                    const startTextY = textRef.current + 400;
                    context.strokeText(startText, startTextX, startTextY); 
                    context.fillText(startText, startTextX, startTextY);
                }
            } else {
                context.drawImage(birdImgs[currentBirdIndex.current], birdPosition.current.x, birdPosition.current.y, birdSize, birdSize);
            }

            // Draw top clouds
            context.drawImage(topClouds, groundPosition.current, -50, canvasRef.current.width + 5, 150);
            context.drawImage(topClouds, groundPosition.current + canvasRef.current.width, -50, canvasRef.current.width + 5, 150);

            context.font = "60px MyFont";
            context.fillStyle = "#FFF";
            context.strokeStyle = "#000";
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
            const randomFlapSound = assetsRef.current.flapSounds[Math.floor(Math.random() * assetsRef.current.flapSounds.length)];
            randomFlapSound.play();
            birdVelocity.current = jumpHeight;
        }
    };

    useEffect(() => {
        setIsShowCloseBtn(true);
        return () => { setIsShowCloseBtn(false); };
    }, [setIsShowCloseBtn]);

    if (isLoading) {
        return <div className="loadingScreen" style={{ display: 'flex', width: '100dvw', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#00cbff' }}>Loading...</div>;
    }

    return (
        <div className="gameWrapper w-[100dvw] h-[100dvh] max-h-screen flex justify-center items-end" style={{background: '#00cbff'}} onClick={handleJump}>
            {showMenu && (
                <div className="gameOver" style={{position: 'absolute', top: 0, left: 0, right: 0, height: '100dvh', background: 'rgba(0, 0, 0, 0.7)', color: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{fontSize: '40px', marginBottom: '20px'}}>{motivation}</div>
                    <div style={{fontSize: '30px', marginBottom: '20px'}}>Score: {score.current}</div>
                    <div>
                        <button onClick={restartGame} style={{fontSize: '20px', marginRight: '10px'}}>Restart</button>
                        <button onClick={() => window.history.back()} style={{fontSize: '20px'}}>Back</button>
                    </div>
                </div>
            )}
            <canvas className="max-w-[100dvw] max-h-[100dvh]" ref={canvasRef} width="550" height="880" />
        </div>
    );
};

export default Game;
