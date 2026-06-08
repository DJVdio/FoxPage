"use client";

import Link from "next/link";
import PipHeader from "@/app/pip-header";
import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 480;
const BIRD_X = 80;
const BIRD_SIZE = 16;
const PIPE_W = 44;
const GAP = 140;
const PIPE_SPEED = 2.2;
const GRAVITY = 0.45;
const FLAP_VEL = -6.5;

interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

function randomGapY() {
  const min = 60;
  const max = H - GAP - 60;
  return Math.floor(Math.random() * (max - min) + min);
}

export default function FlappyBirdPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const birdY = useRef(H / 2);
  const birdV = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const frameId = useRef(0);
  const startedRef = useRef(false);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);

  const resetGame = useCallback(() => {
    birdY.current = H / 2;
    birdV.current = 0;
    pipes.current = [{ x: W + 40, gapY: randomGapY(), scored: false }];
    scoreRef.current = 0;
    setScore(0);
    gameOverRef.current = false;
    setGameOver(false);
    startedRef.current = false;
    setStarted(false);
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, W, H);

    for (let x = 0; x < W; x += 24) {
      for (let y = 0; y < H; y += 24) {
        ctx.fillStyle = (x + y) % 48 === 0 ? "#0d1a0d" : "#0a120a";
        ctx.fillRect(x, y, 24, 24);
      }
    }

    for (const p of pipes.current) {
      const topH = p.gapY;
      const botY = p.gapY + GAP;

      ctx.fillStyle = "#00aa2a";
      ctx.shadowColor = "#00ff41";
      ctx.shadowBlur = 4;
      ctx.fillRect(p.x, 0, PIPE_W, topH);
      ctx.fillRect(p.x, botY, PIPE_W, H - botY);

      ctx.fillStyle = "#00ff41";
      ctx.shadowBlur = 8;
      ctx.fillRect(p.x - 4, topH - 20, PIPE_W + 8, 16);
      ctx.fillRect(p.x - 4, botY + 4, PIPE_W + 8, 16);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#003a0f";
      ctx.fillRect(p.x + 4, 0, 6, topH);
      ctx.fillRect(p.x + PIPE_W - 10, 0, 6, topH);
      ctx.fillRect(p.x + 4, botY, 6, H - botY);
      ctx.fillRect(p.x + PIPE_W - 10, botY, 6, H - botY);
    }

    const by = birdY.current;
    ctx.fillStyle = "#ffb000";
    ctx.shadowColor = "#ffb000";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(BIRD_X, by, BIRD_SIZE / 2 + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffd040";
    ctx.beginPath();
    ctx.arc(BIRD_X + 5, by - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0a0f0a";
    ctx.beginPath();
    ctx.arc(BIRD_X + 6, by - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffb000";
    ctx.beginPath();
    ctx.moveTo(BIRD_X + 7, by);
    ctx.lineTo(BIRD_X + 14, by - 2);
    ctx.lineTo(BIRD_X + 14, by + 2);
    ctx.fill();

    ctx.fillStyle = "#00ff41";
    ctx.shadowColor = "#00ff41";
    ctx.shadowBlur = 4;
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(scoreRef.current).padStart(3, "0"), W / 2, 36);
    ctx.shadowBlur = 0;
  }, []);

  const gameLoop = useCallback(() => {
    if (gameOverRef.current) {
      draw();
      return;
    }

    birdV.current += GRAVITY;
    birdY.current += birdV.current;

    for (const p of pipes.current) {
      p.x -= PIPE_SPEED;
    }

    if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < W - 200) {
      pipes.current.push({ x: W, gapY: randomGapY(), scored: false });
    }

    if (pipes.current[0].x + PIPE_W < 0) {
      pipes.current.shift();
    }

    const by = birdY.current;
    if (by <= 0 || by >= H) {
      gameOverRef.current = true;
      setGameOver(true);
      setHighScore((p) => Math.max(p, scoreRef.current));
      draw();
      return;
    }

    for (const p of pipes.current) {
      if (
        BIRD_X + BIRD_SIZE / 2 > p.x &&
        BIRD_X - BIRD_SIZE / 2 < p.x + PIPE_W &&
        (by - BIRD_SIZE / 2 < p.gapY || by + BIRD_SIZE / 2 > p.gapY + GAP)
      ) {
        gameOverRef.current = true;
        setGameOver(true);
        setHighScore((p) => Math.max(p, scoreRef.current));
        draw();
        return;
      }

      if (!p.scored && p.x + PIPE_W < BIRD_X) {
        p.scored = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    }

    draw();
    frameId.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  const flap = useCallback(() => {
    if (gameOverRef.current) return;
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
    }
    birdV.current = FLAP_VEL;
    if (!frameId.current) {
      frameId.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  useEffect(() => {
    resetGame();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameOverRef.current) {
        resetGame();
        frameId.current = requestAnimationFrame(gameLoop);
        return;
      }
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };

    const handleClick = () => {
      if (gameOverRef.current) {
        resetGame();
        frameId.current = requestAnimationFrame(gameLoop);
        return;
      }
      flap();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(frameId.current);
    };
  }, [resetGame, flap, gameLoop]);

  useEffect(() => {
    if (!started && !gameOver) {
      draw();
    }
  }, [started, gameOver, draw]);

  return (
    <>
      <PipHeader />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-lg flex-1">
          <nav className="mb-6">
            <Link
              href="/apps/games"
              prefetch={true}
              className="inline-flex items-center gap-1 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
            >
              <span aria-hidden="true">&lt;</span>
              <span>BACK</span>
            </Link>
          </nav>

          <div className="pip-border flex justify-center rounded p-4">
            <canvas ref={canvasRef} width={W} height={H} className="block cursor-pointer" />
          </div>

          <div className="mt-2 flex items-center justify-center gap-4 text-xs tracking-[0.1em] text-[#00aa2a]">
            <span>SCORE: <span className="text-[#00ff41]">{String(score).padStart(3, "0")}</span></span>
            <span>BEST: <span className="text-[#ffb000]">{String(highScore).padStart(3, "0")}</span></span>
          </div>

          {!started && !gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xs tracking-[0.15em] text-[#00aa2a]/80">
                PRESS <span className="text-[#00ff41]">SPACE</span> OR <span className="text-[#00ff41]">CLICK</span> TO FLY
              </p>
              <p className="mt-1 text-[10px] tracking-[0.1em] text-[#00aa2a]/40">
                FIRST FLAP STARTS THE GAME
              </p>
            </div>
          )}

          {gameOver && (
            <div className="mt-4 text-center space-y-1">
              <p className="text-xs tracking-[0.15em] text-[#ffb000]">GAME OVER</p>
              <p className="text-[10px] tracking-[0.1em] text-[#00aa2a]/60">
                PRESS <span className="text-[#00ff41]">ENTER</span> OR <span className="text-[#00ff41]">CLICK</span> TO RESTART
              </p>
            </div>
          )}
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
            VAULT-TEC™ RECREATIONAL SOFTWARE · FLAPPYBIRD.EXE
          </p>
        </footer>
      </div>
    </>
  );
}
