import { Position, GameState, GameConfig, DEFAULT_CONFIG } from './types';

export class SnakeGameEngine {
  private state: GameState;
  private config: GameConfig;
  private intervalId: number | null = null;
  private onStateChange: ((state: GameState) => void) | null = null;

  constructor(config: GameConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    const gridSize = this.config.gridSize;
    const center = Math.floor(gridSize / 2);
    return {
      snake: [{ x: center, y: center }],
      food: this.generateFood([{ x: center, y: center }]),
      direction: { x: 1, y: 0 },
      score: 0,
      highScore: 0,
      isGameOver: false,
      isPaused: false,
      speed: this.config.initialSpeed,
    };
  }

  private generateFood(snake: Position[]): Position {
    const gridSize = this.config.gridSize;
    let newFood: Position;
    const occupied = new Set(snake.map(p => `${p.x},${p.y}`));

    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (occupied.has(`${newFood.x},${newFood.y}`));

    return newFood;
  }

  private isOppositeDirection(dir1: Position, dir2: Position): boolean {
    return dir1.x === -dir2.x && dir1.y === -dir2.y;
  }

  private hasCollided(head: Position, snake: Position[]): boolean {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= this.config.gridSize ||
      head.y < 0 ||
      head.y >= this.config.gridSize
    ) {
      return true;
    }

    // Self collision
    const occupied = new Set(snake.slice(0, -1).map(p => `${p.x},${p.y}`));
    return occupied.has(`${head.x},${head.y}`);
  }

  setOnStateChange(callback: (state: GameState) => void): void {
    this.onStateChange = callback;
  }

  private notifyStateChange(): void {
    this.onStateChange?.(this.state);
  }

  getState(): GameState {
    return { ...this.state };
  }

  start(): void {
    if (this.state.isGameOver) {
      this.state = this.createInitialState();
    }
    this.state.isPaused = false;
    this.notifyStateChange();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = window.setInterval(() => this.update(), this.state.speed);
  }

  pause(): void {
    this.state.isPaused = true;
    this.notifyStateChange();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume(): void {
    if (!this.state.isPaused || this.state.isGameOver) return;
    this.state.isPaused = false;
    this.notifyStateChange();
    this.intervalId = window.setInterval(() => this.update(), this.state.speed);
  }

  setDirection(direction: Position): void {
    if (this.isOppositeDirection(this.state.direction, direction)) {
      return;
    }
    this.state.direction = direction;
  }

  private update(): void {
    if (this.state.isGameOver || this.state.isPaused) return;

    const head = this.state.snake[0];
    const newHead: Position = {
      x: head.x + this.state.direction.x,
      y: head.y + this.state.direction.y,
    };

    if (this.hasCollided(newHead, this.state.snake)) {
      this.state.isGameOver = true;
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.notifyStateChange();
      return;
    }

    const newSnake = [newHead, ...this.state.snake];

    // Check if food eaten
    if (newHead.x === this.state.food.x && newHead.y === this.state.food.y) {
      this.state.score += 10;
      // Increase speed
      this.state.speed = Math.max(50, this.state.speed - this.config.speedIncrement);
      
      // Restart interval with new speed
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = window.setInterval(() => this.update(), this.state.speed);
      }

      this.state.food = this.generateFood(newSnake);
    } else {
      newSnake.pop();
    }

    this.state.snake = newSnake;
    this.notifyStateChange();
  }

  reset(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state = this.createInitialState();
    this.notifyStateChange();
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
