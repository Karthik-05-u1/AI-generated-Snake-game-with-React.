import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === ' ' && hasStarted) { setIsPaused(p => !p); return; }
      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': if (currentDir.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': if (currentDir.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': if (currentDir.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': if (currentDir.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, hasStarted]);

  useEffect(() => {
    if (isPaused || gameOver) return;
    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || 
            prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const ns = s + 10;
            if (ns > highScore) setHighScore(ns);
            return ns;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full p-4 bg-black font-mono">
      <div className="w-full flex justify-between items-center mb-4 border-b-2 border-[#00FFFF] pb-2">
        <div>
          <span className="text-[#FF00FF]">YIELD: </span>
          <span className="text-2xl">{score.toString().padStart(4, '0')}</span>
        </div>
        <div>
          <span className="text-[#FF00FF]">MAX_YIELD: </span>
          <span className="text-2xl">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-[#FF00FF] bg-black p-1 w-full max-w-[400px]">
        <div 
          className="grid w-full"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            aspectRatio: '1/1'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border-[1px] border-[#00FFFF]/10
                  ${isHead ? 'bg-[#FF00FF]' : ''}
                  ${isBody ? 'bg-[#FF00FF]/70' : ''}
                  ${isFood ? 'bg-[#00FFFF] animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <div className="text-center border-2 border-[#00FFFF] p-6 bg-black">
              {!hasStarted ? (
                <>
                  <h2 className="text-4xl text-[#FF00FF] mb-4 glitch" data-text="INIT_SEQ">INIT_SEQ</h2>
                  <button onClick={resetGame} className="px-6 py-2 bg-[#00FFFF] text-black hover:bg-[#FF00FF] uppercase font-bold text-xl">
                    BOOT
                  </button>
                </>
              ) : gameOver ? (
                <>
                  <h2 className="text-4xl text-[#FF00FF] mb-4 glitch" data-text="FATAL_ERR">FATAL_ERR</h2>
                  <p className="text-[#00FFFF] mb-4">DATA_LOSS: {score}</p>
                  <button onClick={resetGame} className="px-6 py-2 bg-[#00FFFF] text-black hover:bg-[#FF00FF] uppercase font-bold text-xl">
                    RETRY
                  </button>
                </>
              ) : isPaused ? (
                <>
                  <h2 className="text-4xl text-[#00FFFF] mb-4 glitch" data-text="HALTED">HALTED</h2>
                  <button onClick={() => setIsPaused(false)} className="px-6 py-2 bg-[#FF00FF] text-black hover:bg-[#00FFFF] uppercase font-bold text-xl">
                    RESUME
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[200px] md:hidden">
        <div />
        <button className="bg-[#FF00FF] text-black p-4 font-bold active:bg-[#00FFFF]" onClick={() => { if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 }) }}>UP</button>
        <div />
        <button className="bg-[#FF00FF] text-black p-4 font-bold active:bg-[#00FFFF]" onClick={() => { if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 }) }}>LT</button>
        <button className="bg-[#FF00FF] text-black p-4 font-bold active:bg-[#00FFFF]" onClick={() => { if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 }) }}>DN</button>
        <button className="bg-[#FF00FF] text-black p-4 font-bold active:bg-[#00FFFF]" onClick={() => { if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 }) }}>RT</button>
      </div>
    </div>
  );
}
