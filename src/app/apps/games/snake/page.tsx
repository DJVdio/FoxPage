"use client";

import Link from "next/link";
import PipHeader from "@/app/pip-header";
import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 20;
const CELL = 18;
const SPEED = 150;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };

const initialSnake: Pos[] = [{ x: 10, y: 10 }];

function randomFood(snake: Pos[]): Pos {
  let p: Pos;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initFood = randomFood(initialSnake);
  const [snake, setSnake] = useState<Pos[]>(initialSnake);
  const [food, setFood] = useState<Pos>(initFood);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [nextDir, setNextDir] = useState<Dir>("RIGHT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const gameRef = useRef({ snake: initialSnake, food: initFood, dir: "RIGHT" as Dir, gameOver: false });

  const reset = useCallback(() => {
    const s = initialSnake;
    const f = randomFood(s);
    setSnake(s);
    setFood(f);
    setDir("RIGHT");
    setNextDir("RIGHT");
    setScore(0);
    setGameOver(false);
    setStarted(false);
    gameRef.current = { snake: s, food: f, dir: "RIGHT", gameOver: false };
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      const g = gameRef.current;
      if (g.gameOver) return;

      const h = g.snake[0];
      const nd = g.dir;
      let nx = h.x;
      let ny = h.y;
      if (nd === "UP") ny--;
      if (nd === "DOWN") ny++;
      if (nd === "LEFT") nx--;
      if (nd === "RIGHT") nx++;

      if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID || g.snake.some((s) => s.x === nx && s.y === ny)) {
        g.gameOver = true;
        setGameOver(true);
        setHighScore((p) => Math.max(p, score));
        return;
      }

      const ate = nx === g.food.x && ny === g.food.y;
      const newSnake: Pos[] = [{ x: nx, y: ny }, ...g.snake];
      if (!ate) newSnake.pop();

      g.snake = newSnake;
      if (ate) {
        g.food = randomFood(newSnake);
        setFood(g.food);
        setScore((s) => s + 1);
      }
      setSnake(newSnake);
    }, SPEED);

    return () => clearInterval(interval);
  }, [started, gameOver, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (!started || gameOver)) {
        reset();
        setStarted(true);
        return;
      }

      if (!started || gameOver) return;

      const map: Record<string, Dir> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();

      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (nd === opp[dir]) return;

      setNextDir(nd);
      setDir(nd);
      gameRef.current.dir = nd;
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver, dir, reset]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);

    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#0d1a0d" : "#0a120a";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#00ff41" : "#00aa2a";
      ctx.shadowColor = "#00ff41";
      ctx.shadowBlur = i === 0 ? 6 : 2;
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = "#ffb000";
    ctx.shadowColor = "#ffb000";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <>
      <PipHeader />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-lg flex-1">
          <nav className="mb-6 flex items-center justify-between">
            <Link
              href="/apps/games"
              className="inline-flex items-center gap-1 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
            >
              <span aria-hidden="true">&lt;</span>
              <span>BACK</span>
            </Link>
            <div className="flex items-center gap-4 text-xs tracking-[0.1em] text-[#00aa2a]">
              <span>SCORE: <span className="text-[#00ff41]">{String(score).padStart(3, "0")}</span></span>
              <span>BEST: <span className="text-[#ffb000]">{String(highScore).padStart(3, "0")}</span></span>
            </div>
          </nav>

          <div className="pip-border flex justify-center rounded p-4">
            <canvas
              ref={canvasRef}
              width={GRID * CELL}
              height={GRID * CELL}
              className="block"
            />
          </div>

          {!started && !gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xs tracking-[0.15em] text-[#00aa2a]/80">
                PRESS <span className="text-[#00ff41]">ENTER</span> TO START
              </p>
              <p className="mt-1 text-[10px] tracking-[0.1em] text-[#00aa2a]/40">
                ARROW KEYS TO CONTROL
              </p>
            </div>
          )}

          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xs tracking-[0.15em] text-[#ffb000]">GAME OVER</p>
              <p className="mt-2 text-[10px] tracking-[0.1em] text-[#00aa2a]/60">
                PRESS <span className="text-[#00ff41]">ENTER</span> TO RESTART
              </p>
            </div>
          )}

          {started && !gameOver && (
            <div className="mt-4 text-center">
              <p className="text-[10px] tracking-[0.1em] text-[#00aa2a]/40">
                {score > 5 ? "NOT BAD, WASTELANDER" : score > 2 ? "KEEP GOING" : "USE ARROW KEYS"}
              </p>
            </div>
          )}
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
            VAULT-TEC™ RECREATIONAL SOFTWARE · SNAKE.EXE
          </p>
        </footer>
      </div>
    </>
  );
}
