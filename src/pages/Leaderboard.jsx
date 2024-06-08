import React, { useEffect, useRef, useState } from "react";
import BirdImage1 from "../assets/1.svg";
import BirdImage2 from "../assets/2.svg";
import BirdImage3 from "../assets/3.svg";
import BirdImage4 from "../assets/4.svg";
import BirdImage5 from "../assets/5.svg";
import BirdImage6 from "../assets/6.svg";
import ForegroundImageClassic from "../assets/img/Classic/road.svg";
import BackgroundImageClassic from "../assets/img/Classic/background.svg";
import PipeImageClassic from "../assets/img/Classic/pillar.svg";
import FlapSound1 from "../assets/flap1.wav";
import FlapSound2 from "../assets/flap2.wav";
import FlapSound3 from "../assets/flap3.wav";
import DieSound from "../assets/audio/die.wav";
import MyFont from "../assets/17634.ttf";

const mapFolder = [
    { fg: ForegroundImageClassic, bg: BackgroundImageClassic, pipe: PipeImageClassic, colour: "#00cbff" }
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

const flapSounds = [new Audio(FlapSound1), new Audio(FlapSound2), new Audio(FlapSound3)];

const Game = () => {
    const pipeWidth = 100;
    const pipeHeight = 300;
    const birdSize = 100;
    const initialBirdSize = birdSize * 2;
    const gravity = 0.4;
    const jumpHeight = -8;
    const gapHeight = 220;
    const pipeSpeed = 4;
    const groundSpeed = 2;
    const parallaxMax = 30;

    const canvasRef = useRef(null);
    const birdPosition = useRef({ x: 275, y: 400 });
    const birdVelocity = useRef(0);
    const currentBirdIndex = useRef(0);
    const pipes = useRef([]);
    const groundPosition = useRef(0);
    const invertedGroundPosition = useRef(0);
    const score = useRef(0);
    const birdSizeRef = useRef(initialBirdSize);
    const initialBirdPosition = useRef({ x: 275, y: 400 });
    const textRef = useRef(200);
    const animationFrameRef = useRef(null);

    const [gameState, setGameState] = useState("start");
    const [isAnimating, setIsAnimating] = useState(true);
    const [textY, setTextY] = useState(200);
    const [showText, setShowText] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [motivation, setMotivation] = useState("");
    const birdAnimationRef = useRef(null);

    const dieSound = useRef(new Audio(DieSound)).current;

    const restartGame = () => {
        pipes.current = [];
        birdPosition.current = { x: 275, y: 400 };
        birdVelocity.current = 0;
        currentBirdIndex.current = 0;
        score.current = 0;
        groundPosition.current = 0;
        invertedGroundPosition.current = 0;
        birdSizeRef.current = initialBirdSize;
        initialBirdPosition.current = { x: 275, y: 400 };
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
            dieSound.play();
            setTimeout(() => {
                setMotivation(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
                setShowMenu(true);
            }, 1000);
        }
    };

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

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const birdImgs = birdImages.map((img) => {
            const image = new Image();
            image.src = img;
            return image;
        });

        const foreground = new Image();
        foreground.src = mapFolder[assetsIndex].fg;

        const background = new Image();
        background.src = mapFolder[assetsIndex].bg;

        const pipe = new Image();
        pipe.src = mapFolder[assetsIndex].pipe;

        const gameLoop = () => {
            const deltaTime = 1000 / 30;

            updateGameLogic(deltaTime / 1000);
            drawGame(context, birdImgs, foreground, background, pipe);
            if (gameState !== "gameOver" || birdPosition.current.y < canvas.height) {
                animationFrameRef.current = setTimeout(gameLoop, deltaTime);
            }
        };

        const updateGameLogic = (deltaTime) => {
            if (gameState === "start" || gameState === "gameOver") {
                groundPosition.current = (groundPosition.current - groundSpeed) % canvas.width;
                invertedGroundPosition.current = (invertedGroundPosition.current - groundSpeed) % canvas.width;
            }

            if (gameState === "gameOver") {
                birdVelocity.current += gravity;
                birdPosition.current.y += birdVelocity.current;
                if (birdPosition.current.y >= canvas.height - birdSize / 2) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                return;
            }

            if (gameState !== "playing") return;

            birdVelocity.current += gravity;
            birdPosition.current.y += birdVelocity.current;

            if (checkCollision()) {
                if (score.current < 5) {
                    restartGame();
                } else {
                    setGameState("gameOver");
                }
                return;
            }

            if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < canvas.width - 400) {
                const newPipeY = canvas.height - pipeHeight - Math.floor(Math.random() * 101);
                pipes.current.push({ x: canvas.width, y: newPipeY });
            }

            pipes.current = pipes.current.map(pipe => {
                pipe.x -= pipeSpeed;
                if (!pipe.passed && pipe.x + pipeWidth < birdPosition.current.x + birdSize) {
                    pipe.passed = true;
                    score.current += 1;
                }
                return pipe;
            });

            if (pipes.current.length > 0 && pipes.current[0].x < -pipeWidth) {
                pipes.current.shift();
            }

            groundPosition.current = (groundPosition.current - groundSpeed) % canvas.width;
            invertedGroundPosition.current = (invertedGroundPosition.current - groundSpeed) % canvas.width;
        };

        const drawGame = (context, birdImgs, foreground, background, pipe) => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const parallaxOffset = parallaxMax * (birdPosition.current.y / canvas.height - 0.5);
            const backgroundWidth = canvas.width * 1.05;
            const backgroundHeight = (canvas.height - 100) * 1.05;
            context.drawImage(background, 0, parallaxOffset, backgroundWidth, backgroundHeight);

            pipes.current.forEach((pipeData) => {
                context.save();
                context.translate(pipeData.x + pipeWidth / 2, pipeData.y - gapHeight - pipeHeight);
                context.rotate(Math.PI);
                context.drawImage(pipe, -pipeWidth / 2, -pipeHeight, pipeWidth, pipeHeight);
                context.restore();
                context.drawImage(pipe, pipeData.x, pipeData.y, pipeWidth, pipeHeight);
            });

            context.font = "60px MyFont";
            context.fillStyle = "#FFF";
            context.fillText(`Score: ${score.current}`, canvas.width / 2 - context.measureText(`Score: ${score.current}`).width / 2, 60);

            context.drawImage(foreground, groundPosition.current, canvas.height - 100, canvas.width + 5, 100);
            context.drawImage(foreground, groundPosition.current + canvas.width, canvas.height - 100, canvas.width, 100);

            context.save();
            context.scale(1, -1);
            context.drawImage(foreground, invertedGroundPosition.current, -100, canvas.width + 5, 100);
            context.drawImage(foreground, invertedGroundPosition.current + canvas.width, -100, canvas.width, 100);
            context.restore();

            if (isAnimating) {
                const animationYOffset = 15 * Math.sin((Date.now() / 200) % (2 * Math.PI));
                context.drawImage(birdImgs[currentBirdIndex.current], initialBirdPosition.current.x - birdSizeRef.current / 2, initialBirdPosition.current.y + animationYOffset - birdSizeRef.current / 2, birdSizeRef.current, birdSizeRef.current);

                if (showText) {
                    context.font = "80px MyFont";
                    context.fillStyle = "#FFF";
                    context.fillText("TAP to start!", canvas.width / 2 - context.measureText("TAP to start!").width / 2, textRef.current);
                }
            } else {
                context.drawImage(birdImgs[currentBirdIndex.current], birdPosition.current.x, birdPosition.current.y, birdSize, birdSize);
            }
        };

        const startGame = () => {
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        birdImgs[0].onload = startGame;

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            clearInterval(birdAnimationRef.current);
        };
    }, [gameState, isAnimating, showText]);

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
            const randomFlapSound = flapSounds[Math.floor(Math.random() * flapSounds.length)];
            randomFlapSound.play();
            birdVelocity.current = jumpHeight;
        }
    };

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
