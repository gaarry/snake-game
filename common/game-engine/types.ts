export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
}

export interface GameConfig {
  gridSize: number;
  initialSpeed: number;
  speedIncrement: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 20,
  initialSpeed: 150,
  speedIncrement: 5,
};

export function createInitialState(config: GameConfig = DEFAULT_CONFIG): GameState {
  const center = Math.floor(config.gridSize / 2);
  return {
    snake: [{ x: center, y: center }],
    food: { x: center + 5, y: center },
    direction: { x: 1, y: 0 },
    score: 0,
    highScore: 0,
    isGameOver: false,
    isPaused: false,
    speed: config.initialSpeed,
  };
}
