import React, { useEffect, useRef, useState } from 'react';
import birdImg from '../assets/img/bird.png';
import bgImg from '../assets/img/bg.png';
import fgImg from '../assets/img/fg.png';
import pipeUpImg from '../assets/img/pipeUp.png';
import pipeBottomImg from '../assets/img/pipeBottom.png';
import flySound from '../assets/audio/fly.mp3';
import scoreSound from '../assets/audio/score.mp3';

function Game() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const flySoundRef = useRef(new Audio(flySound));
    const scoreSoundRef = useRef(new Audio(scoreSound));

    useEffect(() => {
        const cvs = canvasRef.current;
        const ctx = cvs.getContext('2d');

        const bird = new Image();
        const bg = new Image();
        const fg = new Image();
        const pipeUp = new Image();
        const pipeBottom = new Image();

        bird.src = birdImg;
        bg.src = bgImg;
        fg.src = fgImg;
        pipeUp.src = pipeUpImg;
        pipeBottom.src = pipeBottomImg;

        const gap = 90;
        const pipe = [];
        pipe[0] = {
            x: cvs.width,
            y: 0
        };

        let xPos = 10;
        let yPos = 150;
        const grav = 1.5;

        const moveUp = () => {
            yPos -= 25;
            flySoundRef.current.play();
        };

        document.addEventListener('keydown', moveUp);

        const draw = () => {
            ctx.drawImage(bg, 0, 0);

            for (let i = 0; i < pipe.length; i++) {
                ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

                pipe[i].x--;

                if (pipe[i].x === 125) {
                    pipe.push({
                        x: cvs.width,
                        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
                    });
                }

                if (
                    (xPos + bird.width >= pipe[i].x &&
                        xPos <= pipe[i].x + pipeUp.width &&
                        (yPos <= pipe[i].y + pipeUp.height ||
                            yPos + bird.height >= pipe[i].y + pipeUp.height + gap)) ||
                    yPos + bird.height >= cvs.height - fg.height
                ) {
                    setGameOver(true);
                }

                if (pipe[i].x === 5) {
                    setScore((prevScore) => prevScore + 1);
                    scoreSoundRef.current.play();
                }
            }

            ctx.drawImage(fg, 0, cvs.height - fg.height);
            ctx.drawImage(bird, xPos, yPos);

            yPos += grav;

            ctx.fillStyle = '#000';
            ctx.font = '24px Verdana';
            ctx.fillText('Score: ' + score, 10, cvs.height - 20);

            if (!gameOver) {
                requestAnimationFrame(draw);
            }
        };

        pipeBottom.onload = draw;

        return () => {
            document.removeEventListener('keydown', moveUp);
        };
    }, [score, gameOver]);

    return (
        <div style={styles.container}>
            <canvas ref={canvasRef} width="288" height="512" style={styles.canvas}></canvas>
            {gameOver && (
                <div style={styles.gameOver}>
                    <h1>Game Over</h1>
                    <p>Score: {score}</p>
                    <button onClick={() => window.location.reload()}>Restart</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f0f0f0',
    },
    canvas: {
        border: '1px solid #000',
    },
    gameOver: {
        textAlign: 'center',
    },
};

export default Game;
