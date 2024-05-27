import React, { useEffect, useRef, useState } from 'react';
import SpriteSheet from '../assets/img/sprite_sheet.png';

const Game = () => {
  const canvasRef = useRef(null);
  const spriteSheet = useRef(new Image());
  const [frames, setFrames] = useState(0);
  const [birdFlapped, setBirdFlapped] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [pPressed, setPPressed] = useState(false);
  const [nWasPressed, setNWasPressed] = useState(false);
  const [mute, setMute] = useState(false);
  const [night, setNight] = useState(false);
  const DEGREE = Math.PI / 180;

  const state = {
    current: 0,
    home: 0,
    getReady: 1,
    game: 2,
    gameOver: 3,
  };

  const bird = {
    animation: [
      { spriteX: 0, spriteY: 801, spriteW: 144, spriteH: 164 },
      { spriteX: 144, spriteY: 801, spriteW: 144, spriteH: 164 },
      { spriteX: 288, spriteY: 801, spriteW: 144, spriteH: 164 },
      { spriteX: 432, spriteY: 801, spriteW: 144, spriteH: 164 },
      { spriteX: 576, spriteY: 801, spriteW: 144, spriteH: 164 },
      { spriteX: 720, spriteY: 801, spriteW: 144, spriteH: 164 }
    ],
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    frame: 0,
    gravity: 0,
    jump: 0,
    speed: 0,
    rotation: 0,
    radius_x: 0,
    radius_y: 0,
    draw(ctx) {
      let birdFrame = this.animation[this.frame];
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      if (state.current !== state.home) {
        ctx.drawImage(
          spriteSheet.current,
          birdFrame.spriteX, birdFrame.spriteY,
          birdFrame.spriteW, birdFrame.spriteH,
          -this.w / 2, -this.h / 2,
          this.w, this.h
        );
      }
      ctx.restore();
    },
    flap() {
      this.speed = -this.jump;
    },
    update() {
      this.period = (state.current === state.getReady) ? 2 : 1; // Slow down the animation
      this.frame += frames % this.period === 0 ? 1 : 0;
      this.frame = this.frame % this.animation.length;
      if (state.current === state.getReady) {
        this.y = canvasRef.current.height * 0.395;
        this.rotation = 0 * DEGREE;
      } else {
        this.speed += this.gravity;
        this.y += this.speed;
        if (this.y + this.h / 2 >= foreground.y) {
          this.y = foreground.y - this.h / 2;
          if (state.current === state.game) {
            state.current = state.gameOver;
          }
        }
        if (this.speed >= this.jump) {
          this.rotation = 90 * DEGREE;
          this.frame = 0;
        } else {
          this.rotation = -25 * DEGREE;
        }
      }
    },
    speedReset() {
      this.speed = 0;
    }
  };

  const pipes = {
    position: [],
    top: {
      spriteX: 1787, spriteY: 0,
      spriteW: 235, spriteH: 965,
      x: 0, y: 0,
      w: 0, h: 0
    },
    bottom: {
      spriteX: 1552, spriteY: 0,
      spriteW: 235, spriteH: 965,
      x: 0, y: 0,
      w: 0, h: 0
    },
    dx: 0,
    gap: 0,
    maxYPos: 0,
    scored: false,
    draw(ctx) {
      if (state.current === state.game || state.current === state.gameOver) {
        for (let i = 0; i < this.position.length; i++) {
          let p = this.position[i];
          let topYPos = p.y;
          let bottomYPos = p.y + this.h + this.gap;
          ctx.drawImage(
            spriteSheet.current,
            this.top.spriteX, this.top.spriteY,
            this.top.spriteW, this.top.spriteH,
            p.x, topYPos,
            this.w, this.h
          );
          ctx.drawImage(
            spriteSheet.current,
            this.bottom.spriteX, this.bottom.spriteY,
            this.bottom.spriteW, this.bottom.spriteH,
            p.x, bottomYPos,
            this.w, this.h
          );
        }
      }
    },
    update() {
      if (state.current !== state.game) return;
      if (frames % 150 === 0) { // Increase the interval to slow down pipe generation
        this.position.push({
          x: canvasRef.current.width,
          y: this.maxYPos * (Math.random() + 1),
          scored: false
        });
      }
      for (let i = 0; i < this.position.length; i++) {
        let p = this.position[i];
        let bottomYPos = p.y + this.h + this.gap;
        if (
          bird.x + bird.radius_x > p.x && bird.x - bird.radius_x < p.x + this.w &&
          bird.y + bird.radius_y > p.y && bird.y - bird.radius_y < p.y + this.h
        ) {
          state.current = state.gameOver;
        }
        if (
          bird.x + bird.radius_x > p.x && bird.x - bird.radius_x < p.x + this.w &&
          bird.y + bird.radius_y > bottomYPos && bird.y - bird.radius_y < bottomYPos + this.h
        ) {
          state.current = state.gameOver;
        }
        if (
          bird.x + bird.radius_x > p.x && bird.x - bird.radius_x < p.x + this.w &&
          bird.y <= 0
        ) {
          state.current = state.gameOver;
        }
        p.x -= this.dx;
        if (p.x + this.w < 0) {
          this.position.shift();
        }
        if (p.x + this.w < bird.x - bird.radius_x && !p.scored) {
          score.game_score++;
          if (score.game_score > score.best_score) {
            score.best_score = score.game_score;
            score.new_best_score = true;
          }
          localStorage.setItem("best_score", score.best_score);
          p.scored = true;
        }
      }
    },
    pipesReset() {
      this.position = [];
    }
  };

  const background = {
    day_spriteX: 0,
    night_spriteX: 1000,
    spriteY: 392,
    spriteW: 552,
    spriteH: 408,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    stars: {
      spriteX: 1000,
      spriteY: 0,
      spriteW: 552,
      spriteH: 392,
      y: 0,
      h: 0
    },
    draw(ctx) {
      let spriteX = night ? this.night_spriteX : this.day_spriteX;
      ctx.drawImage(
        spriteSheet.current,
        spriteX, this.spriteY,
        this.spriteW, this.spriteH,
        this.x, this.y,
        this.w, this.h
      );
      if (night) {
        ctx.drawImage(
          spriteSheet.current,
          this.stars.spriteX, this.stars.spriteY,
          this.stars.spriteW, this.stars.spriteH,
          this.x, this.stars.y,
          this.w, this.stars.h
        );
      }
    }
  };

  const foreground = {
    spriteX: 553,
    spriteY: 576,
    spriteW: 447,
    spriteH: 224,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dx: 0,
    draw(ctx) {
      ctx.drawImage(
        spriteSheet.current,
        this.spriteX, this.spriteY,
        this.spriteW, this.spriteH,
        this.x, this.y,
        this.w, this.h
      );
      ctx.drawImage(
        spriteSheet.current,
        this.spriteX, this.spriteY,
        this.spriteW, this.spriteH,
        (this.x + this.w) - 0.7, this.y,
        this.w, this.h
      );
      ctx.drawImage(
        spriteSheet.current,
        this.spriteX, this.spriteY,
        this.spriteW, this.spriteH,
        (this.x + this.w + this.w) - 1.4, this.y,
        this.w, this.h
      );
    },
    update() {
      if (state.current !== state.gameOver) {
        this.x = (this.x - this.dx) % this.w;
      }
    }
  };

  const home = {
    logo: {
      spriteX: 552, spriteY: 233,
      spriteW: 384, spriteH: 87,
      x: 0, y: 0,
      w: 0, h: 0,
      MAXY: 0, MINY: 0, dy: 0
    },
    animation: [
      { spriteX: 931, spriteY: 429, spriteW: 68, spriteH: 48 },
      { spriteX: 931, spriteY: 478, spriteW: 68, spriteH: 48 },
      { spriteX: 931, spriteY: 527, spriteW: 68, spriteH: 48 }
    ],
    bird: {
      x: 0, y: 0,
      w: 0, h: 0
    },
    studio_name: {
      spriteX: 172, spriteY: 284,
      spriteW: 380, spriteH: 28,
      x: 0, y: 0,
      w: 0, h: 0
    },
    frame: 0,
    logoGoUp: true,
    draw(ctx) {
      let birdFrame = this.animation[this.frame];
      if (state.current === state.home) {
        ctx.drawImage(
          spriteSheet.current,
          this.logo.spriteX, this.logo.spriteY,
          this.logo.spriteW, this.logo.spriteH,
          this.logo.x, this.logo.y,
          this.logo.w, this.logo.h
        );
        ctx.drawImage(
          spriteSheet.current,
          birdFrame.spriteX, birdFrame.spriteY,
          birdFrame.spriteW, birdFrame.spriteH,
          this.bird.x, this.bird.y,
          this.bird.w, this.bird.h
        );
        ctx.drawImage(
          spriteSheet.current,
          this.studio_name.spriteX, this.studio_name.spriteY,
          this.studio_name.spriteW, this.studio_name.spriteH,
          this.studio_name.x, this.studio_name.y,
          this.studio_name.w, this.studio_name.h
        );
      }
    },
    update() {
      if (state.current === state.home) {
        if (this.logoGoUp) {
          this.logo.y -= this.logo.dy;
          this.bird.y -= this.logo.dy;
          if (this.logo.y <= this.logo.MAXY) {
            this.logoGoUp = false;
          }
        } else {
          this.logo.y += this.logo.dy;
          this.bird.y += this.logo.dy;
          if (this.logo.y >= this.logo.MINY) {
            this.logoGoUp = true;
          }
        }
      }
      this.period = 6;
      this.frame += frames % this.period === 0 ? 1 : 0;
      this.frame = this.frame % this.animation.length;
    }
  };

  const getReady = {
    get_ready: {
      spriteX: 552, spriteY: 321,
      spriteW: 349, spriteH: 87,
      x: 0, y: 0,
      w: 0, h: 0
    },
    tap: {
      spriteX: 0, spriteY: 0,
      spriteW: 155, spriteH: 196,
      x: 0, y: 0,
      w: 0, h: 0
    },
    draw(ctx) {
      if (state.current === state.getReady) {
        ctx.drawImage(
          spriteSheet.current,
          this.get_ready.spriteX, this.get_ready.spriteY,
          this.get_ready.spriteW, this.get_ready.spriteH,
          this.get_ready.x, this.get_ready.y,
          this.get_ready.w, this.get_ready.h
        );
        ctx.drawImage(
          spriteSheet.current,
          this.tap.spriteX, this.tap.spriteY,
          this.tap.spriteW, this.tap.spriteH,
          this.tap.x, this.tap.y,
          this.tap.w, this.tap.h
        );
      }
    }
  };

  const gameButtons = {
    mute_button: {
      spriteX: 171, spriteY: 63,
      spriteW: 55, spriteH: 62,
    },
    unmute_button: {
      spriteX: 171, spriteY: 0,
      spriteW: 55, spriteH: 62,
    },
    start_button: {
      spriteX: 227, spriteY: 0,
      spriteW: 160, spriteH: 56,
      x: 0, y: 0,
      w: 0, h: 0,
      y_pressed: 0,
      isPressed: false
    },
    pause_button: {
      spriteX: 280, spriteY: 114,
      spriteW: 52, spriteH: 56,
    },
    resume_button: {
      spriteX: 227, spriteY: 114,
      spriteW: 52, spriteH: 56,
    },
    home_button: {
      spriteX: 388, spriteY: 171,
      spriteW: 160, spriteH: 56,
      x: 0, y: 0,
      w: 0, h: 0,
      y_pressed: 0,
      isPressed: false
    },
    restart_button: {
      spriteX: 227, spriteY: 57,
      spriteW: 160, spriteH: 56,
      x: 0, y: 0,
      w: 0, h: 0,
      y_pressed: 0,
      isPressed: false
    },
    night_button: {
      spriteX: 280, spriteY: 171,
      spriteW: 56, spriteH: 60,
      x: 0,
      isPressed: false
    },
    day_button: {
      spriteX: 223, spriteY: 171,
      spriteW: 56, spriteH: 60,
      x: 0,
      isPressed: false
    },
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    y_pressed: 0,
    isPressed: false,
    draw(ctx) {
      let button_y = this.isPressed ? this.y_pressed : this.y;
      let night_button_y = this.night_button.isPressed ? this.y_pressed : this.y;
      let start_button_y = this.start_button.isPressed ? this.start_button.y_pressed : this.start_button.y;
      let restart_button_y = this.restart_button.isPressed ? this.restart_button.y_pressed : this.restart_button.y;
      let home_button_y = this.home_button.isPressed ? this.home_button.y_pressed : this.home_button.y;
      if (state.current === state.home) {
        if (!mute) {
          ctx.drawImage(
            spriteSheet.current,
            this.unmute_button.spriteX, this.unmute_button.spriteY,
            this.unmute_button.spriteW, this.unmute_button.spriteH,
            this.x, button_y,
            this.w, this.h
          );
        } else if (mute) {
          ctx.drawImage(
            spriteSheet.current,
            this.mute_button.spriteX, this.mute_button.spriteY,
            this.mute_button.spriteW, this.mute_button.spriteH,
            this.x, button_y,
            this.w, this.h
          );
        }
        if (!night) {
          ctx.drawImage(
            spriteSheet.current,
            this.day_button.spriteX, this.day_button.spriteY,
            this.day_button.spriteW, this.day_button.spriteH,
            this.night_button.x, night_button_y,
            this.w, this.h
          );
        } else if (night) {
          ctx.drawImage(
            spriteSheet.current,
            this.night_button.spriteX, this.night_button.spriteY,
            this.night_button.spriteW, this.night_button.spriteH,
            this.night_button.x, night_button_y,
            this.w, this.h
          );
        }
        ctx.drawImage(
          spriteSheet.current,
          this.start_button.spriteX, this.start_button.spriteY,
          this.start_button.spriteW, this.start_button.spriteH,
          this.start_button.x, start_button_y,
          this.start_button.w, this.start_button.h
        );
      } else if (state.current === state.game) {
        if (!gamePaused) {
          ctx.drawImage(
            spriteSheet.current,
            this.pause_button.spriteX, this.pause_button.spriteY,
            this.pause_button.spriteW, this.pause_button.spriteH,
            this.x, button_y,
            this.w, this.h
          );
        } else if (gamePaused) {
          ctx.drawImage(
            spriteSheet.current,
            this.resume_button.spriteX, this.resume_button.spriteY,
            this.resume_button.spriteW, this.resume_button.spriteH,
            this.x, button_y,
            this.w, this.h
          );
        }
      } else if (state.current === state.gameOver) {
        ctx.drawImage(
          spriteSheet.current,
          this.restart_button.spriteX, this.restart_button.spriteY,
          this.restart_button.spriteW, this.restart_button.spriteH,
          this.restart_button.x, restart_button_y,
          this.restart_button.w, this.restart_button.h
        );
        ctx.drawImage(
          spriteSheet.current,
          this.home_button.spriteX, this.home_button.spriteY,
          this.home_button.spriteW, this.home_button.spriteH,
          this.home_button.x, home_button_y,
          this.home_button.w, this.home_button.h
        );
      }
    }
  };

  const gameOver = {
    game_over: {
      spriteX: 553, spriteY: 410,
      spriteW: 376, spriteH: 75,
      x: 0, y: 0,
      w: 0, h: 0
    },
    scoreboard: {
      spriteX: 548, spriteY: 0,
      spriteW: 452, spriteH: 232,
      x: 0, y: 0,
      w: 0, h: 0
    },
    draw(ctx) {
      if (state.current === state.gameOver) {
        ctx.drawImage(
          spriteSheet.current,
          this.game_over.spriteX, this.game_over.spriteY,
          this.game_over.spriteW, this.game_over.spriteH,
          this.game_over.x, this.game_over.y,
          this.game_over.w, this.game_over.h
        );
        ctx.drawImage(
          spriteSheet.current,
          this.scoreboard.spriteX, this.scoreboard.spriteY,
          this.scoreboard.spriteW, this.scoreboard.spriteH,
          this.scoreboard.x, this.scoreboard.y,
          this.scoreboard.w, this.scoreboard.h
        );
      }
    }
  };

  const score = {
    new_best: {
      spriteX: 921, spriteY: 349,
      spriteW: 64, spriteH: 28,
      x: 0, y: 0,
      w: 0, h: 0
    },
    number: [
      { spriteX: 98 }, // 0
      { spriteX: 127 }, // 1
      { spriteX: 156 }, // 2
      { spriteX: 185 }, // 3
      { spriteX: 214 }, // 4
      { spriteX: 243 }, // 5
      { spriteX: 272 }, // 6
      { spriteX: 301 }, // 7
      { spriteX: 330 }, // 8
      { spriteX: 359 }  // 9
    ],
    spriteY: 243,
    spriteW: 28,
    spriteH: 40,
    x: 0,
    y: 0,
    w: 0,
    one_w: 0,
    space: 0,
    score: { x: 0, y: 0, w: 0, h: 0 },
    best: { x: 0, y: 0, w: 0, h: 0 },
    best_score: parseInt(localStorage.getItem("best_score")) || 0,
    game_score: 0,
    new_best_score: false,
    draw(ctx) {
      let game_score_s = this.game_score.toString();
      let best_score_s = this.best_score.toString();
      if (state.current === state.game) {
        let total_width = 0;
        for (let i = 0; i < game_score_s.length; i++) {
          if (game_score_s[i] === 1) {
            total_width += this.one_w + this.space;
          } else {
            total_width += this.w + this.space;
          }
        }
        total_width -= this.space;
        let offset = this.x - total_width / 2 + (this.w / 2);
        for (let i = 0; i < game_score_s.length; i++) {
          if (i < game_score_s.length - 1 && game_score_s[i + 1] === 1) {
            ctx.drawImage(
              spriteSheet.current,
              this.number[parseInt(game_score_s[i])].spriteX, this.spriteY,
              this.spriteW, this.spriteH,
              offset, this.y,
              this.w, this.h
            );
            offset = offset + this.one_w + this.space;
          } else {
            ctx.drawImage(
              spriteSheet.current,
              this.number[parseInt(game_score_s[i])].spriteX, this.spriteY,
              this.spriteW, this.spriteH,
              offset, this.y,
              this.w, this.h
            );
            offset = offset + this.w + this.space;
          }
        }
      } else if (state.current === state.gameOver) {
        let offset_1 = 0;
        for (let i = game_score_s.length - 1; i >= 0; i--) {
          ctx.drawImage(
            spriteSheet.current,
            this.number[parseInt(game_score_s[i])].spriteX, this.spriteY,
            this.spriteW, this.spriteH,
            this.score.x + offset_1, this.score.y,
            this.w, this.h
          );
          if (parseInt(game_score_s[i]) === 1) {
            offset_1 = offset_1 - this.one_w - this.space;
          } else {
            offset_1 = offset_1 - this.w - this.space;
          }
        }
        let offset_2 = 0;
        for (let i = best_score_s.length - 1; i >= 0; i--) {
          ctx.drawImage(
            spriteSheet.current,
            this.number[parseInt(best_score_s[i])].spriteX, this.spriteY,
            this.spriteW, this.spriteH,
            this.best.x + offset_2, this.best.y,
            this.w, this.h
          );
          if (parseInt(best_score_s[i]) === 1) {
            offset_2 = offset_2 - this.one_w - this.space;
          } else {
            offset_2 = offset_2 - this.w - this.space;
          }
        }
        if (this.new_best_score) {
          ctx.drawImage(
            spriteSheet.current,
            this.new_best.spriteX, this.new_best.spriteY,
            this.new_best.spriteW, this.new_best.spriteH,
            this.new_best.x, this.new_best.y,
            this.new_best.w, this.new_best.h
          );
        }
      }
    },
    scoreReset() {
      this.game_score = 0;
      this.new_best_score = false;
    }
  };

  const medal = {
    bronze: { spriteX: 554 },
    silver: { spriteX: 642 },
    gold: { spriteX: 731 },
    platinum: { spriteX: 820 },
    spriteY: 487,
    spriteW: 88,
    spriteH: 87,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    medal: "",
    animation: [
      { spriteX: 922, spriteY: 386, spriteW: 20, spriteH: 20 },
      { spriteX: 943, spriteY: 386, spriteW: 20, spriteH: 20 },
      { spriteX: 964, spriteY: 386, spriteW: 20, spriteH: 20 },
      { spriteX: 943, spriteY: 386, spriteW: 20, spriteH: 20 },
      { spriteX: 922, spriteY: 386, spriteW: 20, spriteH: 20 }
    ],
    animation_w: 0,
    animation_h: 0,
    shine_position: [],
    frame: 0,
    radius: 0,
    draw(ctx) {
      let medalSpriteX;
      if (score.game_score >= 10 && score.game_score < 20) {
        this.medal = "bronze";
        medalSpriteX = this.bronze;
      } else if (score.game_score >= 20 && score.game_score < 30) {
        this.medal = "silver";
        medalSpriteX = this.silver;
      } else if (score.game_score >= 30 && score.game_score < 40) {
        this.medal = "gold";
        medalSpriteX = this.gold;
      } else if (score.game_score >= 40) {
        this.medal = "platinum";
        medalSpriteX = this.platinum;
      }
      if (state.current === state.gameOver && score.game_score >= 10) {
        ctx.drawImage(
          spriteSheet.current,
          medalSpriteX.spriteX, this.spriteY,
          this.spriteW, this.spriteH,
          this.x, this.y,
          this.w, this.h
        );
        let shine = this.animation[this.frame];
        for (let i = 0; i < this.shine_position.length; i++) {
          let position = this.shine_position[i];
          ctx.drawImage(
            spriteSheet.current,
            shine.spriteX, shine.spriteY,
            shine.spriteW, shine.spriteH,
            position.x, position.y,
            this.animation_w, this.animation_h
          );
        }
      }
    },
    update() {
      this.period = 7;
      this.frame += frames % this.period === 0 ? 1 : 0;
      this.frame = this.frame % this.animation.length;
      if (this.frame === this.animation.length - 1) this.shine_position = [];
      if (frames % (this.period * this.animation.length) === 0) {
        const limit = 0.9 * this.radius;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * limit;
        this.shine_position.push({
          x: this.centerX + Math.cos(angle) * distance,
          y: this.centerY + Math.sin(angle) * distance
        });
      }
    }
  };

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");

    const canvasScale = () => {
      cvs.width = Math.min(window.innerWidth, 670);
      cvs.height = cvs.width * 1.39;

      background.x = 0;
      background.y = cvs.height * 0.631;
      background.w = cvs.width;
      background.h = background.w * 0.74;
      background.stars.y = background.y * 0.167;
      background.stars.h = cvs.height - background.h;

      foreground.x = 0;
      foreground.y = cvs.height * 0.861;
      foreground.w = cvs.width * 0.7;
      foreground.h = foreground.w * 0.46;
      foreground.dx = cvs.width * 0.008;

      bird.x = cvs.width * 0.290;
      bird.y = cvs.height * 0.395;
      bird.w = cvs.width * 0.117 * 1.6;
      bird.h = cvs.height * 0.059 * 1.6;
      bird.gravity = cvs.height * 0.0006;
      bird.jump = cvs.height * 0.01;
      bird.radius_x = cvs.width * 0.052 * 1.6;
      bird.radius_y = cvs.height * 0.026 * 1.6;

      for (let i = 0; i < pipes.position.length; i++) {
        let w = pipes.w / 0.164;
        let h = pipes.h / 0.888;
        let p = pipes.position[i];
        pipes.position[i] = {
          x: p.x * cvs.width / w,
          y: p.y * cvs.height / h
        };
      }
      pipes.w = cvs.width * 0.164;
      pipes.h = cvs.height * 0.888;
      pipes.gap = cvs.height * 0.3;
      pipes.maxYPos = -(cvs.height * 0.350);
      pipes.dx = cvs.width * 0.007;

      home.logo.x = cvs.width * 0.098;
      home.logo.y = cvs.height * 0.279;
      home.logo.w = cvs.width * 0.665;
      home.logo.h = cvs.height * 0.109;
      home.logo.MAXY = cvs.height * 0.279 - home.logo.h / 7;
      home.logo.MINY = cvs.height * 0.279 + home.logo.h / 7;
      home.logo.dy = cvs.width * 0.0012;

      home.bird.x = cvs.width * 0.803;
      home.bird.y = cvs.height * 0.294;
      home.bird.w = cvs.width * 0.117;
      home.bird.h = cvs.height * 0.059;

      home.studio_name.x = cvs.width * 0.171;
      home.studio_name.y = cvs.height * 0.897;
      home.studio_name.w = cvs.width * 0.659;
      home.studio_name.h = cvs.height * 0.034;

      getReady.get_ready.x = cvs.width * 0.197;
      getReady.get_ready.y = cvs.height * 0.206;
      getReady.get_ready.w = cvs.width * 0.602;
      getReady.get_ready.h = cvs.height * 0.109;

      getReady.tap.x = cvs.width * 0.433;
      getReady.tap.y = cvs.height * 0.435;
      getReady.tap.w = cvs.width * 0.270;
      getReady.tap.h = cvs.height * 0.244;

      gameButtons.x = cvs.width * 0.087;
      gameButtons.y = cvs.height * 0.045;
      gameButtons.y_pressed = cvs.height * 0.049;
      gameButtons.w = cvs.width * 0.088;
      gameButtons.h = cvs.height * 0.069;
      gameButtons.night_button.x = cvs.width * 0.189;
      gameButtons.start_button.x = cvs.width * 0.359;
      gameButtons.start_button.y = cvs.height * 0.759;
      gameButtons.start_button.y_pressed = cvs.height * 0.763;
      gameButtons.start_button.w = cvs.width * 0.276;
      gameButtons.start_button.h = cvs.height * 0.068;
      gameButtons.restart_button.x = cvs.width * 0.147;
      gameButtons.restart_button.y = cvs.height * 0.759;
      gameButtons.restart_button.y_pressed = cvs.height * 0.763;
      gameButtons.restart_button.w = cvs.width * 0.276;
      gameButtons.restart_button.h = cvs.height * 0.068;
      gameButtons.home_button.x = cvs.width * 0.576;
      gameButtons.home_button.y = cvs.height * 0.759;
      gameButtons.home_button.y_pressed = cvs.height * 0.763;
      gameButtons.home_button.w = cvs.width * 0.276;
      gameButtons.home_button.h = cvs.height * 0.068;

      gameOver.game_over.x = cvs.width * 0.182;
      gameOver.game_over.y = cvs.height * 0.243;
      gameOver.game_over.w = cvs.width * 0.645;
      gameOver.game_over.h = cvs.height * 0.095;
      gameOver.scoreboard.x = cvs.width * 0.107;
      gameOver.scoreboard.y = cvs.height * 0.355;
      gameOver.scoreboard.w = cvs.width * 0.782;
      gameOver.scoreboard.h = cvs.height * 0.289;

      score.new_best.x = cvs.width * 0.577;
      score.new_best.y = cvs.height * 0.500;
      score.new_best.w = cvs.width * 0.112;
      score.new_best.h = cvs.height * 0.035;
      score.w = cvs.width * 0.048;
      score.h = cvs.height * 0.046;
      score.one_w = cvs.width * 0.032;
      score.x = cvs.width * 0.476;
      score.y = cvs.height * 0.045;
      score.score.x = cvs.width * 0.769;
      score.score.y = cvs.height * 0.441;
      score.best.x = cvs.width * 0.769;
      score.best.y = cvs.height * 0.545;
      score.space = cvs.width * 0.016;

      medal.x = cvs.width * 0.197;
      medal.y = cvs.height * 0.461;
      medal.w = cvs.width * 0.152;
      medal.h = cvs.height * 0.108;

      for (let i = 0; i < medal.shine_position.length; i++) {
        let w = medal.animation_w / 0.034;
        let h = medal.animation_w / 0.023;
        let position = medal.shine_position[i];
        medal.shine_position[i] = {
          x: position.x * cvs.width / w,
          y: position.y * cvs.height / h
        };
      }
      medal.radius = cvs.width * 0.061;
      medal.centerX = cvs.width * 0.257;
      medal.centerY = cvs.height * 0.506;
      medal.animation_w = cvs.width * 0.034;
      medal.animation_h = cvs.height * 0.023;
    };

    const draw = () => {
      ctx.fillStyle = !night ? "#85d2fc" : "#12284C";
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      background.draw(ctx);
      pipes.draw(ctx);
      foreground.draw(ctx);
      bird.draw(ctx);
      home.draw(ctx);
      getReady.draw(ctx);
      gameButtons.draw(ctx);
      gameOver.draw(ctx);
      medal.draw(ctx);
      score.draw(ctx);
    };

    const update = () => {
      if (!gamePaused) {
        bird.update();
        foreground.update();
        pipes.update();
      }
      home.update();
      medal.update();
    };

    const loop = () => {
      setTimeout(() => {
        update();
        draw();
        if (!gamePaused) {
          setFrames((prevFrames) => prevFrames + 1);
        }
        requestAnimationFrame(loop);
      }, (1 / 75) * 1000);
    };

    const handleResize = () => {
      canvasScale();
    };

    const handleKeyDown = (event) => {
      if (event.key === " ") {
        if (state.current === state.getReady) {
          bird.flap();
          setBirdFlapped(true);
          state.current = state.game;
        } else if (state.current === state.game) {
          if (!birdFlapped && !gamePaused) {
            bird.flap();
            setBirdFlapped(true);
          }
        }
      } else if (event.key === "p" || event.key === "P") {
        if (state.current === state.game && !pPressed) {
          setGamePaused(!gamePaused);
          gameButtons.isPressed = true;
          setPPressed(true);
        }
      } else if (event.key === "n" || event.key === "N") {
        document.body.style.backgroundColor = nWasPressed ? "#FFF" : "#123";
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === " " && state.current === state.game) {
        setBirdFlapped(false);
      } else if ((event.key === "p" || event.key === "P") && state.current === state.game) {
        gameButtons.isPressed = false;
        setPPressed(false);
      } else if (event.key === "n" || event.key === "N") {
        setNWasPressed(!nWasPressed);
      }
    };

    const handleClick = (event) => {
      const rect = cvs.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
    
      switch (state.current) {
        case state.home:
          if (
            clickX >= gameButtons.x &&
            clickX <= gameButtons.x + gameButtons.w &&
            clickY >= gameButtons.y &&
            clickY <= gameButtons.y + gameButtons.h
          ) {
            setMute(!mute);
          } else if (
            clickX >= gameButtons.night_button.x &&
            clickX <= gameButtons.night_button.x + gameButtons.night_button.w &&
            clickY >= gameButtons.night_button.y &&
            clickY <= gameButtons.night_button.y + gameButtons.night_button.h
          ) {
            setNight(!night);
          } else if (
            clickX >= gameButtons.start_button.x &&
            clickX <= gameButtons.start_button.x + gameButtons.start_button.w &&
            clickY >= gameButtons.start_button.y &&
            clickY <= gameButtons.start_button.y + gameButtons.start_button.h
          ) {
            state.current = state.getReady;
          }
          break;
        case state.getReady:
          bird.flap();
          setBirdFlapped(true);
          state.current = state.game;
          break;
        case state.game:
          if (
            clickX >= gameButtons.x &&
            clickX <= gameButtons.x + gameButtons.w &&
            clickY >= gameButtons.y &&
            clickY <= gameButtons.y + gameButtons.h
          ) {
            setGamePaused(!gamePaused);
          } else if (!gamePaused) {
            bird.flap();
          }
          break;
        case state.gameOver:
          if (
            clickX >= gameButtons.restart_button.x &&
            clickX <= gameButtons.restart_button.x + gameButtons.restart_button.w &&
            clickY >= gameButtons.restart_button.y &&
            clickY <= gameButtons.restart_button.y + gameButtons.restart_button.h
          ) {
            pipes.pipesReset();
            bird.speedReset();
            score.scoreReset();
            gameButtons.restart_button.isPressed = false;
            state.current = state.getReady;
          } else if (
            clickX >= gameButtons.home_button.x &&
            clickX <= gameButtons.home_button.x + gameButtons.home_button.w &&
            clickY >= gameButtons.home_button.y &&
            clickY <= gameButtons.home_button.y + gameButtons.home_button.h
          ) {
            pipes.pipesReset();
            bird.speedReset();
            score.scoreReset();
            gameButtons.home_button.isPressed = false;
            state.current = state.home;
          }
          break;
        default:
          break;
      }
    };    

    spriteSheet.current.onload = () => {
      console.log('Sprite sheet loaded');
      canvasScale();
      loop();
    };
    spriteSheet.current.onerror = () => {
      console.error('Failed to load sprite sheet');
    };
    spriteSheet.current.src = SpriteSheet;

    canvasScale();
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    cvs.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      cvs.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
