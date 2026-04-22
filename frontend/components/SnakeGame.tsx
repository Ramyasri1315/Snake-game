import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, GAME_SPEED_MS } from '../constants';
import { useInterval } from '../hooks/useInterval';
import { Terminal, Play, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
}

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const lastProcessedDirection = useRef<Direction>(Direction.UP);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
    const savedHighScore = localStorage.getItem('snakeHighScoreGlitch');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    setIsPaused(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScoreGlitch', score.toString());
    }
  }, [score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(Direction.UP);
    lastProcessedDirection.current = Direction.UP;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
    if (onScoreChange) onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      lastProcessedDirection.current = direction;

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 1;
        setScore(newScore);
        if (onScoreChange) onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, handleGameOver, onScoreChange]);

  useInterval(moveSnake, isPaused || gameOver ? null : GAME_SPEED_MS);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (hasStarted) {
          setIsPaused((prev) => !prev);
        } else {
          resetGame();
        }
        return;
      }

      if (isPaused) return;

      const currentDir = lastProcessedDirection.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted]);

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = "w-full h-full ";
        
        if (isSnakeHead) {
          cellClass += "bg-glitch-magenta border-2 border-white z-10 relative";
        } else if (isSnakeBody) {
          cellClass += "bg-glitch-cyan border border-glitch-black";
        } else if (isFood) {
          cellClass += "bg-glitch-yellow animate-pulse";
        } else {
          cellClass += "bg-glitch-gray/20 border border-glitch-gray/40";
        }

        cells.push(
          <div key={`${x}-${y}`} className="p-[1px]">
            <div className={cellClass} />
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Score Board */}
      <div className="flex justify-between items-center bg-glitch-black border-4 border-glitch-magenta p-4 shadow-glitch-cyan w-full max-w-[400px]">
        <div className="flex flex-col">
          <span className="text-glitch-cyan text-lg">>> CYCLES</span>
          <span className="text-4xl font-bold text-white">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-glitch-yellow text-lg flex items-center justify-end gap-2">
            <Terminal size={16} /> MAX_CYCLES
          </span>
          <span className="text-4xl font-bold text-glitch-magenta">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-2 bg-glitch-black border-4 border-glitch-cyan shadow-glitch-yellow">
        
        {/* The Grid */}
        <div 
          className="grid bg-glitch-dark"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver || (isPaused && hasStarted && !gameOver)) && (
          <div className="absolute inset-0 bg-glitch-black/90 flex flex-col items-center justify-center z-20 border-4 border-glitch-magenta m-2">
            {!hasStarted ? (
              <div className="text-center flex flex-col items-center gap-6 p-4">
                <h2 className="text-5xl font-bold text-white glitch-text" data-text="[AWAITING_INPUT]">
                  [AWAITING_INPUT]
                </h2>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-4 bg-glitch-cyan text-glitch-black font-bold text-2xl hover:bg-white hover:text-black border-b-4 border-glitch-magenta active:translate-y-1"
                >
                  <Play size={24} fill="currentColor" /> INITIATE_SEQUENCE
                </button>
              </div>
            ) : gameOver ? (
              <div className="text-center flex flex-col items-center gap-6 p-4 screen-tear">
                <h2 className="text-6xl font-bold text-glitch-magenta glitch-text" data-text="FATAL_ERROR">
                  FATAL_ERROR
                </h2>
                <div className="bg-glitch-gray p-4 border-l-4 border-glitch-yellow text-left w-full">
                  <p className="text-xl text-white">ENTITY_TERMINATED</p>
                  <p className="text-glitch-cyan">CYCLES_SURVIVED: {score}</p>
                </div>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-4 bg-glitch-yellow text-glitch-black font-bold text-2xl hover:bg-white hover:text-black border-b-4 border-glitch-magenta active:translate-y-1"
                >
                  <RotateCcw size={24} /> REBOOT_SYSTEM
                </button>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center gap-6 p-4">
                <h2 className="text-5xl font-bold text-glitch-cyan glitch-text" data-text="SYSTEM_HALT">
                  SYSTEM_HALT
                </h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-glitch-magenta text-white font-bold text-2xl hover:bg-white hover:text-black border-b-4 border-glitch-cyan active:translate-y-1"
                >
                  <Play size={24} fill="currentColor" /> RESUME_EXECUTION
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
