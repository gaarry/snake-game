import { SnakeGameEngine, DEFAULT_CONFIG } from './index';

describe('SnakeGameEngine', () => {
  beforeEach(() => {
    // Mock setInterval and clearInterval
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('creates game with snake at center', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const state = engine.getState();
    const center = Math.floor(DEFAULT_CONFIG.gridSize / 2);
    
    expect(state.snake.length).toBe(1);
    expect(state.snake[0]).toEqual({ x: center, y: center });
  });

  test('creates game with food not on snake', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const state = engine.getState();
    
    expect(state.food.x).not.toBe(state.snake[0].x);
    expect(state.food.y).not.toBe(state.snake[0].y);
  });

  test('initial direction is right', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const state = engine.getState();
    
    expect(state.direction).toEqual({ x: 1, y: 0 });
  });

  test('initial score is 0', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const state = engine.getState();
    
    expect(state.score).toBe(0);
  });

  test('initial state is not game over', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const state = engine.getState();
    
    expect(state.isGameOver).toBe(false);
    expect(state.isPaused).toBe(false);
  });
});

describe('Direction Control', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('can change direction to up', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    engine.setDirection({ x: 0, y: -1 });
    const state = engine.getState();
    
    expect(state.direction).toEqual({ x: 0, y: -1 });
  });

  test('can change direction to down', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    engine.setDirection({ x: 0, y: 1 });
    const state = engine.getState();
    
    expect(state.direction).toEqual({ x: 0, y: 1 });
  });

  test('cannot reverse direction when moving right', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    // Initial direction is right, try to go left
    engine.setDirection({ x: -1, y: 0 });
    const state = engine.getState();
    
    expect(state.direction).toEqual({ x: 1, y: 0 }); // Should still be moving right
  });

  test('can change direction to left after moving up', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    // First change direction to up
    engine.setDirection({ x: 0, y: -1 });
    // Then can change to left
    engine.setDirection({ x: -1, y: 0 });
    const state = engine.getState();
    
    expect(state.direction).toEqual({ x: -1, y: 0 });
  });
});

describe('Game Controls', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('pause stops the game', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    engine.start();
    
    engine.pause();
    const state = engine.getState();
    
    expect(state.isPaused).toBe(true);
  });

  test('resume continues the game', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    engine.start();
    engine.pause();
    
    engine.resume();
    const state = engine.getState();
    
    expect(state.isPaused).toBe(false);
  });

  test('reset returns to initial state', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    engine.start();
    
    engine.reset();
    const state = engine.getState();
    
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.snake.length).toBe(1);
  });

  test('destroy cleans up resources', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    engine.start();
    
    // Should not throw
    expect(() => engine.destroy()).not.toThrow();
  });
});

describe('State Callbacks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calls onStateChange when state changes', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const callback = jest.fn();
    
    engine.setOnStateChange(callback);
    
    // Trigger a state change
    engine.setDirection({ x: 0, y: -1 });
    
    expect(callback).toHaveBeenCalled();
  });
});

describe('High Score', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('high score starts at 0', () => {
    const engine = new SnakeGameEngine(DEFAULT_CONFIG);
    const state = engine.getState();
    
    expect(state.highScore).toBe(0);
  });
});

describe('Food Position', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('food is always within grid bounds', () => {
    for (let i = 0; i < 10; i++) {
      const engine = new SnakeGameEngine(DEFAULT_CONFIG);
      const state = engine.getState();
      
      expect(state.food.x).toBeGreaterThanOrEqual(0);
      expect(state.food.x).toBeLessThan(DEFAULT_CONFIG.gridSize);
      expect(state.food.y).toBeGreaterThanOrEqual(0);
      expect(state.food.y).toBeLessThan(DEFAULT_CONFIG.gridSize);
      
      engine.destroy();
    }
  });
});
