import '@testing-library/jest-dom';

// Mock setInterval
const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;

global.setInterval = jest.fn((callback: Function, delay: number) => {
  return originalSetInterval(callback, delay) as unknown as number;
}) as unknown as typeof setInterval;

global.clearInterval = jest.fn((id: number) => {
  originalClearInterval(id);
}) as unknown as typeof clearInterval;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Touch events for mobile testing
Element.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
