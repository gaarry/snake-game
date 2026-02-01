# Snake Game

A classic Snake game built with TypeScript and React, featuring a modern neon aesthetic.

## Features

- 🎮 Classic snake gameplay with smooth controls
- 🏆 High score tracking (local storage)
- ⚡ Speed increases as you eat food
- 🌙 Dark neon aesthetic
- 📱 Responsive design
- ⌨️ Keyboard controls (Arrow keys or WASD)
- ⏸️ Pause/Resume functionality

## Tech Stack

- **TypeScript** - Type-safe game engine
- **React** - UI rendering
- **Vite** - Fast build tool
- **Vercel** - Deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deploy to Vercel with one command:

```bash
npm run deploy
```

## Controls

| Key | Action |
|-----|--------|
| ↑ / W | Move up |
| ↓ / S | Move down |
| ← / A | Move left |
| → / D | Move right |
| SPACE | Pause/Resume |
| ESC | Pause/Resume |

## Project Structure

```
snake-game/
├── common/              # Shared game engine code
│   └── game-engine/     # Snake game logic
│       ├── types.ts     # TypeScript types
│       ├── GameEngine.ts # Game state management
│       └── index.ts     # Exports
├── web/                 # React frontend
│   ├── src/
│   │   ├── App.tsx      # Main game component
│   │   ├── main.tsx     # Entry point
│   │   └── index.css    # Styles
│   └── public/
│       └── snake.svg    # App icon
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## License

MIT
