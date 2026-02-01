import { useEffect, useRef, useCallback, useState } from 'react';
import { SnakeGameEngine, Position, GameState, DEFAULT_CONFIG } from '@/game-engine';

const CELL_SIZE = 20;

export default function App() {
  const engineRef = useRef<SnakeGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [config] = useState(DEFAULT_CONFIG);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  // Initialize engine
  useEffect(() => {
    engineRef.current = new SnakeGameEngine(config);
    engineRef.current.setOnStateChange(setGameState);

    return () => {
      engineRef.current?.destroy();
    };
  }, [config]);

  // Calculate board size
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 500);
      const maxHeight = Math.min(window.innerHeight - 300, 500);
      const size = Math.min(maxWidth, maxHeight);
      setBoardSize({
        width: size,
        height: size,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      const directionMap: Record<string, Position> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
        W: { x: 0, y: -1 },
        S: { x: 0, y: 1 },
        A: { x: -1, y: 0 },
        D: { x: 1, y: 0 },
      };

      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        const state = engineRef.current.getState();
        if (state.isGameOver) {
          engineRef.current.reset();
          engineRef.current.start();
        } else if (state.isPaused) {
          engineRef.current.resume();
        } else {
          engineRef.current.pause();
        }
        return;
      }

      const direction = directionMap[e.key];
      if (direction) {
        e.preventDefault();
        engineRef.current.setDirection(direction);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Start game on mount
  useEffect(() => {
    engineRef.current?.start();
  }, []);

  if (!gameState) {
    return <div className="game-container">Loading...</div>;
  }

  const gridWidth = config.gridSize * CELL_SIZE;
  const gridHeight = config.gridSize * CELL_SIZE;

  return (
    <div className="game-container" ref={containerRef}>
      <div className="header">
        <h1 className="title">🐍 Snake Game</h1>
      </div>

      <div className="score-board">
        <div className="score-item">
          <div className="score-label">Score</div>
          <div className="score-value">{gameState.score}</div>
        </div>
        <div className="score-item">
          <div className="score-label">High Score</div>
          <div className="score-value">{gameState.highScore}</div>
        </div>
      </div>

      <div
        className="game-board"
        style={{
          width: boardSize.width,
          height: boardSize.height,
        }}
      >
        <div
          className="grid"
          style={{
            width: gridWidth,
            height: gridHeight,
            position: 'relative',
            margin: '0 auto',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Grid background */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
            }}
          >
            <defs>
              <pattern
                id="grid"
                width={CELL_SIZE}
                height={CELL_SIZE}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Food */}
          <div
            className="cell food"
            style={{
              left: gameState.food.x * CELL_SIZE,
              top: gameState.food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />

          {/* Snake */}
          {gameState.snake.map((cell: Position, index: number) => (
            <div
              key={`${cell.x}-${cell.y}-${index}`}
              className={`cell ${index === 0 ? 'snake-head' : 'snake'}`}
              style={{
                left: cell.x * CELL_SIZE,
                top: cell.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))}

          {/* Game Over Overlay */}
          {gameState.isGameOver && (
            <div className="game-over-overlay">
              <h2 className="game-over-title">Game Over!</h2>
              {gameState.score >= gameState.highScore && gameState.score > 0 && (
                <p className="new-high-score">🎉 New High Score!</p>
              )}
              <p style={{ color: '#94a3b8' }}>Press SPACE to play again</p>
            </div>
          )}

          {/* Paused Overlay */}
          {gameState.isPaused && !gameState.isGameOver && (
            <div className="game-over-overlay">
              <h2 style={{ color: '#8b5cf6' }}>Paused</h2>
              <p style={{ color: '#94a3b8' }}>Press SPACE to resume</p>
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        <p className="controls-hint">Use Arrow Keys or WASD to move</p>
        <div className="game-buttons">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (gameState.isGameOver) {
                engineRef.current?.reset();
              }
              engineRef.current?.start();
            }}
          >
            {gameState.isGameOver ? 'Restart' : gameState.isPaused ? 'Resume' : 'Start'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (gameState.isPaused) {
                engineRef.current?.resume();
              } else {
                engineRef.current?.pause();
              }
            }}
            disabled={gameState.isGameOver}
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    </div>
  );
}
