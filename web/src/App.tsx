import { useEffect, useRef, useCallback, useState } from 'react';
import { SnakeGameEngine, Position, GameState, DEFAULT_CONFIG, GameConfig } from '@/game-engine';

// Game modes
type GameMode = 'classic' | 'time-attack' | 'infinite';

const CELL_SIZE = 20;
const MODE_CONFIGS: Record<GameMode, GameConfig> = {
  classic: { ...DEFAULT_CONFIG, gridSize: 20, initialSpeed: 150, speedIncrement: 5 },
  'time-attack': { ...DEFAULT_CONFIG, gridSize: 15, initialSpeed: 120, speedIncrement: 8 },
  infinite: { ...DEFAULT_CONFIG, gridSize: 25, initialSpeed: 200, speedIncrement: 2 },
};

export default function App() {
  const engineRef = useRef<SnakeGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [timeLeft, setTimeLeft] = useState(60);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; color: string}>>([]);
  const [isShake, setIsShake] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const particleIdRef = useRef(0);
  const touchStartRef = useRef<{x: number; y: number} | null>(null);

  // Initialize engine
  useEffect(() => {
    const modeConfig = MODE_CONFIGS[gameMode];
    setConfig(modeConfig);
    engineRef.current = new SnakeGameEngine(modeConfig);
    engineRef.current.setOnStateChange(setGameState);
    setTimeLeft(gameMode === 'time-attack' ? 60 : 0);

    return () => {
      engineRef.current?.destroy();
    };
  }, [gameMode]);

  // Calculate board size
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 450);
      const maxHeight = Math.min(window.innerHeight - 500, 450);
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

  // Touch swipe controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !engineRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipe = 40;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipe) {
        engineRef.current.setDirection({ x: 1, y: 0 });
      } else if (deltaX < -minSwipe) {
        engineRef.current.setDirection({ x: -1, y: 0 });
      }
    } else {
      if (deltaY > minSwipe) {
        engineRef.current.setDirection({ x: 0, y: 1 });
      } else if (deltaY < -minSwipe) {
        engineRef.current.setDirection({ x: 0, y: -1 });
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Time attack timer
  useEffect(() => {
    if (gameMode !== 'time-attack' || !gameState) return;
    if (gameState.isGameOver || gameState.isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (engineRef.current) {
            const currentState = engineRef.current.getState();
            if (!currentState.isGameOver) {
              engineRef.current.destroy();
              setGameState(prev => prev ? { ...prev, isGameOver: true, isPaused: false } : null);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, gameState]);

  // Create particles
  const createParticles = useCallback((x: number, y: number, color: string, count: number = 12) => {
    const newParticles = Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      x: x * CELL_SIZE + CELL_SIZE / 2,
      y: y * CELL_SIZE + CELL_SIZE / 2,
      color,
    }));
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 800);
  }, []);

  // Handle eat food
  const handleEatFood = useCallback(() => {
    if (gameState && gameState.food) {
      createParticles(gameState.food.x, gameState.food.y, '#ff00ff', 12);
    }
  }, [gameState, createParticles]);

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
          const modeConfig = MODE_CONFIGS[gameMode];
          engineRef.current = new SnakeGameEngine(modeConfig);
          engineRef.current.setOnStateChange(setGameState);
          setTimeLeft(gameMode === 'time-attack' ? 60 : 0);
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
    [gameMode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Start game on mount
  useEffect(() => {
    engineRef.current?.start();
  }, [config]);

  // Handle game over shake
  useEffect(() => {
    if (gameState?.isGameOver && containerRef.current) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  }, [gameState?.isGameOver]);

  // Track eating food
  const prevScoreRef = useRef<number>(gameState?.score || 0);
  useEffect(() => {
    if (gameState && gameState.score > prevScoreRef.current) {
      handleEatFood();
      prevScoreRef.current = gameState.score;
    }
  }, [gameState?.score, handleEatFood]);

  if (!gameState) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const gridWidth = config.gridSize * CELL_SIZE;
  const gridHeight = config.gridSize * CELL_SIZE;

  return (
    <>
      {/* Background Effects */}
      <div className="background-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="game-container" ref={containerRef}>
        <div className="header">
          <h1 className="title">SNAKE</h1>
          <p className="title-subtitle">Neo Arcade</p>
        </div>

        {/* Game Mode Selector */}
        <div className="mode-selector">
          {(['classic', 'time-attack', 'infinite'] as GameMode[]).map((mode) => (
            <button
              key={mode}
              className={`mode-btn ${gameMode === mode ? 'active' : ''}`}
              onClick={() => {
                setGameMode(mode);
                engineRef.current?.destroy();
              }}
            >
              {mode.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="score-board">
          <div className="score-panel">
            <div className="score-label">Score</div>
            <div className="score-value">{gameState.score}</div>
          </div>
          <div className="score-panel high-score">
            <div className="score-label">High Score</div>
            <div className="score-value">{gameState.highScore}</div>
          </div>
          {gameMode === 'time-attack' && (
            <div className="score-panel">
              <div className="score-label">Time</div>
              <div 
                className="score-value" 
                style={{ 
                  color: timeLeft <= 10 ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                  textShadow: timeLeft <= 10 ? '0 0 20px var(--neon-pink)' : '0 0 15px var(--neon-cyan)'
                }}
              >
                {timeLeft}s
              </div>
            </div>
          )}
        </div>

        <div className={`game-board-container ${isShake ? 'screen-shake' : ''}`}>
          <div
            className="game-board"
            style={{
              width: boardSize.width + 40,
              height: boardSize.height + 40,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="grid"
              style={{
                width: gridWidth,
                height: gridHeight,
                position: 'relative',
                margin: '0 auto',
              }}
            >
              {/* Grid lines */}
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
                    id="grid-lines"
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`}
                      fill="none"
                      stroke="var(--neon-cyan)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-lines)" />
              </svg>

              {/* Food */}
              <div
                className="food"
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
                  className={`snake-segment ${index === 0 ? 'snake-head' : 'snake-body'}`}
                  style={{
                    left: cell.x * CELL_SIZE,
                    top: cell.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                />
              ))}

              {/* Particles */}
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: particle.x - 6,
                    top: particle.y - 6,
                    width: 12,
                    height: 12,
                    background: particle.color,
                    boxShadow: `0 0 15px ${particle.color}, 0 0 30px ${particle.color}`,
                  }}
                />
              ))}

              {/* Game Over Overlay */}
              {gameState.isGameOver && (
                <div className="game-over-overlay">
                  <h2 className="game-over-title">GAME OVER</h2>
                  {gameState.score >= gameState.highScore && gameState.score > 0 && (
                    <p className="new-high-score">★ NEW HIGH SCORE ★</p>
                  )}
                  <p className="final-score">SCORE: {gameState.score}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>
                    Tap to restart
                  </p>
                </div>
              )}

              {/* Paused Overlay */}
              {gameState.isPaused && !gameState.isGameOver && (
                <div className="paused-overlay">
                  <h2 className="paused-title">PAUSED</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Tap to resume
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Virtual D-Pad for Mobile */}
        <div className="dpad">
          <div className="dpad-row">
            <button className="dpad-btn" onClick={() => engineRef.current?.setDirection({ x: 0, y: -1 })}>↑</button>
          </div>
          <div className="dpad-row">
            <button className="dpad-btn" onClick={() => engineRef.current?.setDirection({ x: -1, y: 0 })}>←</button>
            <div className="dpad-center"></div>
            <button className="dpad-btn" onClick={() => engineRef.current?.setDirection({ x: 1, y: 0 })}>→</button>
          </div>
          <div className="dpad-row">
            <button className="dpad-btn" onClick={() => engineRef.current?.setDirection({ x: 0, y: 1 })}>↓</button>
          </div>
        </div>

        <div className="controls">
          <p className="controls-hint">
            [ ↑ ↓ ← → ] or [ W A S D ] to move • [ SPACE ] to pause
          </p>
          <p className="mobile-hint">
            Swipe or use D-pad to move on mobile
          </p>
          <div className="game-buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (gameState.isGameOver) {
                  engineRef.current?.destroy();
                  const modeConfig = MODE_CONFIGS[gameMode];
                  engineRef.current = new SnakeGameEngine(modeConfig);
                  engineRef.current.setOnStateChange(setGameState);
                  setTimeLeft(gameMode === 'time-attack' ? 60 : 0);
                }
                engineRef.current?.start();
              }}
            >
              {gameState.isGameOver ? 'RESTART' : gameState.isPaused ? 'RESUME' : 'START'}
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
              {gameState.isPaused ? 'RESUME' : 'PAUSE'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
